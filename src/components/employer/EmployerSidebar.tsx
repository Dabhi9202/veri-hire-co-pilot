import { Building2, Briefcase, Users, User, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import veriHireLogo from "@/assets/verihire-logo.png";

interface EmployerSidebarProps {
  userProfile?: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
  };
}

export const EmployerSidebar = ({ userProfile }: EmployerSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const sidebarItems = [
    { title: "Dashboard", icon: Building2, path: "/employer-dashboard" },
    { title: "Jobs", icon: Briefcase, path: "/employer/jobs" },
    { title: "Candidates", icon: Users, path: "/employer/candidates" },
    { title: "Company Profile", icon: User, path: "/employer/profile" },
    { title: "Settings", icon: Settings, path: "/employer/settings" }
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <img 
          src={veriHireLogo} 
          alt="VeriHire" 
          className="h-8 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <p className="text-sm font-medium text-foreground">
            {userProfile?.company_name || "Company"}
          </p>
          <p className="text-xs text-muted-foreground">
            {userProfile?.first_name} {userProfile?.last_name}
          </p>
        </div>
        <Separator className="mb-3" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};