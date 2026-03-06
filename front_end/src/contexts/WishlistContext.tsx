import { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from '../types/book';
import { toast } from '../hooks/use-toast';

interface WishlistContextType {
  wishlist: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  toggleWishlist: (book: Book) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Book[]>([]);

  const addToWishlist = (book: Book) => {
    setWishlist((prev) => {
      if (prev.some((b) => b._id === book._id)) return prev;
      return [...prev, book];
    });
    toast({ title: 'Added to wishlist', description: `${book.title} added to your wishlist.` });
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist((prev) => prev.filter((b) => b._id !== bookId));
    toast({ title: 'Removed from wishlist', description: 'Book removed from your wishlist.' });
  };

  const isInWishlist = (bookId: string) => wishlist.some((b) => b._id === bookId);

  const toggleWishlist = (book: Book) => {
    if (isInWishlist(book._id)) {
      removeFromWishlist(book._id);
    } else {
      addToWishlist(book);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
