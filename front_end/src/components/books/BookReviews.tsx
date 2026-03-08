import { useState,useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import {useReviews} from '../../contexts/ReviewContext';
import { cn } from '../lib/utils';
import { toast } from '../../hooks/use-toast';

interface BookReviewsProps {
  bookId: string;
}

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-5 w-5 transition-colors',
            (interactive ? (hover || rating) : rating) > i
              ? 'fill-accent text-accent'
              : 'fill-muted text-muted',
            interactive && 'cursor-pointer hover:scale-110 transition-transform'
          )}
          onClick={() => interactive && onRate?.(i + 1)}
          onMouseEnter={() => interactive && setHover(i + 1)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      ))}
    </div>
  );
}

export function BookReviews({ bookId }: BookReviewsProps) {
  const { reviews,fetchReviews,addReview} = useReviews();
  const bookReviews = reviews.filter(r => r.bookId === bookId)

useEffect(() => {
  fetchReviews(bookId);
}, [bookId]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // if (!name.trim()) {
    //   toast({ title: 'Name required', description: 'Please enter your name.', variant: 'destructive' });
    //   return;
    // }
    if (rating === 0) {
      toast({ title: 'Rating required', description: 'Please select a star rating.', variant: 'destructive' });
      return;
    }
    if (!comment.trim()) {
      toast({ title: 'Comment required', description: 'Please write a comment.', variant: 'destructive' });
      return;
    }

    addReview(bookId, name.trim(), rating, comment.trim());
    setName('');
    setRating(0);
    setComment('');
    toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
  };

  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Reviews & Ratings</h2>

      {/* Add Review Form */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        <h3 className="font-display text-lg font-semibold mb-4">Write a Review</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Your Name</label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Your Rating</label>
            <StarRating rating={rating} onRate={setRating} interactive />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Your Comment</label>
            <Textarea
              placeholder="Share your thoughts about this book..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
          <Button onClick={handleSubmit} className="gap-2">
            <Send className="h-4 w-4" />
            Submit Review
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      {bookReviews.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {bookReviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">{review.createdAt}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
