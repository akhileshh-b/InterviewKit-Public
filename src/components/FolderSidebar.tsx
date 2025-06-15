
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Folder, FolderOpen, Grid3X3, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface BlogFolder {
  id: string;
  name: string;
  description: string | null;
  blog_count?: number;
}

interface FolderSidebarProps {
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  totalBlogs: number;
  uncategorizedCount: number;
}

export const FolderSidebar = ({
  selectedFolder,
  onFolderSelect,
  isCollapsed,
  onToggleCollapse,
  totalBlogs,
  uncategorizedCount
}: FolderSidebarProps) => {
  const [folders, setFolders] = useState<BlogFolder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoldersWithCounts();
  }, []);

  const fetchFoldersWithCounts = async () => {
    try {
      // Get folders
      const { data: foldersData, error: foldersError } = await supabase
        .from('blog_folders')
        .select('*')
        .order('name', { ascending: true });

      if (foldersError) throw foldersError;

      // Get blog counts for each folder
      const foldersWithCounts = await Promise.all(
        (foldersData || []).map(async (folder) => {
          const { count } = await supabase
            .from('blogs')
            .select('*', { count: 'exact', head: true })
            .eq('folder_id', folder.id);
          
          return {
            ...folder,
            blog_count: count || 0
          };
        })
      );

      setFolders(foldersWithCounts);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFolderIcon = (folderId: string) => {
    return selectedFolder === folderId ? FolderOpen : Folder;
  };

  return (
    <div className={cn(
      "border-r border-slate-200 bg-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {!isCollapsed && (
          <h3 className="font-semibold text-slate-900">Folders</h3>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-2">
          {/* All Blogs */}
          <Button
            variant={selectedFolder === "all" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isCollapsed ? "px-2" : "px-3"
            )}
            onClick={() => onFolderSelect("all")}
          >
            <Grid3X3 className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">All Blogs</span>
                <Badge variant="outline" className="ml-2">
                  {totalBlogs}
                </Badge>
              </>
            )}
          </Button>

          {/* Uncategorized */}
          <Button
            variant={selectedFolder === "uncategorized" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isCollapsed ? "px-2" : "px-3"
            )}
            onClick={() => onFolderSelect("uncategorized")}
          >
            <Folder className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">Uncategorized</span>
                <Badge variant="outline" className="ml-2">
                  {uncategorizedCount}
                </Badge>
              </>
            )}
          </Button>

          {!isCollapsed && <Separator className="my-2" />}

          {/* Folder List */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 bg-slate-100 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            folders.map((folder) => {
              const IconComponent = getFolderIcon(folder.id);
              return (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed ? "px-2" : "px-3"
                  )}
                  onClick={() => onFolderSelect(folder.id)}
                  title={isCollapsed ? folder.name : undefined}
                >
                  <IconComponent className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">
                        {folder.name}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {folder.blog_count}
                      </Badge>
                    </>
                  )}
                </Button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
