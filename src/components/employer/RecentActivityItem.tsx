import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityItemProps {
  applicant: {
    id: string;
    candidateName: string;
    jobTitle: string;
    appliedAt: string;
  };
  onViewProfile: (applicantId: string) => void;
}

export const RecentActivityItem = ({ applicant, onViewProfile }: RecentActivityItemProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getInitials(applicant.candidateName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{applicant.candidateName}</p>
          <p className="text-sm text-muted-foreground">
            Applied for <span className="font-medium">{applicant.jobTitle}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(applicant.appliedAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onViewProfile(applicant.id)}
      >
        View Profile
      </Button>
    </div>
  );
};