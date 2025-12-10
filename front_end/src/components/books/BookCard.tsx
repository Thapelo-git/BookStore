import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Book } from '../../types/book';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useCart } from '../../contexts/CartContext';
import { cn } from '../lib/utils';

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  const { addToCart } = useCart();

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl bg-card shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1',
        className
      )}
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {book.bestseller && (
          <Badge className="bg-primary text-primary-foreground">Bestseller</Badge>
        )}
        {book.originalPrice && (
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% Off
          </Badge>
        )}
      </div>

      {/* Book Cover */}
      <Link to={`/book/${book.id}`} className="block overflow-hidden">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/book/${book.id}`}>
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground line-clamp-2 transition-colors hover:text-primary">
            {book.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{book.rating}</span>
          <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
        </div>

        {/* Price & Action */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-foreground">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.preventDefault();
              addToCart(book);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
