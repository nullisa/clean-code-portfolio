
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS cv_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "CVs are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs');

CREATE POLICY "Admins can upload CVs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cvs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update CVs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cvs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cvs' AND public.has_role(auth.uid(), 'admin'));
