-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create admin_domains table to store allowed admin email domains
CREATE TABLE public.admin_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the allowed admin domain
INSERT INTO public.admin_domains (domain) VALUES ('humanitypathwaysglobal.com');

-- Enable RLS on admin_domains
ALTER TABLE public.admin_domains ENABLE ROW LEVEL SECURITY;

-- Create prompt_categories enum
CREATE TYPE public.prompt_category AS ENUM ('emotional_checkin', 'burnout_reset', 'grief_loss', 'gratitude_practice');

-- Create prompts table for admin-managed reflection prompts
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_es TEXT NOT NULL,
  category prompt_category NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on prompts
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Create resources table for admin-managed resources
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  url TEXT,
  resource_type TEXT NOT NULL DEFAULT 'article',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create privacy-conscious usage stats table (aggregated, no PII)
CREATE TABLE public.usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_reflections INTEGER NOT NULL DEFAULT 0,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  category_emotional_checkin INTEGER NOT NULL DEFAULT 0,
  category_burnout_reset INTEGER NOT NULL DEFAULT 0,
  category_grief_loss INTEGER NOT NULL DEFAULT 0,
  category_gratitude_practice INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(stat_date)
);

-- Enable RLS on usage_stats
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer function to check if user is admin by email domain
CREATE OR REPLACE FUNCTION public.is_admin_by_domain(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    JOIN public.admin_domains ad ON u.email LIKE '%@' || ad.domain
    WHERE u.id = _user_id
  )
$$;

-- Function to assign role on signup based on email domain
CREATE OR REPLACE FUNCTION public.handle_user_role_assignment()
RETURNS TRIGGER AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Check if user email matches admin domain
  IF EXISTS (
    SELECT 1 FROM public.admin_domains ad 
    WHERE NEW.email LIKE '%@' || ad.domain
  ) THEN
    user_role := 'admin';
  ELSE
    user_role := 'user';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-assign role on signup
CREATE TRIGGER on_auth_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_user_role_assignment();

-- RLS Policies

-- user_roles: users can view their own role, admins can view all
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- admin_domains: admins can manage
CREATE POLICY "Admins can view domains" ON public.admin_domains
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert domains" ON public.admin_domains
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete domains" ON public.admin_domains
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- prompts: everyone can read active, admins can CRUD all
CREATE POLICY "Anyone can view active prompts" ON public.prompts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all prompts" ON public.prompts
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert prompts" ON public.prompts
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update prompts" ON public.prompts
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete prompts" ON public.prompts
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- resources: everyone can read active, admins can CRUD all
CREATE POLICY "Anyone can view active resources" ON public.resources
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all resources" ON public.resources
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert resources" ON public.resources
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resources" ON public.resources
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resources" ON public.resources
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- usage_stats: admins only
CREATE POLICY "Admins can view usage stats" ON public.usage_stats
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert usage stats" ON public.usage_stats
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update usage stats" ON public.usage_stats
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp update triggers
CREATE TRIGGER update_prompts_updated_at
BEFORE UPDATE ON public.prompts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();