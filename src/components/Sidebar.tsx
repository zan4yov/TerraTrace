import { LayoutDashboard, Users, FileText, AlertCircle, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "vendors", label: "Vendors", icon: Users },
  { id: "regulations", label: "Regulations", icon: FileText },
  { id: "audits", label: "Audits", icon: AlertCircle },
  { id: "chat", label: "AI Assistant", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">ESG Tracker</h1>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  currentView === item.id && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};
