import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Menu, X, Activity, Thermometer, Leaf, Shield, Users, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Testimonials data
  const testimonials = [
    {
      quote: "BuzzKeeper has revolutionized how I manage my hives. The analytics are phenomenal!",
      author: "Sarah Johnson",
      role: "Professional Beekeeper",
    },
    {
      quote: "The disease detection feature saved my colony from complete collapse. Worth every penny.",
      author: "Michael Chen",
      role: "Hobbyist Beekeeper",
    },
    {
      quote: "As a commercial operation, we've increased productivity by 30% using BuzzKeeper's insights.",
      author: "Emma Rodriguez",
      role: "Agricultural Manager",
    },
  ];

  // Features data
  const features = [
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Track bee activity, temperature, humidity, and weight in real-time with advanced sensors."
    },
    {
      icon: Shield,
      title: "Disease Detection",
      description: "AI-powered tools to identify potential health issues before they become critical."
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Track your hives' contribution to local ecosystems and biodiversity."
    },
    {
      icon: Users,
      title: "Beekeeper Community",
      description: "Connect with fellow beekeepers to share knowledge and experiences."
    },
    {
      icon: Thermometer,
      title: "Climate Analytics",
      description: "Advanced data insights with predictive modeling for optimal hive conditions."
    },
    {
      icon: ShoppingBag,
      title: "Beekeeping Marketplace",
      description: "Shop for quality equipment and supplies tailored to your needs."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 hexagon bg-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">BK</span>
                </div>
              </div>
              <div className="hidden md:block ml-4">
                <div className="flex items-center space-x-8">
                  <Link to="/" className="text-foreground font-medium">Home</Link>
                  <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">Features</a>
                  <a href="#testimonials" className="text-foreground/70 hover:text-foreground transition-colors">Testimonials</a>
                  <a href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors">Pricing</a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {user ? (
                  <Button asChild>
                    <Link to="/dashboard">
                      Go to Dashboard <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/sign-up">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-background">
            <div className="p-4 flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-8 px-4 py-2 space-y-6">
              <Link to="/" className="block text-xl font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
              <a href="#features" className="block text-xl" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#testimonials" className="block text-xl" onClick={() => setMenuOpen(false)}>Testimonials</a>
              <a href="#pricing" className="block text-xl" onClick={() => setMenuOpen(false)}>Pricing</a>
              <div className="pt-6 border-t">
                {user ? (
                  <Button className="w-full" asChild>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                      Go to Dashboard <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/sign-in" onClick={() => setMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/sign-up" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-light/30 to-nature-light/40 py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl animate-fade-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-foreground">Protect Your Bees,</span>
                <br />
                <span className="text-primary">Protect the Future</span>
              </h1>
              <p className="text-xl text-foreground/80">
                The advanced beekeeping platform that combines IoT sensors, AI analytics, and community wisdom to help beekeepers thrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link to={user ? "/dashboard" : "/sign-up"}>
                    Get Started <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="relative animate-float">
              <div className="glass-card rounded-2xl p-4 md:p-6 relative z-10">
                <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1592252614638-871d34df4c81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmVla2VlcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    alt="Beekeeping" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="rounded-lg p-4 bg-gradient-to-br from-amber-light to-amber-light/50">
                    <p className="text-sm text-foreground/70">Honey Production</p>
                    <p className="text-2xl font-semibold mt-1">+24%</p>
                    <p className="text-xs text-nature-dark mt-2">↑ from last season</p>
                  </div>
                  <div className="rounded-lg p-4 bg-gradient-to-br from-nature-light to-nature-light/50">
                    <p className="text-sm text-foreground/70">Hive Health</p>
                    <p className="text-2xl font-semibold mt-1">Excellent</p>
                    <p className="text-xs text-nature-dark mt-2">All systems normal</p>
                  </div>
                </div>
              </div>
              {/* Background decorative elements */}
              <div className="absolute -top-8 -right-8 w-40 h-40 hexagon bg-primary/10 -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 hexagon bg-secondary/20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Smart Features for Modern Beekeepers</h2>
            <p className="text-foreground/70 text-lg">
              Our platform combines cutting-edge technology with beekeeping expertise to give you unprecedented insights and control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card rounded-xl p-6 h-full transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Beekeepers Worldwide</h2>
            <p className="text-foreground/70 text-lg">
              Hear from our community about how BuzzKeeper has transformed their beekeeping practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-6 flex flex-col h-full transform transition-all duration-300 hover:shadow-lg"
              >
                <blockquote className="flex-1">
                  <p className="text-lg italic text-foreground/80 mb-4">"{testimonial.quote}"</p>
                </blockquote>
                <div className="border-t pt-4 mt-2">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Beekeeping?</h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Join thousands of beekeepers who are using technology to protect their bees and improve their yields.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link to="/sign-up">
                  Start Free Trial <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t text-foreground py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 hexagon bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">BK</span>
                </div>
                <span className="font-semibold">BuzzKeeper</span>
              </div>
              <p className="text-sm text-foreground/70">
                Advanced technology for modern beekeepers, helping protect bees and improve honey production.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#features" className="hover:text-primary">Features</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">Integrations</a></li>
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-foreground/60">
            <p>© {new Date().getFullYear()} BuzzKeeper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
