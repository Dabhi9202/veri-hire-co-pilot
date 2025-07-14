import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building, Users, Briefcase, FileText, Plus, Eye } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  company_name: string | null;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary_range: string;
  job_type: string;
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  status: string;
  created_at: string;
  ai_score: number | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  jobs: {
    title: string;
  };
}

const EmployerDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      
      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileData?.role !== 'employer') {
        navigate("/candidate-dashboard");
        return;
      }

      setProfile(profileData);
      await fetchJobs(profileData.id);
      await fetchApplications(profileData.id);
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const fetchJobs = async (employerId: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching jobs",
        description: error.message,
      });
    } else {
      setJobs(data || []);
    }
  };

  const fetchApplications = async (employerId: string) => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          email
        ),
        jobs!inner (
          title,
          employer_id
        )
      `)
      .eq('jobs.employer_id', employerId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching applications",
        description: error.message,
      });
    } else {
      setApplications(data || []);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500';
      case 'screening': return 'bg-yellow-500';
      case 'interview': return 'bg-purple-500';
      case 'hired': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">V</span>
            </div>
            <h1 className="text-xl font-bold">VeriHire</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome to VeriHire Dashboard
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Employer Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your job postings and review candidates
          </p>
          {profile?.company_name && (
            <p className="text-sm text-muted-foreground">
              {profile.company_name}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Building className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {applications.filter(app => app.status === 'hired').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Hired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Applications ({applications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applications yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Applications will appear here when candidates apply to your jobs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {application.profiles.first_name} {application.profiles.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {application.profiles.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Applied for: {application.jobs.title}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                          {application.ai_score && (
                            <span className="font-medium text-primary">
                              AI Score: {application.ai_score}/100
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  My Job Posts ({jobs.length})
                </CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No jobs posted yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Create your first job posting to start hiring
                    </p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {job.location} • {job.job_type}
                            </p>
                            {job.salary_range && (
                              <p className="text-sm text-green-600 font-medium">
                                {job.salary_range}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                              {job.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {job.description.substring(0, 200)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Posted: {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiring Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Analytics coming soon</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Track your hiring performance and candidate insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerDashboard;