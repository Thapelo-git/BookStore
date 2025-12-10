import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero py-20 lg:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="animate-fade-in text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>New Collection Available</span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Discover Your Next
              <span className="block text-primary">Great Read</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground lg:text-xl">
              Explore thousands of books from independent merchants. From bestsellers to hidden gems, 
              find the perfect book for every mood and moment.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link to="/books">
                <Button variant="hero" size="xl">
                  Browse Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="xl">
                  Explore Categories
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
              <div>
                <div className="font-display text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Books Available</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="font-display text-3xl font-bold text-foreground">200+</div>
                <div className="text-sm text-muted-foreground">Trusted Merchants</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="font-display text-3xl font-bold text-foreground">4.9★</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image / Book Stack */}
          <div className="relative animate-slide-up lg:animate-float">
            <div className="relative mx-auto max-w-md">
              {/* Main book */}
              <div className="relative z-20 overflow-hidden rounded-2xl shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=700&fit=crop"
                  alt="Featured Book"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Background books */}
              <div className="absolute -left-8 top-8 z-10 h-[90%] w-[85%] overflow-hidden rounded-2xl bg-muted shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop"
                  alt="Book"
                  className="h-full w-full object-cover opacity-60"
                />
              </div>
              <div className="absolute -right-8 bottom-8 z-10 h-[90%] w-[85%] overflow-hidden rounded-2xl bg-muted shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop"
                  alt="Book"
                  className="h-full w-full object-cover opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
