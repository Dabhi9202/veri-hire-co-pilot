import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Users, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ApplicationStatusCardProps {
  application: {
    id: string;
    jobTitle: string;
    companyName: string;
    appliedAt: string;
    status: string;
    hasInterviewPending?: boolean;
  };
  onStartInterview?: (applicationId: string) => void;
}

export const ApplicationStatusCard = ({ 
  application, 
  onStartInterview 
}: ApplicationStatusCardProps) => {
  const getStatusStep = (status: string) => {
    switch (status) {
      case 'submitted': return 1;
      case 'interview': return 2;
      case 'under_review': return 3;
      case 'final_stages': return 4;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(application.status);

  const steps = [
    { 
      id: 1, 
      title: "Application Submitted", 
      icon: CheckCircle,
      completed: currentStep >= 1 
    },
    { 
      id: 2, 
      title: "AI Interview", 
      icon: Users,
      completed: currentStep >= 2 
    },
    { 
      id: 3, 
      title: "Under Review", 
      icon: Clock,
      completed: currentStep >= 3 
    },
    { 
      id: 4, 
      title: "Final Stages", 
      icon: Award,
      completed: currentStep >= 4 
    }
  ];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {application.jobTitle}
            </h3>
            <p className="text-muted-foreground mb-2">{application.companyName}</p>
            <p className="text-sm text-muted-foreground">
              Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
            </p>
          </div>
          <Badge variant="secondary" className="ml-4">
            {application.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Status Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.completed;
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full mb-2
                    ${isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                    ${isActive && !isCompleted ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                  <p className={`
                    text-xs text-center leading-tight
                    ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}
                  `}>
                    {step.title}
                  </p>
                  
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className={`
                      absolute h-0.5 w-16 mt-4 ml-16
                      ${isCompleted ? 'bg-primary' : 'bg-muted'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        {application.hasInterviewPending && onStartInterview && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-foreground mb-3">
              Your AI interview is ready! Complete it to move to the next stage.
            </p>
            <Button 
              onClick={() => onStartInterview(application.id)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Start Your AI Interview Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};