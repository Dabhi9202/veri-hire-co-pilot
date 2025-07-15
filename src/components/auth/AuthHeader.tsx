interface AuthHeaderProps {
  title: string;
  description: string;
}

export const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-2xl">V</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
};