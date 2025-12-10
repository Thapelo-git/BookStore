import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { books } from '../../data/mockData';
import { BookCard } from '../BooKCard';
import { Button } from '../ui/button';

export function BestsellerSection() {
  const bestsellers = books.filter((book) => book.bestseller).slice(0, 4);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                Bestsellers
              </h2>
              <p className="mt-1 text-muted-foreground">
                The books everyone's reading
              </p>
            </div>
          </div>
          <Link to="/bestsellers">
            <Button variant="outline">
              See All Bestsellers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((book, index) => (
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
