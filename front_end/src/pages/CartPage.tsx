import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/api';
import { Book } from '../types/book';

//import { useBooks } from '../hooks/useBooks';
export interface CartItem {
  book: Book;
  quantity: number;
}
const CartPage = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">
              Looks like you haven't added any books yet.
            </p>
            <Link to="/books" className="mt-6">
              <Button variant="hero" size="lg">
                Browse Books
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
const handleCheckout = async () => {
  try {
    await orderService.create({
      items: items,
      shippingAddress: {
        street: '123 Main',
        city: 'Johannesburg',
        state: 'Gauteng',
        zipCode: '2000',
        country: 'South Africa'
      }
    });

    clearCart();
  } catch (error) {
    console.error(error);
  }
};
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
          <Button variant="ghost" onClick={clearCart} className="text-destructive">
            Clear Cart
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.book._id}
                  className="flex gap-4 rounded-xl bg-card p-4 shadow-soft"
                >
                  <Link to={`/book/${item.book._id}`} className="shrink-0">
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="h-32 w-24 rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link to={`/book/${item.book._id}`}>
                          <h3 className="font-display font-semibold hover:text-primary">
                            {item.book.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.book.author}</p>
                        <p className="text-xs text-muted-foreground">
                          Sold by {item.book.merchantName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.book._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg font-bold">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-muted-foreground">
                            ${item.book.price.toFixed(2)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold">Order Summary</h2>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-secondary">
                    {total >= 35 ? 'Free' : '$4.99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${(total * 0.08).toFixed(2)}</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between">
                <span className="font-display text-lg font-bold">Total</span>
                <span className="font-display text-xl font-bold">
                  ${(total + (total >= 35 ? 0 : 4.99) + total * 0.08).toFixed(2)}
                </span>
              </div>
       <Button onClick={handleCheckout} variant="hero" size="lg" className="mt-6 w-full">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Free shipping on orders over $35
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
