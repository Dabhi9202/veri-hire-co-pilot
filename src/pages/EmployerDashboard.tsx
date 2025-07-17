import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Clock, Eye, Plus } from "lucide-react";
import { EmployerSidebar } from "@/components/employer/EmployerSidebar";
import { StatCard } from "@/components/employer/StatCard";
import { JobCard } from "@/components/employer/JobCard";
import { RecentActivityItem } from "@/components/employer/RecentActivityItem";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  company_name?: string;
}

interface Job {
  id: string;
  title: string;
  location?: string;
  created_at: string;
}

interface Application {
  id: string;
  created_at: string;
  candidate_id: string;
  job_id: string;
  jobs: {
    title: string;
  };
  profiles: {
    first_name?: string;
    last_name?: string;
  };
}

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    newApplicants: 0,
    pendingReview: 0
  });
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, company_name")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      // Fetch employer profile ID for queries
      const { data: employerProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!employerProfile) return;

      // Fetch active jobs
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title, location, created_at")
        .eq("employer_id", employerProfile.id)
        .eq("status", "active");

      if (jobs) {
        setActiveJobs(jobs);
      }

      // Fetch applications for stats and recent activity
      const { data: applications } = await supabase
        .from("applications")
        .select(`
          id,
          created_at,
          candidate_id,
          job_id,
          jobs!inner(title),
          profiles!inner(first_name, last_name)
        `)
        .eq("jobs.employer_id", employerProfile.id)
        .order("created_at", { ascending: false });

      if (applications) {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const newApplicants = applications.filter(
          app => new Date(app.created_at) >= sevenDaysAgo
        ).length;

        setStats({
          activeJobs: jobs?.length || 0,
          totalCandidates: applications.length,
          newApplicants,
          pendingReview: 0 // This would need interview status
        });

        setRecentApplications(applications.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handlePostNewJob = () => {
    // Navigate to job creation page
    navigate("/employer/jobs/new");
  };

  const handleViewCandidates = (jobId: string) => {
    navigate(`/employer/candidates?job=${jobId}`);
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/employer/jobs/${jobId}/edit`);
  };

  const handleArchiveJob = async (jobId: string) => {
    try {
      await supabase
        .from("jobs")
        .update({ status: "archived" })
        .eq("id", jobId);
      
      toast.success("Job archived successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to archive job");
    }
  };

  const handleShareJob = (jobId: string) => {
    // Copy job URL to clipboard
    const jobUrl = `${window.location.origin}/jobs/${jobId}`;
    navigator.clipboard.writeText(jobUrl);
    toast.success("Job URL copied to clipboard");
  };

  const handleViewProfile = (applicantId: string) => {
    navigate(`/employer/candidates/${applicantId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <EmployerSidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar userProfile={userProfile} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {userProfile?.company_name || "Company"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your recruitment
            </p>
          </div>
          <Button onClick={handlePostNewJob} size="lg" className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-5 w-5" />
            Post a New Job
          </Button>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={Briefcase}
          />
          <StatCard
            title="Total Candidates"
            value={stats.totalCandidates}
            icon={Users}
          />
          <StatCard
            title="New Applicants (Last 7 Days)"
            value={stats.newApplicants}
            icon={Clock}
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingReview}
            icon={Eye}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Job Postings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Active Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                {activeJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No active job postings yet</p>
                    <Button onClick={handlePostNewJob}>
                      <Plus className="mr-2 h-4 w-4" />
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {activeJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={{
                          ...job,
                          totalApplicants: recentApplications.filter(app => app.job_id === job.id).length,
                          newApplicants: recentApplications.filter(app => 
                            app.job_id === job.id && 
                            new Date(app.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                          ).length
                        }}
                        onViewCandidates={handleViewCandidates}
                        onEditJob={handleEditJob}
                        onArchiveJob={handleArchiveJob}
                        onShareJob={handleShareJob}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                {recentApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <RecentActivityItem
                        key={application.id}
                        applicant={{
                          id: application.candidate_id,
                          candidateName: `${application.profiles.first_name || ""} ${application.profiles.last_name || ""}`.trim() || "Anonymous",
                          jobTitle: application.jobs.title,
                          appliedAt: application.created_at
                        }}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}