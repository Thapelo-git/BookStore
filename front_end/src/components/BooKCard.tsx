import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Book } from '../types/book';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useCart } from '../contexts/CartContext'
import { cn } from '../components/lib/utils';

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


// import React from 'react';
// import { Book } from '../types/book';

// interface BookCardProps {
//   book: Book;
//   onEdit: (book: Book) => void;
//   onDelete: (id: string) => void;
// }

// export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
//       {/* Status Badge */}
//       <div className={`px-4 py-2 text-xs font-semibold ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//         {book.available ? '✓ Available' : '✗ Unavailable'}
//       </div>

//       <div className="p-6">
//         {/* Title */}
//         <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
//           {book.title}
//         </h3>

//         {/* Author */}
//         <div className="flex items-center text-gray-600 mb-3">
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//           </svg>
//           <span className="font-medium">{book.author}</span>
//         </div>

//         {/* Book Details Grid */}
//         <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
//           <div>
//             <span className="text-gray-500">ISBN:</span>
//             <div className="font-mono text-gray-800">{book.isbn}</div>
//           </div>
//           <div>
//             <span className="text-gray-500">Year:</span>
//             <div className="font-semibold text-gray-800">{book.publishedYear}</div>
//           </div>
//           {book.genre && (
//             <div className="col-span-2">
//               <span className="text-gray-500">Genre:</span>
//               <div className="text-gray-800">{book.genre}</div>
//             </div>
//           )}
//         </div>

//         {/* Description */}
//         {book.description && (
//           <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
//             {book.description}
//           </p>
//         )}

//         {/* Action Buttons */}
//         <div className="flex space-x-2 pt-4 border-t border-gray-100">
//           <button
//             onClick={() => onEdit(book)}
//             className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm flex items-center justify-center"
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//             </svg>
//             Edit
//           </button>
//           <button
//             onClick={() => onDelete(book._id)}
//             className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm flex items-center justify-center"
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };