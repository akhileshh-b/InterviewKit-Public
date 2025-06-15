
-- Create a table for blog posts
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[] DEFAULT '{}'::TEXT[],
  featured BOOLEAN DEFAULT false
);

-- Add Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blog access
-- Anyone can read blogs (for public access)
CREATE POLICY "Anyone can view blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (true);

-- Only authenticated users can insert blogs
CREATE POLICY "Authenticated users can create blogs" 
  ON public.blogs 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only blog authors can update their blogs
CREATE POLICY "Authors can update their own blogs" 
  ON public.blogs 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = author_id);

-- Only blog authors can delete their blogs
CREATE POLICY "Authors can delete their own blogs" 
  ON public.blogs 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = author_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER on_blogs_updated
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
