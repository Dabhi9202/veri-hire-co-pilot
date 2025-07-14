import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Briefcase, FileText, Clock, CheckCircle, X, Plus } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary_range: string;
  job_type: string;
  created_at: string;
}

interface Application {
  id: string;
  status: string;
  created_at: string;
  ai_score: number | null;
  jobs: Job;
}

const CandidateDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
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

      if (profileData?.role !== 'candidate') {
        navigate("/dashboard");
        return;
      }

      setProfile(profileData);
      await fetchApplications(profileData.id);
      await fetchAvailableJobs();
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const fetchApplications = async (candidateId: string) => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          description,
          location,
          salary_range,
          job_type,
          created_at
        )
      `)
      .eq('candidate_id', candidateId)
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

  const fetchAvailableJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching jobs",
        description: error.message,
      });
    } else {
      setAvailableJobs(data || []);
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
              Welcome, {profile?.first_name || profile?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Candidate Dashboard</h2>
          <p className="text-muted-foreground">Track your applications and discover new opportunities</p>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Applications ({applications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applications yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Browse available jobs to start applying
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{application.jobs.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {application.jobs.location} • {application.jobs.job_type}
                            </p>
                          </div>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {application.jobs.description.substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                          {application.ai_score && (
                            <span>AI Score: {application.ai_score}/100</span>
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Available Jobs ({availableJobs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No jobs available at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableJobs.map((job) => (
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
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Apply
                          </Button>
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

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <p className="text-sm text-muted-foreground capitalize">{profile?.role}</p>
                </div>
                <Button variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateDashboard;