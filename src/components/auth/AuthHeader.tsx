import veriHireLogo from "@/assets/verihire-logo.png";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <img 
          src={veriHireLogo} 
          alt="VeriHire" 
          className="h-12 w-auto"
        />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
};