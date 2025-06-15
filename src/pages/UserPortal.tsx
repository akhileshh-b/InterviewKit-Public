import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, Calendar, Clock, User, LogOut, Folder, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculateTotalReadingTime, calculateAverageReadTime } from "@/utils/readingTime";
import ProfileManagement from "@/components/ProfileManagement";
import { FolderSidebar } from "@/components/FolderSidebar";

interface Blog {
  id: string;
  title: string;
  summary: string;
  author_name: string;
  created_at: string;
  content: string;
  tags: string[];
  featured: boolean;
  folder_id: string | null;
  pages?: Array<{ title: string; content: string }>;
  blog_folders?: {
    name: string;
  } | null;
}

interface BlogFolder {
  id: string;
  name: string;
  description: string | null;
}

type SortOption = 
  | 'date-desc' 
  | 'date-asc' 
  | 'name-asc' 
  | 'name-desc' 
  | 'readtime-asc' 
  | 'readtime-desc'
  | 'featured-first'
  | 'tags-count';

const UserPortal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [folders, setFolders] = useState<BlogFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    uniqueTopics: 0,
    avgReadTime: 0,
    uncategorizedCount: 0
  });
  const { user, signOut } = useAuth();
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
          .select(`
            id, title, summary, author_name, created_at, content, tags, featured, folder_id, pages,
            blog_folders (
              name
            )
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('blog_folders')
          .select('*')
          .order('name', { ascending: true })
      ]);

      if (blogsResponse.error) throw blogsResponse.error;
      if (foldersResponse.error) throw foldersResponse.error;

      // Convert pages from Json to proper format and ensure proper type
      const blogsData = blogsResponse.data?.map(blog => ({
        ...blog,
        pages: Array.isArray(blog.pages) ? blog.pages as Array<{ title: string; content: string }> : 
               [{ title: "Page 1", content: blog.content || "" }]
      })) || [];
      
      const foldersData = foldersResponse.data || [];

      setBlogs(blogsData);
      setFolders(foldersData);

      // Calculate statistics
      const totalBlogs = blogsData.length;
      const uncategorizedCount = blogsData.filter(blog => !blog.folder_id).length;
      
      // Calculate unique topics from tags
      const allTags = blogsData.flatMap(blog => blog.tags || []);
      const uniqueTags = [...new Set(allTags)];
      const uniqueTopics = uniqueTags.length;

      // Calculate average read time using the new formula
      const avgReadTime = calculateAverageReadTime(blogsData);

      setStats({
        totalBlogs,
        uniqueTopics,
        avgReadTime,
        uncategorizedCount
      });

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

  const calculateReadTime = (blog: Blog) => {
    if (blog.pages && blog.pages.length > 0) {
      return calculateTotalReadingTime(blog.pages);
    }
    return calculateTotalReadingTime([{ content: blog.content || "" }]);
  };

  const sortBlogs = (blogs: Blog[], sortOption: SortOption): Blog[] => {
    const sorted = [...blogs];
    
    switch (sortOption) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'name-asc':
        return sorted.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
      case 'readtime-asc':
        return sorted.sort((a, b) => calculateReadTime(a) - calculateReadTime(b));
      case 'readtime-desc':
        return sorted.sort((a, b) => calculateReadTime(b) - calculateReadTime(a));
      case 'featured-first':
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      case 'tags-count':
        return sorted.sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
      default:
        return sorted;
    }
  };

  const filteredAndSortedBlogs = sortBlogs(
    blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (blog.summary && blog.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFolder = selectedFolder === "all" || 
      (selectedFolder === "uncategorized" && !blog.folder_id) ||
      blog.folder_id === selectedFolder;

    return matchesSearch && matchesFolder;
    }),
    sortBy
  );

  if (!user) return null;

  if (showProfile) {
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
                <span className="text-xl font-bold text-slate-900">InterviewKit</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setShowProfile(false)}>
                  Back to Blogs
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-lg text-slate-600">
              Manage your profile information and preferences.
            </p>
          </div>
          <ProfileManagement />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Folder Sidebar */}
      <FolderSidebar
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        totalBlogs={stats.totalBlogs}
        uncategorizedCount={stats.uncategorizedCount}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">InterviewKit</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 w-full">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back to your learning journey!
            </h1>
            <p className="text-lg text-slate-600">
              Explore our latest interview preparation content and boost your career.
            </p>
          </div>

          {/* Search and Sort Bar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
              <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
              </div>
              
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 min-w-[200px]">
                <ArrowUpDown className="h-4 w-4 text-slate-500" />
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">
                      <div className="flex items-center space-x-2">
                        <ArrowDown className="h-3 w-3" />
                        <span>Date Added (Newest)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="date-asc">
                      <div className="flex items-center space-x-2">
                        <ArrowUp className="h-3 w-3" />
                        <span>Date Added (Oldest)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="name-asc">
                      <div className="flex items-center space-x-2">
                        <ArrowUp className="h-3 w-3" />
                        <span>Name (A to Z)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="name-desc">
                      <div className="flex items-center space-x-2">
                        <ArrowDown className="h-3 w-3" />
                        <span>Name (Z to A)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="readtime-asc">
                      <div className="flex items-center space-x-2">
                        <ArrowUp className="h-3 w-3" />
                        <span>Read Time (Shortest)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="readtime-desc">
                      <div className="flex items-center space-x-2">
                        <ArrowDown className="h-3 w-3" />
                        <span>Read Time (Longest)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="featured-first">
                      <div className="flex items-center space-x-2">
                        <span>Featured First</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="tags-count">
                      <div className="flex items-center space-x-2">
                        <span>Most Tags</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results count */}
            <div className="text-sm text-slate-600">
              Showing {filteredAndSortedBlogs.length} of {stats.totalBlogs} blogs
              {searchTerm && ` for "${searchTerm}"`}
              {selectedFolder !== "all" && selectedFolder !== "uncategorized" && 
                folders.find(f => f.id === selectedFolder) && 
                ` in "${folders.find(f => f.id === selectedFolder)?.name}"`
              }
              {selectedFolder === "uncategorized" && " in Uncategorized"}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Available Blogs</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalBlogs}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Topics Covered</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.uniqueTopics}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Avg. Read Time</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.avgReadTime} min</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading blogs...</p>
            </div>
          ) : filteredAndSortedBlogs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No blogs found</h3>
              <p className="text-slate-600">Try adjusting your search terms, folder selection, or sorting options</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedBlogs.map((blog) => (
                <Card 
                  key={blog.id} 
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    blog.featured ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blog.featured && (
                        <Badge className="w-fit bg-blue-100 text-blue-700">Featured</Badge>
                      )}
                      {blog.blog_folders && (
                        <Badge variant="outline" className="w-fit">
                          <Folder className="h-3 w-3 mr-1" />
                          {blog.blog_folders.name}
                        </Badge>
                      )}
                      {!blog.folder_id && !blog.blog_folders && (
                        <Badge variant="outline" className="w-fit">
                          <Folder className="h-3 w-3 mr-1" />
                          Uncategorized
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2 text-slate-900">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-slate-600">
                      {blog.summary}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      <span>{calculateReadTime(blog)} min read</span>
                    </div>
                    
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link to={`/user/blog/${blog.id}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPortal;
