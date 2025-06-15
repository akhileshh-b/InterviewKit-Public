
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BlogPageViewer from "@/components/BlogPageViewer";
import { calculateTotalReadingTime } from "@/utils/readingTime";

interface Blog {
  id: string;
  title: string;
  summary: string;
  author_name: string;
  created_at: string;
  tags: string[];
  pages: Array<{ title: string; content: string }>;
}

const AdminPreview = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [user, id]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Ensure pages is properly formatted
      let pages = data.pages as Array<{ title: string; content: string }>;
      if (!pages || !Array.isArray(pages) || pages.length === 0) {
        pages = [{ title: "Page 1", content: data.content || "" }];
      }

      setBlog({
        ...data,
        pages
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-slate-600">Loading preview...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-slate-600">Blog not found</p>
      </div>
    );
  }

  const readTime = calculateTotalReadingTime(blog.pages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <div className="flex items-center space-x-2 text-blue-600">
                <Eye className="h-5 w-5" />
                <span className="font-medium">Preview Mode</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-slate-600">
              <span>By {blog.author_name}</span>
              <span>•</span>
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>
          </div>
          {blog.summary && (
            <p className="text-lg text-slate-600 mb-6">
              {blog.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Blog Content */}
        <BlogPageViewer pages={blog.pages} />
      </div>
    </div>
  );
};

export default AdminPreview;
