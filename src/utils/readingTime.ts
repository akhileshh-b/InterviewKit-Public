export const calculateReadingTime = (content: string): number => {
  if (!content) return 0;
  
  const lines = content.split('\n').length;
  const estimatedWords = lines * 12;
  const readingTime = Math.ceil(estimatedWords / 500);
  
  return readingTime;
};

export const calculateTotalReadingTime = (pages: Array<{ content: string }>): number => {
  if (!pages || pages.length === 0) return 0;
  
  const totalContent = pages.map(page => page.content).join('\n');
  return calculateReadingTime(totalContent);
};

export const calculateAverageReadTime = (blogs: Array<{ pages?: Array<{ content: string }>, content?: string }>): number => {
  if (!blogs || blogs.length === 0) return 0;
  
  const totalReadTime = blogs.reduce((acc, blog) => {
    if (blog.pages && blog.pages.length > 0) {
      return acc + calculateTotalReadingTime(blog.pages);
    } else if (blog.content) {
      return acc + calculateReadingTime(blog.content);
    }
    return acc;
  }, 0);
  
  return Math.round(totalReadTime / blogs.length);
};
