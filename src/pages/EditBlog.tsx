
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ArrowLeft, Save, Eye } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import MultiPageEditor from "@/components/MultiPageEditor";

interface BlogFolder {
  id: string;
  name: string;
  description: string | null;
}

interface Page {
  title: string;
  content: string;
}

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    tags: "",
    featured: false,
    folderId: "",
    aiInsightsEnabled: false
  });
  const [pages, setPages] = useState<Page[]>([{ title: "Page 1", content: "" }]);
  const [folders, setFolders] = useState<BlogFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
    fetchFolders();
    fetchBlog();
    }
  }, [user, id]);

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_folders')
        .select('id, name, description')
        .order('name', { ascending: true });

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        summary: data.summary || "",
        tags: data.tags.join(', '),
        featured: data.featured,
        folderId: data.folder_id || "",
        aiInsightsEnabled: data.ai_insights_enabled || false
      });

      // Handle pages - ensure backward compatibility
      let blogPages = data.pages as Array<{ title: string; content: string }>;
      if (!blogPages || !Array.isArray(blogPages) || blogPages.length === 0) {
        blogPages = [{ title: "Page 1", content: data.content || "" }];
      }
      setPages(blogPages);
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post. Please try again.",
        variant: "destructive",
      });
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin || !id) return;

    setIsLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { error } = await supabase
        .from('blogs')
        .update({
          title: formData.title,
          summary: formData.summary,
          content: pages[0]?.content || "", // Keep backward compatibility
          pages: pages as any, // Type assertion to handle Json type
          tags: tagsArray,
          featured: formData.featured,
          folder_id: formData.folderId || null,
          ai_insights_enabled: formData.aiInsightsEnabled
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Blog post updated successfully.",
      });

      navigate("/admin");
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-slate-600">Loading blog post...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">InterviewKit Admin</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link to={`/admin/preview/${id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Edit Blog Post
          </h1>
          <p className="text-lg text-slate-600">
            Update your blog post content and settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Blog Post Details</CardTitle>
              <CardDescription>
                Edit the basic information for your blog post.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter blog title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="Enter a brief summary of the blog post"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="folderId">Folder</Label>
                <Select value={formData.folderId} onValueChange={(value) => setFormData({...formData, folderId: value === "none" ? "" : value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a folder (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No folder</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="e.g., Data Structures, Algorithms, System Design"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                />
                <Label htmlFor="featured">Featured post</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="aiInsightsEnabled"
                  checked={formData.aiInsightsEnabled}
                  onCheckedChange={(checked) => setFormData({...formData, aiInsightsEnabled: checked})}
                />
                <Label htmlFor="aiInsightsEnabled">Enable AI Insights</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
              <CardDescription>
                Edit the pages of your blog post. Use the page navigation to manage content across multiple pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultiPageEditor pages={pages} onPagesChange={setPages} />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link to="/admin">Cancel</Link>
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Updating..." : "Update Blog Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
