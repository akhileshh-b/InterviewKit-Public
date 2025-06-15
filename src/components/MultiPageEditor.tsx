
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Page {
  title: string;
  content: string;
}

interface MultiPageEditorProps {
  pages: Page[];
  onPagesChange: (pages: Page[]) => void;
}

const MultiPageEditor = ({ pages, onPagesChange }: MultiPageEditorProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const addPage = () => {
    const newPages = [...pages, { title: `Page ${pages.length + 1}`, content: "" }];
    onPagesChange(newPages);
    setCurrentPageIndex(newPages.length - 1);
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, i) => i !== index);
    onPagesChange(newPages);
    setCurrentPageIndex(Math.min(currentPageIndex, newPages.length - 1));
  };

  const updatePage = (index: number, field: keyof Page, value: string) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], [field]: value };
    onPagesChange(newPages);
  };

  const currentPage = pages[currentPageIndex] || { title: "", content: "" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPageIndex + 1} of {pages.length}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPageIndex(Math.min(pages.length - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === pages.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={addPage}>
            <Plus className="h-4 w-4 mr-1" />
            Add Page
          </Button>
          {pages.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => deletePage(currentPageIndex)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Page {currentPageIndex + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`page-title-${currentPageIndex}`}>Page Title</Label>
            <Input
              id={`page-title-${currentPageIndex}`}
              value={currentPage.title}
              onChange={(e) => updatePage(currentPageIndex, "title", e.target.value)}
              placeholder="Enter page title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`page-content-${currentPageIndex}`}>Page Content (Markdown)</Label>
            <Textarea
              id={`page-content-${currentPageIndex}`}
              value={currentPage.content}
              onChange={(e) => updatePage(currentPageIndex, "content", e.target.value)}
              placeholder="Write your page content in Markdown format"
              rows={15}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiPageEditor;
