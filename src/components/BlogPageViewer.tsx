
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

interface Page {
  title: string;
  content: string;
}

interface BlogPageViewerProps {
  pages: Page[];
  className?: string;
}

const BlogPageViewer = ({ pages, className = "" }: BlogPageViewerProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (!pages || pages.length === 0) {
    return <div className="text-center text-gray-500">No content available</div>;
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className={`space-y-4 ${className}`}>
      {pages.length > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPageIndex + 1} of {pages.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPageIndex(Math.min(pages.length - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === pages.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{currentPage.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h3:text-xl prose-h3:font-medium prose-h3:mb-2 prose-p:text-slate-700 prose-p:leading-relaxed prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:italic prose-hr:border-slate-300 prose-hr:my-8 prose-strong:text-slate-900 prose-strong:font-semibold prose-em:italic prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-table:border-collapse prose-th:border prose-th:border-slate-300 prose-th:bg-slate-50 prose-th:p-2 prose-th:font-medium prose-td:border prose-td:border-slate-300 prose-td:p-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                // Custom rendering for code blocks
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  
                  return isInline ? (
                    <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                // Custom rendering for headings
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-slate-900 mb-4 mt-8 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-slate-900 mb-3 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium text-slate-900 mb-2 mt-4">
                    {children}
                  </h3>
                ),
                // Custom rendering for horizontal rules
                hr: () => (
                  <hr className="border-0 border-t border-slate-300 my-8" />
                ),
                // Custom rendering for paragraphs
                p: ({ children }) => (
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                // Custom rendering for blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {currentPage.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {pages.length > 1 && (
        <div className="flex justify-center space-x-2">
          {pages.map((_, index) => (
            <Button
              key={index}
              variant={index === currentPageIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPageIndex(index)}
              className="w-10 h-10 p-0"
            >
              {index + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPageViewer;
