import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, Users, Clock, MoreHorizontal, Edit, Archive, Share } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    location?: string;
    totalApplicants: number;
    newApplicants: number;
    created_at: string;
  };
  onViewCandidates: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
  onArchiveJob: (jobId: string) => void;
  onShareJob: (jobId: string) => void;
}

export const JobCard = ({ 
  job, 
  onViewCandidates, 
  onEditJob, 
  onArchiveJob, 
  onShareJob 
}: JobCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">{job.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.location || "Remote"}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditJob(job.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchiveJob(job.id)}>
                <Archive className="mr-2 h-4 w-4" />
                Archive Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShareJob(job.id)}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="font-medium">{job.totalApplicants}</span>
            <span className="text-muted-foreground ml-1">total applicants</span>
          </div>
          {job.newApplicants > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Clock className="h-3 w-3 mr-1" />
              {job.newApplicants} new
            </Badge>
          )}
        </div>

        <Button 
          onClick={() => onViewCandidates(job.id)}
          className="w-full"
        >
          View Candidates
        </Button>
      </CardContent>
    </Card>
  );
};