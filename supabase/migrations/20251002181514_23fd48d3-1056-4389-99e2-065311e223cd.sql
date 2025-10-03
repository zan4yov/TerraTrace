-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'auditor', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Migrate existing role data from profiles to user_roles
-- Using text cast to handle different enum types
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id, 
  CASE role::text
    WHEN 'admin' THEN 'admin'::app_role
    WHEN 'auditor' THEN 'auditor'::app_role
    ELSE 'viewer'::app_role
  END
FROM public.profiles
WHERE role IS NOT NULL;

-- Drop ALL old policies that depend on the role column
-- Vendors
DROP POLICY IF EXISTS "Users can view vendors" ON public.vendors;
DROP POLICY IF EXISTS "Admins can insert vendors" ON public.vendors;
DROP POLICY IF EXISTS "Admins can update vendors" ON public.vendors;
DROP POLICY IF EXISTS "Admins can delete vendors" ON public.vendors;
DROP POLICY IF EXISTS "Admins and auditors can insert vendors" ON public.vendors;
DROP POLICY IF EXISTS "Admins and auditors can update vendors" ON public.vendors;

-- Regulations
DROP POLICY IF EXISTS "Users can view regulations" ON public.regulations;
DROP POLICY IF EXISTS "Admins can insert regulations" ON public.regulations;
DROP POLICY IF EXISTS "Admins can update regulations" ON public.regulations;
DROP POLICY IF EXISTS "Admins can delete regulations" ON public.regulations;

-- Audits
DROP POLICY IF EXISTS "Users can view audits" ON public.audits;
DROP POLICY IF EXISTS "Auditors can insert audits" ON public.audits;
DROP POLICY IF EXISTS "Auditors can update audits" ON public.audits;
DROP POLICY IF EXISTS "Admins can delete audits" ON public.audits;
DROP POLICY IF EXISTS "Auditors and admins can insert audits" ON public.audits;
DROP POLICY IF EXISTS "Auditors and admins can update audits" ON public.audits;

-- ESG Reports
DROP POLICY IF EXISTS "Users can view reports" ON public.esg_reports;
DROP POLICY IF EXISTS "Admins can insert reports" ON public.esg_reports;
DROP POLICY IF EXISTS "Admins can update reports" ON public.esg_reports;
DROP POLICY IF EXISTS "Admins can delete reports" ON public.esg_reports;
DROP POLICY IF EXISTS "Auditors and admins can insert ESG reports" ON public.esg_reports;

-- Now drop the role column from profiles
ALTER TABLE public.profiles DROP COLUMN role CASCADE;

-- Drop the old user_role enum
DROP TYPE IF EXISTS public.user_role;

-- Create new RLS policies using has_role function

-- Vendors table policies
CREATE POLICY "Authenticated users can view vendors"
ON public.vendors FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert vendors"
ON public.vendors FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update vendors"
ON public.vendors FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete vendors"
ON public.vendors FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Regulations table policies
CREATE POLICY "Authenticated users can view regulations"
ON public.regulations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert regulations"
ON public.regulations FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update regulations"
ON public.regulations FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete regulations"
ON public.regulations FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Audits table policies
CREATE POLICY "Authenticated users can view audits"
ON public.audits FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Auditors and admins can insert audits"
ON public.audits FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'auditor') OR 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Auditors and admins can update audits"
ON public.audits FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'auditor') OR 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete audits"
ON public.audits FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ESG Reports table policies
CREATE POLICY "Authenticated users can view reports"
ON public.esg_reports FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert reports"
ON public.esg_reports FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
ON public.esg_reports FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reports"
ON public.esg_reports FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Assign admin role to the first user for testing
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
ORDER BY created_at
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;