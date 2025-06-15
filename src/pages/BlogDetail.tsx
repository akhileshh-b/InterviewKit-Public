
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AIChatDialog } from "@/components/AIChatDialog";
import BlogPageViewer from "@/components/BlogPageViewer";
import { calculateTotalReadingTime } from "@/utils/readingTime";

interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  author_name: string;
  created_at: string;
  tags: string[];
  ai_insights_enabled: boolean;
  pages?: Array<{ title: string; content: string }>;
  blog_folders?: {
    name: string;
  } | null;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useAuth();
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
        .select(`
          *,
          blog_folders (
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Ensure pages is properly formatted - backward compatibility
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
      navigate("/user");
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-slate-600">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Blog not found</h2>
          <p className="text-slate-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/user")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  const readTime = calculateTotalReadingTime(blog.pages || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => navigate("/user")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
            
            {blog.ai_insights_enabled && (
              <Button 
                onClick={() => setChatOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
            )}
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
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>By {blog.author_name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
          {blog.summary && (
            <p className="text-lg text-slate-600 mb-6">
              {blog.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.blog_folders && (
              <Badge variant="outline" className="mb-2">
                📁 {blog.blog_folders.name}
              </Badge>
            )}
            {blog.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Content */}
        <BlogPageViewer pages={blog.pages || []} />

        {/* AI Chat Dialog */}
        {blog.ai_insights_enabled && (
          <AIChatDialog
            open={chatOpen}
            onOpenChange={setChatOpen}
            blogId={blog.id}
            blogTitle={blog.title}
            blogContent={blog.pages?.map(p => p.content).join('\n\n') || blog.content}
          />
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
