import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Zap, CheckCircle, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManualControl, setIsManualControl] = useState(false);
  const navigate = useNavigate();

  // Check for OAuth hash parameters on page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('error'))) {
      // Redirect to AuthCallback to handle OAuth response
      navigate('/auth/callback');
    }
  }, [navigate]);

  // Auto-reset manual control after 5 seconds
  useEffect(() => {
    if (isManualControl) {
      const timer = setTimeout(() => {
        setIsManualControl(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isManualControl, currentIndex]);

  const handlePrevious = () => {
    setIsManualControl(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsManualControl(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const testimonials = [
    {
      name: "Harsh Tiwari",
      role: "SDE Intern at Porter & Final Year Student at RCOEM",
      content: "As an SDE intern, InterviewKit's curated content is exactly what I need for full-time prep. No fluff, just high-quality material covering all essential topics.",
      rating: 5
    },
    {
      name: "Prathamesh Jangle",
      role: "Final Year Student at RCOEM",
      content: "Perfect for placement preparation! Well-structured content and easy navigation. Much better than jumping between random blogs and resources.",
      rating: 5
    },
    {
      name: "Khush Mahajan",
      role: "Founder of Kwiktwik (8-Fig USD Startup) & Final Year Student at RCOEM",
      content: "As someone running an 8-figure startup, I appreciate well-organized resources. InterviewKit delivers exactly that for technical interview prep.",
      rating: 5
    },
    {
      name: "Sarah Kulsum",
      role: "Final Year Student at RCOEM",
      content: "The organized approach to interview prep is amazing. I can focus on specific topics without getting overwhelmed. Really helpful for campus placements!",
      rating: 5
    },
    {
      name: "Harshita Agrawal",
      role: "Final Year Student at RCOEM",
      content: "Clean interface and quality content make studying so much more efficient. The reading time estimates help me plan my study sessions perfectly.",
      rating: 5
    },
    {
      name: "Suryansh Kashyap",
      role: "Works at Clapsore Toys & Final Year Student at RCOEM",
      content: "Working in the industry while studying, I can confirm this covers all the essential topics companies actually ask about. Highly recommended!",
      rating: 5
    },
    {
      name: "Harsh Verma",
      role: "Final Year Student at RCOEM",
      content: "InterviewKit saves me hours of searching for good resources. Everything is well-curated and covers all the important interview topics.",
      rating: 5
    },
    {
      name: "Kamalesh Viyanwar",
      role: "Intern at Growbean & Final Year Student at RCOEM",
      content: "Being an intern at Growbean, I understand the importance of quality preparation. InterviewKit's structured approach makes interview prep so much more effective.",
      rating: 5
    },
    {
      name: "Atharva Bhakane",
      role: "Final Year Student at RCOEM",
      content: "The content quality is top-notch and everything loads fast. Perfect for quick reviews before interviews and comprehensive preparation.",
      rating: 5
    },
    {
      name: "Jagriti Sharma",
      role: "Project Contributor & Final Year Student at RCOEM",
      content: "Having contributed to this project, I can say the attention to quality and user experience is exceptional. Great platform for interview preparation!",
      rating: 5
    },
    {
      name: "Soumitra Aghor",
      role: "Final Year Student at RCOEM",
      content: "Finally, a platform that understands what students actually need for interview prep. The curated content approach is brilliant!",
      rating: 5
    },
    {
      name: "Naman Dhoot",
      role: "Final Year Student at RCOEM",
      content: "InterviewKit has become my go-to resource for technical interviews. The organized structure makes learning systematic and effective.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Expert-Curated Content",
      description: "Access high-quality preparatory blogs and documentation written by industry professionals"
    },
    {
      icon: Zap,
      title: "Fast & Organized",
      description: "Quickly find the content you need with smart categorization and search features"
    },
    {
      icon: Users,
      title: "Growing Library",
      description: "Constantly expanding collection of interview preparation materials and resources"
    }
  ];

  const topics = [
    "Data Structures & Algorithms",
    "Operating Systems (OS)",
    "Computer Networks (CN)",
    "Database Management Systems (DBMS)",
    "Object-Oriented Programming (OOP)",
    "System Design (High-Level + Low-Level)",
    "HTML, CSS, JavaScript",
    "React.js / Node.js",
    "Machine Learning Algorithms",
    "SQL & NoSQL Databases",
    "Git & GitHub",
    "Competitive Programming"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              Trusted by students!
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Master Your Next
              <span className="text-blue-600 block">Technical Interview</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access expert-curated preparatory blogs and documentation for technical interviews. 
              From algorithms to system design, we've got the essential content you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                <Link to="/register">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  hoveredFeature === index ? 'bg-blue-50' : 'bg-white'
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-slate-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Master Essential Technical Topics
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive coverage of core CS subjects, programming languages, and modern technologies essential for placements
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-slate-700 font-medium text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What RCOEM Students Say
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Real feedback from students and professionals who've used InterviewKit
            </p>
          </div>
          
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            <div className="overflow-hidden">
              <div 
                className={`flex transition-transform duration-500 ${
                  isManualControl ? 'marquee-manual' : 'animate-marquee hover:pause-animation'
                }`}
                style={{ 
                  width: '200%',
                  transform: isManualControl 
                    ? `translateX(-${currentIndex * 352}px)` // 320px card + 32px margin
                    : undefined
                }}
              >
                {/* First set of testimonials */}
                {testimonials.map((testimonial, index) => (
                  <div key={`first-${index}`} className="flex-shrink-0 mx-4">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-80 h-64">
                      <CardContent className="p-6">
                        <div className="flex justify-center mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-white mb-4 text-sm italic leading-relaxed line-clamp-4">
                          "{testimonial.content}"
                        </p>
                        <div className="absolute bottom-4 left-6 right-6">
                          <p className="text-white font-bold text-sm">{testimonial.name}</p>
                          <p className="text-blue-200 text-xs mt-1 truncate">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {testimonials.map((testimonial, index) => (
                  <div key={`second-${index}`} className="flex-shrink-0 mx-4">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-80 h-64">
                      <CardContent className="p-6">
                        <div className="flex justify-center mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-white mb-4 text-sm italic leading-relaxed line-clamp-4">
                          "{testimonial.content}"
                        </p>
                        <div className="absolute bottom-4 left-6 right-6">
                          <p className="text-white font-bold text-sm">{testimonial.name}</p>
                          <p className="text-blue-200 text-xs mt-1 truncate">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress indicator */}
            {isManualControl && (
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Join thousands of successful candidates who trusted InterviewKit with their career goals
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
            <Link to="/register">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 lg:px-8 bg-slate-800 border-t border-slate-700">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            InterviewKit 2025 | Built for interview success
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
