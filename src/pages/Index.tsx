import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  Eye, 
  GraduationCap, 
  Layers, 
  UserCheck, 
  Shield,
  TrendingDown,
  Target,
  AlertTriangle,
  Clock
} from "lucide-react";
import veriHireLogo from "@/assets/verihire-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src={veriHireLogo} 
                alt="VeriHire" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary"
                onClick={() => window.location.href = "/auth"}
              >
                Sign In
              </Button>
              <Button onClick={() => window.location.href = "/auth"}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-background py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Transform your hiring with{" "}
                <span className="text-primary">ethical AI</span> that builds trust.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                VeriHire is the transparent, bias-free hiring platform that empowers HR teams with explainable AI, ensuring every decision is fair, accountable, and effective.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 h-14"
                  onClick={() => window.location.href = "/auth"}
                >
                  Start Hiring
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 h-14"
                  onClick={() => window.location.href = "/auth"}
                >
                  Apply for Work →
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="absolute top-8 left-8 w-32 h-20 bg-white rounded-xl shadow-lg border border-border/20 flex items-center justify-center">
                  <div className="w-16 h-2 bg-primary/20 rounded-full"></div>
                </div>
                <div className="absolute top-32 right-12 w-40 h-24 bg-white rounded-xl shadow-lg border border-border/20 flex items-center justify-center">
                  <div className="space-y-2">
                    <div className="w-20 h-2 bg-primary/30 rounded-full"></div>
                    <div className="w-16 h-2 bg-muted rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-20 left-12 w-36 h-28 bg-white rounded-xl shadow-lg border border-border/20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full"></div>
                </div>
                <div className="absolute bottom-8 right-8 w-28 h-16 bg-primary/90 rounded-xl shadow-lg flex items-center justify-center">
                  <div className="w-12 h-2 bg-white/80 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              The Problem: Hiring is Broken
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Current AI is a black box. The hiring process is plagued by inefficiency, bias, and a critical lack of trust in AI-driven solutions, leading to costly and often poor hiring decisions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Inefficient & Expensive
                </h3>
                <p className="text-muted-foreground">
                  Companies spend £3,700 per hire on average, with roles staying open for weeks, delaying revenue and productivity.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Riddled with Bias
                </h3>
                <p className="text-muted-foreground">
                  Unconscious bias in manual screening leads to homogenous teams and missed opportunities with diverse, high-potential candidates.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  The 'AI Trust Deficit'
                </h3>
                <p className="text-muted-foreground">
                  99% of managers use AI, but 93% believe humans are still essential. They don't trust opaque algorithms to make critical hiring decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Academic Integrity Crisis
                </h3>
                <p className="text-muted-foreground">
                  Remote hiring has made it easier for candidates to cheat on assessments, leading to costly 'bad hires' and compromised talent pipelines.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Our Solution: VeriHire
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              VeriHire is an all-in-one, AI-powered recruitment platform designed from the ground up to build trust and deliver superior hiring outcomes. We turn the 'black box' of AI into a clear, understandable co-pilot for HR professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Layers className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  All-in-One Platform
                </h3>
                <p className="text-muted-foreground text-lg">
                  From sourcing to screening to interviewing, we replace a messy, expensive tech stack with one seamless, intelligent solution.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <UserCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Empowers, Doesn't Replace
                </h3>
                <p className="text-muted-foreground text-lg">
                  Our 'co-pilot' model provides powerful data and recommendations, but keeps the human recruiter in complete control.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Built on Trust
                </h3>
                <p className="text-muted-foreground text-lg">
                  Our core differentiators—Explainable AI, Ethical Proctoring, and Bias Mitigation—are designed to create confidence and integrity in the hiring process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img 
                src={veriHireLogo} 
                alt="VeriHire" 
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-primary-foreground/80">
                © 2024 VeriHire. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;