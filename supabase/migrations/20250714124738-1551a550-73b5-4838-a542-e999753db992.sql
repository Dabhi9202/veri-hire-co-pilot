-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('candidate', 'employer', 'admin');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'candidate',
  company_name TEXT, -- for employers
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  location TEXT,
  salary_range TEXT,
  job_type TEXT DEFAULT 'full-time',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'submitted',
  ai_analysis JSONB,
  ai_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(candidate_id, job_id)
);

-- Create interviews table
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  responses JSONB,
  video_url TEXT,
  ai_evaluation JSONB,
  status TEXT DEFAULT 'scheduled',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Everyone can view active jobs" 
ON public.jobs FOR SELECT 
USING (status = 'active');

CREATE POLICY "Employers can manage their jobs" 
ON public.jobs FOR ALL 
USING (employer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'employer'));

-- Applications policies
CREATE POLICY "Candidates can view their applications" 
ON public.applications FOR SELECT 
USING (candidate_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Employers can view applications for their jobs" 
ON public.applications FOR SELECT 
USING (job_id IN (SELECT id FROM public.jobs WHERE employer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())));

CREATE POLICY "Candidates can create applications" 
ON public.applications FOR INSERT 
WITH CHECK (candidate_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'candidate'));

CREATE POLICY "Candidates can update their applications" 
ON public.applications FOR UPDATE 
USING (candidate_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Interviews policies
CREATE POLICY "Users can view interviews for their applications" 
ON public.interviews FOR SELECT 
USING (
  application_id IN (
    SELECT id FROM public.applications 
    WHERE candidate_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR job_id IN (SELECT id FROM public.jobs WHERE employer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  )
);

CREATE POLICY "System can manage interviews" 
ON public.interviews FOR ALL 
USING (true);

-- Create storage bucket for resumes and videos
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('interviews', 'interviews', false);

-- Storage policies for resumes
CREATE POLICY "Users can upload their own resumes" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resumes" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Employers can view resumes for their job applications" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'resumes' AND 
  (storage.foldername(name))[1] IN (
    SELECT profiles.user_id::text FROM public.profiles
    JOIN public.applications ON applications.candidate_id = profiles.id
    JOIN public.jobs ON jobs.id = applications.job_id
    WHERE jobs.employer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Storage policies for interviews
CREATE POLICY "Users can upload interview videos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'interviews' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view interview content" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'interviews' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR
   (storage.foldername(name))[1] IN (
     SELECT profiles.user_id::text FROM public.profiles
     JOIN public.applications ON applications.candidate_id = profiles.id
     JOIN public.jobs ON jobs.id = applications.job_id
     WHERE jobs.employer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
   ))
);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON public.interviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();