
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, Edit, Trash2, User, LogOut, Folder, MessageSquare, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FolderManagement } from "@/components/FolderManagement";
import { calculateAverageReadTime, calculateTotalReadingTime } from "@/utils/readingTime";
import ProfileManagement from "@/components/ProfileManagement";

interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  featured: boolean;
  ai_insights_enabled: boolean;
  folder_id: string | null;
  pages?: Array<{ title: string; content: string }>;
}

interface BlogFolder {
  id: string;
  name: string;
  description: string | null;
}

const AdminPortal = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [folders, setFolders] = useState<BlogFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [blogsResponse, foldersResponse] = await Promise.all([
        supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('blog_folders')
          .select('*')
          .order('name', { ascending: true })
      ]);

      if (blogsResponse.error) throw blogsResponse.error;
      if (foldersResponse.error) throw foldersResponse.error;

      // Convert pages from Json to proper format
      const blogsData = blogsResponse.data?.map(blog => ({
        ...blog,
        pages: Array.isArray(blog.pages) ? blog.pages as Array<{ title: string; content: string }> : 
               [{ title: "Page 1", content: blog.content || "" }]
      })) || [];

      setBlogs(blogsData);
      setFolders(foldersResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) throw error;

      setBlogs(blogs.filter(blog => blog.id !== blogId));
      toast({
        title: "Success",
        description: "Blog deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "Thanks for using InterviewKit!",
      });
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getFolderName = (folderId: string | null) => {
    if (!folderId) return "Uncategorized";
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : "Unknown Folder";
  };

  const getReadTime = (blog: Blog) => {
    if (blog.pages && blog.pages.length > 0) {
      return calculateTotalReadingTime(blog.pages);
    }
    return calculateTotalReadingTime([{ content: blog.content || "" }]);
  };

  // Calculate average read time
  const averageReadTime = calculateAverageReadTime(blogs);

  // Calculate unique topics from tags
  const getAllTags = () => {
    const allTags = blogs.flatMap(blog => blog.tags || []);
    return [...new Set(allTags)];
  };

  const uniqueTopics = getAllTags().length;



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
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-600">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
                <Badge variant="secondary">Admin</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Manage blog posts, folders, and content for InterviewKit users.
          </p>
        </div>

        <Tabs defaultValue="blogs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="blogs">Blog Management</TabsTrigger>
            <TabsTrigger value="folders">Folder Management</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs" className="space-y-6">
            {/* Stats and Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Total Blogs</p>
                      <p className="text-2xl font-bold text-slate-900">{blogs.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Unique Topics</p>
                      <p className="text-2xl font-bold text-slate-900">{uniqueTopics}</p>
                    </div>
                    <Folder className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Avg. Read Time</p>
                      <p className="text-2xl font-bold text-slate-900">{averageReadTime} min</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/admin/blog/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Blog
                  </Link>
                </Button>
              </div>
            </div>

            {/* Blogs List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Loading blogs...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No blogs yet</h3>
                <p className="text-slate-600 mb-4">Start by creating your first blog post</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/admin/blog/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Blog
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {blog.featured && (
                              <Badge className="bg-blue-100 text-blue-700">Featured</Badge>
                            )}
                            {blog.ai_insights_enabled && (
                              <Badge className="bg-purple-100 text-purple-700">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                AI Insights
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              <Folder className="h-3 w-3 mr-1" />
                              {getFolderName(blog.folder_id)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getReadTime(blog)} min read
                            </Badge>
                          </div>
                          <CardTitle className="text-xl text-slate-900 mb-2">
                            {blog.title}
                          </CardTitle>
                          <CardDescription className="text-slate-600">
                            {blog.summary}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/preview/${blog.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/blog/edit/${blog.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(blog.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Created: {new Date(blog.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(blog.updated_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="folders">
            <FolderManagement />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
