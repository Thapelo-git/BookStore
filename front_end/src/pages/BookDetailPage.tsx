
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';

const BookDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { books, loading, error } = useBooks();

  const book = books.find((b) => b._id === id);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Loading...</h1>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Book not found</h1>
          <Link to="/books" className="mt-4 inline-block text-primary hover:underline">
            Back to books
          </Link>
        </div>
      </Layout>
    );
  }

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Book Cover */}
          <div className="animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl bg-muted shadow-elevated">
              {book.bestseller && (
                <Badge className="absolute left-4 top-4 z-10 bg-primary text-primary-foreground">
                  Bestseller
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="absolute right-4 top-4 z-10 bg-accent text-accent-foreground">
                  {discount}% Off
                </Badge>
              )}
              <img
                src={book.coverImage}
                alt={book.title}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="animate-slide-up">
            <div className="mb-2 text-sm font-medium text-primary">{book.category}</div>
            <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">by {book.author}</p>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(book.rating)
                        ? 'fill-accent text-accent'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{book.rating}</span>
              <span className="text-muted-foreground">({book.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-foreground">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="mt-4">
              {book.stock > 0 ? (
                <span className="text-sm text-secondary">
                  ✓ In Stock ({book.stock} available)
                </span>
              ) : (
                <span className="text-sm text-destructive">Out of Stock</span>
              )}
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 font-display text-lg font-semibold">About this book</h3>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center gap-2 rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={() => addToCart(book, quantity)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Free Shipping</div>
                  <div className="text-xs text-muted-foreground">Orders over $35</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Secure Payment</div>
                  <div className="text-xs text-muted-foreground">100% Protected</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">30-day return</div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Book Details */}
            <div>
              <h3 className="mb-4 font-display text-lg font-semibold">Book Details</h3>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <dt className="text-muted-foreground">ISBN</dt>
                  <dd className="font-medium">{book.isbn}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <dt className="text-muted-foreground">Pages</dt>
                  <dd className="font-medium">{book.pages}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <dt className="text-muted-foreground">Language</dt>
                  <dd className="font-medium">{book.language}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <dt className="text-muted-foreground">Published</dt>
                  <dd className="font-medium">{book.publishedDate}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-muted/30 px-3 py-2 sm:col-span-2">
                  <dt className="text-muted-foreground">Sold by</dt>
                  <dd className="font-medium text-primary">{book.merchantName}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetailPage;
