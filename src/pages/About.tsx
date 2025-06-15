import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Target, Award, Mail, Github, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import SecurePhoto from "@/components/SecurePhoto";

const About = () => {
  const teamMembers = [
    {
      name: "Akhilesh Bonde",
      role: "Founder & Chief Architect",
      description: "Full-stack developer passionate about creating tools that help developers succeed in their career journey"
    }
  ];

  const stats = [
    { icon: BookOpen, label: "Preparatory Blogs", value: "Growing" },
    { icon: Brain, label: "Expert Content", value: "Curated" },
    { icon: Target, label: "Topics Covered", value: "Essential" },
    { icon: Award, label: "Quality Focused", value: "Always" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            About InterviewKit
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            We're focused on sharing high-quality preparatory documentation and blogs to help developers 
            excel in technical interviews, with exciting new features coming soon.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Technical interviews can be daunting, but they shouldn't be a barrier to career growth. 
                InterviewKit was born from the belief that with the right preparation materials and guidance, 
                anyone can succeed in their technical interviews.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Currently, we focus on delivering expert-curated blogs and documentation that cover 
                essential interview topics. We're building a comprehensive platform with many exciting 
                features planned for the future.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              InterviewKit is built with passion and dedication to help developers 
              excel in their interview journey and achieve their career goals.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="max-w-sm">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full relative">
                      <SecurePhoto 
                        alt={member.name}
                        className="w-full h-full object-cover"
                        width={96}
                        height={96}
                      />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">{member.description}</p>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Quality First</h3>
              <p className="text-slate-600">
                Every piece of content is carefully crafted to ensure accuracy, relevance, and practical value.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Expert Curation</h3>
              <p className="text-slate-600">
                Carefully selected and organized content to ensure you get the most relevant and valuable preparation materials.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Success Focused</h3>
              <p className="text-slate-600">
                Everything we build is designed to help you succeed in your interviews and achieve your career goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Get In Touch</h2>
          <p className="text-lg text-slate-600 mb-8">
            Have questions, feedback, or want to contribute? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <Button variant="outline" size="lg" className="flex items-center space-x-2" asChild>
              <a href="mailto:akhileshbruh@gmail.com">
                <Mail className="h-5 w-5" />
                <span>Email Us</span>
              </a>
            </Button>
            <Button variant="outline" size="lg" className="flex items-center space-x-2" asChild>
              <a href="https://github.com/akhileshh-b/InterviewKit-Public" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </Button>
          </div>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/register">
              Join InterviewKit Today
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            InterviewKit 2025 | Built for interview success
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
