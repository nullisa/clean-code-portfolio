
-- =========================================
-- ROLES SYSTEM (secure pattern)
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- TIMESTAMP TRIGGER FUNCTION
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- PROFILE (single row)
-- =========================================
CREATE TABLE public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profile is viewable by everyone"
  ON public.profile FOR SELECT USING (true);

CREATE POLICY "Admins can manage profile"
  ON public.profile FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- TECH STACK
-- =========================================
CREATE TABLE public.tech_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tech stack is viewable by everyone"
  ON public.tech_stack FOR SELECT USING (true);

CREATE POLICY "Admins can manage tech stack"
  ON public.tech_stack FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_tech_stack_updated_at
  BEFORE UPDATE ON public.tech_stack
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- CAREER TIMELINE
-- =========================================
CREATE TABLE public.career_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  is_highlight BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.career_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Career timeline is viewable by everyone"
  ON public.career_timeline FOR SELECT USING (true);

CREATE POLICY "Admins can manage career timeline"
  ON public.career_timeline FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_career_timeline_updated_at
  BEFORE UPDATE ON public.career_timeline
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- PROJECTS
-- =========================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tech TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  link2 TEXT,
  demo TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- CONTACT INFO (single row)
-- =========================================
CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact info is viewable by everyone"
  ON public.contact_info FOR SELECT USING (true);

CREATE POLICY "Admins can manage contact info"
  ON public.contact_info FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- STORAGE BUCKET FOR IMAGES
-- =========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true);

CREATE POLICY "Portfolio images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "Admins can upload portfolio images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));

-- =========================================
-- SEED DATA
-- =========================================
INSERT INTO public.profile (name, role, tagline, bio) VALUES
  ('Farid Lan', 'Backend Developer', 'Building robust systems with Clean Architecture and DRY principles.', 'Backend developer passionate about scalable systems, clean code, and developer experience.');

INSERT INTO public.contact_info (email, location, github_url, linkedin_url) VALUES
  ('hello@faridlan.com', 'Indonesia', 'https://github.com/faridlan', 'https://linkedin.com/in/faridlan');

INSERT INTO public.tech_stack (name, category, sort_order) VALUES
  ('NestJS', 'backend', 1),
  ('Go', 'backend', 2),
  ('Node.js', 'backend', 3),
  ('PostgreSQL', 'database', 4),
  ('Redis', 'database', 5),
  ('MongoDB', 'database', 6),
  ('Prisma', 'orm', 7),
  ('Supabase', 'platform', 8),
  ('React', 'frontend', 9),
  ('TypeScript', 'language', 10),
  ('Docker', 'devops', 11),
  ('RabbitMQ', 'messaging', 12);

INSERT INTO public.career_timeline (year, role, company, description, is_highlight, sort_order) VALUES
  ('2026', 'Backend Developer', 'Independent / Open to opportunities', 'Transitioned fully into backend engineering, focusing on Clean Architecture, scalable APIs, and event-driven systems.', true, 1),
  ('2024 - 2025', 'Full-Stack Developer', 'Bank Galuh Ciamis', 'Built internal tools including Employee Tracker and Meeting Minutes systems with NestJS and React.', false, 2),
  ('2023', 'Web Developer', 'Freelance', 'Delivered landing pages and small business systems for local clients.', false, 3);

INSERT INTO public.projects (title, description, tech, link, link2, demo, sort_order) VALUES
  ('Contact Management API', 'A system for write a contact management.', 'NestJS · PostgreSQL · Prisma', 'https://github.com/faridlan/contact-management-api/tree/dev', NULL, NULL, 1),
  ('Employee Tracker — Bank Galuh Ciamis', 'A system for tracking employee targets and achievements for Bank Galuh Ciamis.', 'NestJS · React (TS) · SQLite', 'https://github.com/faridlan/employee-tracker-backend', 'https://github.com/faridlan/employee-tracker-frontend', NULL, 2),
  ('Meeting Minutes — Bank Galuh Ciamis', 'A system for write a meeting minute and result meeting of Bank Galuh Ciamis.', 'NestJS · React (TS) · SQLite', 'https://github.com/faridlan/notulen-backend', 'https://github.com/faridlan/notulen-frontend', NULL, 3),
  ('WIFT Indonesia — ERP & Business Intelligence Dashboard', 'Designed a relational database schema in Supabase that handles identity management and real-time data synchronization.', 'Supabase · React (TS) · Lovable UI', 'https://wift.faridlan.com', NULL, 'https://wift.faridlan.com', 4),
  ('Wijaya Family — Conversion-Optimized Landing Page', 'Integrated Meta Pixel events to monitor Leads and Page Views, allowing the marketing team to optimize ad spend based on real-time data captured in Supabase.', 'Supabase · React (TS) · Lovable UI', 'https://wijaya.faridlan.com', NULL, 'https://wijaya.faridlan.com', 5),
  ('Inventory Management Service', 'A microservice handling product stock, warehouse transfers, and low-stock alerts with event-driven architecture.', 'Go · gRPC · PostgreSQL · RabbitMQ', 'https://github.com/faridlan/inventory-service', NULL, NULL, 6),
  ('Auth & Identity Provider', 'OAuth2 + JWT authentication service with role-based access control, refresh tokens, and email verification flow.', 'NestJS · Redis · PostgreSQL', 'https://github.com/faridlan/auth-provider', NULL, NULL, 7),
  ('Realtime Chat Backend', 'WebSocket-based chat backend supporting rooms, presence, and message persistence with horizontal scaling.', 'Node.js · Socket.IO · MongoDB', 'https://github.com/faridlan/realtime-chat', NULL, 'https://chat-demo.faridlan.com', 8),
  ('Payment Gateway Integration', 'Unified payment abstraction layer integrating Midtrans, Stripe, and Xendit with idempotent webhook handling.', 'NestJS · PostgreSQL · Prisma', 'https://github.com/faridlan/payment-gateway', NULL, NULL, 9),
  ('URL Shortener Service', 'High-throughput URL shortener with click analytics, custom aliases, and rate limiting per API key.', 'Go · Redis · PostgreSQL', 'https://github.com/faridlan/url-shortener', NULL, 'https://s.faridlan.com', 10);
