
-- Add folders table for organizing blogs
CREATE TABLE public.blog_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add folder_id to blogs table and ai_insights_enabled flag
ALTER TABLE public.blogs 
ADD COLUMN folder_id UUID REFERENCES public.blog_folders(id),
ADD COLUMN ai_insights_enabled BOOLEAN DEFAULT false;

-- Enable RLS on blog_folders
ALTER TABLE public.blog_folders ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_folders (anyone can view, only authenticated can manage)
CREATE POLICY "Anyone can view blog folders" 
  ON public.blog_folders 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create blog folders" 
  ON public.blog_folders 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update blog folders" 
  ON public.blog_folders 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blog folders" 
  ON public.blog_folders 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create trigger for blog_folders updated_at
CREATE TRIGGER on_blog_folders_updated
  BEFORE UPDATE ON public.blog_folders
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Insert some default folders
INSERT INTO public.blog_folders (name, description) VALUES 
('Data Structures', 'Fundamental data structures and their implementations'),
('Algorithms', 'Sorting, searching, and optimization algorithms'),
('System Design', 'Scalable system architecture and design patterns'),
('Programming Languages', 'Language-specific concepts and best practices'),
('Interview Tips', 'General interview preparation and strategies');
