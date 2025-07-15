import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useAuthForm } from "@/hooks/useAuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const {
    loading,
    formData,
    handleInputChange,
    handleRoleChange,
    handleSignIn,
    handleSignUp
  } = useAuthForm();

  useEffect(() => {
    // Check if user is already logged in and redirect based on role
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Get user profile to determine role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (profile?.role === 'candidate') {
          navigate("/candidate-dashboard");
        } else if (profile?.role === 'employer') {
          navigate("/employer-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    };
    checkSession();
  }, [navigate]);


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader
          title="Welcome to VeriHire"
          description="Sign in to your account or create a new one"
        />

        <Card className="w-full">
          <CardContent className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <SignInForm
                  formData={formData}
                  loading={loading}
                  onInputChange={handleInputChange}
                  onSubmit={handleSignIn}
                />
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <SignUpForm
                  formData={formData}
                  loading={loading}
                  onInputChange={handleInputChange}
                  onRoleChange={handleRoleChange}
                  onSubmit={handleSignUp}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;