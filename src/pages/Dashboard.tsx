import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  LogOut,
  UserCircle,
  Building2,
  FileText,
  Settings
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Get user profile to determine role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        navigate("/auth");
        return;
      }

      // Redirect based on role
      if (profile?.role === 'candidate') {
        navigate("/candidate-dashboard", { replace: true });
      } else if (profile?.role === 'employer') {
        navigate("/employer-dashboard", { replace: true });
      } else {
        // Default to employer dashboard for admin or unknown roles
        navigate("/employer-dashboard", { replace: true });
      }
    };

    checkUserAndRedirect();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: error.message,
        });
      } else {
        toast({
          title: "Signed out successfully",
          description: "You have been logged out.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again.",
      });
    }
  };

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;