import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { books } from '../../data/mockData';
import { BookCard } from '../books/BookCard';
import { Button } from '../ui/button';

export function FeaturedBooks() {
  const featuredBooks = books.filter((book) => book.featured).slice(0, 4);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              Featured Books
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked selections from our collection
            </p>
          </div>
          <Link to="/books">
            <Button variant="outline">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBooks.map((book, index) => (
            <div
              key={book.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
