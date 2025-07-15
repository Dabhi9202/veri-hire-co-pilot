-- First, let's create the missing profiles for existing users
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, company_name)
SELECT 
  id as user_id,
  email,
  raw_user_meta_data->>'first_name' as first_name,
  raw_user_meta_data->>'last_name' as last_name,
  (raw_user_meta_data->>'role')::user_role as role,
  CASE 
    WHEN raw_user_meta_data->>'role' = 'employer' THEN raw_user_meta_data->>'company_name'
    ELSE NULL
  END as company_name
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles);

-- Now let's make sure the trigger exists for future users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'candidate'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'employer' THEN NEW.raw_user_meta_data->>'company_name'
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();