
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">InterviewKit</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {isAdmin ? (
                    <Button asChild variant="ghost">
                      <Link to="/admin">Admin Portal</Link>
                    </Button>
                  ) : (
                    <Button asChild variant="ghost">
                      <Link to="/user">My Portal</Link>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-slate-600 hover:text-slate-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                {user ? (
                  <>
                    {isAdmin ? (
                      <Button asChild variant="ghost" className="justify-start">
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Portal</Link>
                      </Button>
                    ) : (
                      <Button asChild variant="ghost" className="justify-start">
                        <Link to="/user" onClick={() => setIsMenuOpen(false)}>My Portal</Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="justify-start">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 justify-start">
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
