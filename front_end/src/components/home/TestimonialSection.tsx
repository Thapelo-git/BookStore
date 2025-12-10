import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Avid Reader',
    content: 'BookNest has completely transformed how I discover new books. The curation is exceptional, and the merchant network means I always find unique editions.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'James Cooper',
    role: 'Book Collector',
    content: 'As a collector, I appreciate the quality and authenticity. The platform makes it easy to connect with trusted sellers and find rare editions.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Literature Professor',
    content: 'I recommend BookNest to all my students. The academic section is well-organized, and the prices are competitive. Excellent service!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
];

export function TestimonialSection() {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
            What Our Readers Say
          </h2>
          <p className="mt-2 text-muted-foreground">
            Join thousands of satisfied book lovers
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="animate-slide-up rounded-xl bg-card p-6 shadow-soft"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="mb-4 h-8 w-8 text-primary/20" />
              <p className="mb-6 text-foreground">{testimonial.content}</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
