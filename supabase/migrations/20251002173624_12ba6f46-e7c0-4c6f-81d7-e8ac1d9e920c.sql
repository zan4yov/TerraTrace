-- Create enum types for ESG compliance
CREATE TYPE compliance_status AS ENUM ('compliant', 'review', 'non-compliant');
CREATE TYPE report_type AS ENUM ('emissions', 'waste', 'safety', 'general');
CREATE TYPE audit_result AS ENUM ('passed', 'failed', 'pending');
CREATE TYPE user_role AS ENUM ('admin', 'auditor', 'viewer');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role user_role DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  sector TEXT NOT NULL,
  compliance_status compliance_status DEFAULT 'review',
  co2_level TEXT,
  safety_rating TEXT,
  last_audit_date DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create regulations table
CREATE TABLE public.regulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  threshold TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audits table
CREATE TABLE public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  auditor TEXT NOT NULL,
  audit_date DATE NOT NULL,
  status TEXT NOT NULL,
  result audit_result,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  findings TEXT,
  conducted_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ESG reports table
CREATE TABLE public.esg_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  unit TEXT,
  report_date DATE NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for vendors (all authenticated users can read, only admins/auditors can modify)
CREATE POLICY "Anyone can view vendors"
  ON public.vendors FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and auditors can insert vendors"
  ON public.vendors FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'auditor')
    )
  );

CREATE POLICY "Admins and auditors can update vendors"
  ON public.vendors FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'auditor')
    )
  );

-- RLS Policies for regulations (read-only for all, admins can modify)
CREATE POLICY "Anyone can view regulations"
  ON public.regulations FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert regulations"
  ON public.regulations FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- RLS Policies for audits
CREATE POLICY "Anyone can view audits"
  ON public.audits FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auditors and admins can insert audits"
  ON public.audits FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'auditor')
    )
  );

-- RLS Policies for ESG reports
CREATE POLICY "Anyone can view ESG reports"
  ON public.esg_reports FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auditors and admins can insert ESG reports"
  ON public.esg_reports FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'auditor')
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample regulations data
INSERT INTO public.regulations (name, category, description, threshold) VALUES
  ('ISO 14001:2015', 'Environmental Management', 'International standard for environmental management systems', '95% compliance required'),
  ('ISO 45001:2018', 'Occupational Safety', 'Standard for occupational health and safety management systems', '90% compliance required'),
  ('PROPER (Green Rating)', 'Environmental Performance', 'Indonesian environmental performance rating program', 'Blue rating minimum'),
  ('SMK3 PP 50/2012', 'Safety Management', 'Indonesian occupational safety and health management system', '80% implementation'),
  ('UU 32/2009', 'Environmental Protection', 'Law on environmental protection and management', 'Full compliance');
