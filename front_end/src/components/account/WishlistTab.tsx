import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { useBooks} from '../../hooks/useBooks';
import { useWishlist } from '../../contexts/WishlistContext';
import { Link } from 'react-router-dom';
import { toast } from '../../hooks/use-toast';
import { Book } from '../../types/book';
import { useCart } from '../../contexts/CartContext';



export const WishlistTab = () => {
     const { 
    books, 
    
  } = useBooks();
    const { wishlist, removeFromWishlist } = useWishlist();
 
  

  const { addToCart } = useCart();

  const handleAddToCart = (book: Book) => {
   addToCart(book);
    removeFromWishlist(book._id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h2 className="font-display text-2xl font-bold">Your wishlist is empty</h2>
        <p className="mt-2 text-muted-foreground">Browse books and add your favorites here</p>
        <Button asChild className="mt-6">
          <Link to="/books">Browse Books</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">My Wishlist</h2>
        <p className="text-sm text-muted-foreground">{wishlist.length} items</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {wishlist.map((book) => (
          <Card key={book._id} className="shadow-soft overflow-hidden">
            <CardContent className="flex gap-4 p-4">
              <Link to={`/book/${book._id}`}>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-32 w-24 rounded-lg object-cover shadow-sm transition-transform hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to={`/book/${book._id}`} className="hover:text-primary">
                  <h3 className="font-display font-semibold line-clamp-1">{book.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs text-muted-foreground">{book.rating}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div>
                    <span className="font-display text-lg font-bold">${book.price.toFixed(2)}</span>
                    {book.originalPrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        ${book.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => handleAddToCart(book)} className="flex-1">
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromWishlist(book._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
