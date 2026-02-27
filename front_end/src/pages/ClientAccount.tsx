import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  BookOpen,
  Clock,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { useAuthStore } from '../stores/authStore';
import { useBooks } from '../hooks/useBooks';
import { Layout } from '../components/layout/Layout';
import React, { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import { Order } from '../types/book'; 

//import { Link, useLocation } from 'react-router-dom';


const ClientAccount = () => {
   
  const { user, logout} = useAuthStore();
   
const [orders, setOrders] = useState<Order[]>([]);
  
  const { books, } = useBooks();
  useEffect(() => {
  const fetchOrders = async () => {
    const res = await orderService.getMyOrders();
    setOrders(res.data);
  };

  fetchOrders();
}, []);
//   const recentOrders = [
//     {
//       id: '#ORD-1234',
//       date: '2024-01-15',
//       status: 'Delivered',
//       total: 67.98,
//       books: [books[0], books[2]],
//     },
//     {
//       id: '#ORD-1233',
//       date: '2024-01-10',
//       status: 'Shipped',
//       total: 24.99,
//       books: [books[1]],
//     },
//     {
//       id: '#ORD-1232',
//       date: '2024-01-05',
//       status: 'Processing',
//       total: 89.97,
//       books: [books[3], books[4], books[5]],
//     },
//   ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'Shipped':
        return <Truck className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-accent" />;
    }
  };

// HeartToggle component for wishlist icon
// function HeartToggle() {
//   const [liked, setLiked] = useState(false);
//   useEffect(() => {
//     try {
//       const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
//       setLiked(Array.isArray(wishlist) && wishlist.length > 0);
//     } catch {}
//   }, []);
//   const handleToggle = () => {
//     let wishlist = [];
//     try {
//       wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
//     } catch {}
//     if (liked) {
//       wishlist = [];
//     } else {
//       wishlist = ['dummy'];
//     }
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//     setLiked(!liked);
//   };
//   return (
//     <button onClick={handleToggle} aria-label="Toggle wishlist" type="button">
//       <Heart className={`h-6 w-6 ${liked ? 'text-red-500 fill-red-500' : 'text-accent'}`} />
//     </button>
//   );
// }
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">Manage your account and view your orders</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                    {user?.name.charAt(0)}
                  </div>
                  <h2 className="font-display text-xl font-semibold">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Separator className="my-4" />
                <nav className="space-y-1">
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </a>
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
                  >
                    <Package className="h-4 w-4" />
                    Orders
                  </Link>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
                  >
                    <MapPin className="h-4 w-4" />
                    Addresses
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
                  >
                    <CreditCard className="h-4 w-4" />
                    Payment Methods
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                </nav>
                <Separator className="my-4" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-3">
            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="shadow-soft">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                    <BookOpen className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{(() => {
                      // Count total books bought
                      let count = 0;
                      orders.forEach(order => {
                        count += order.items.length;
                      });
                      return count;
                    })()}</p>
                    <p className="text-sm text-muted-foreground">Books Bought</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    {/* Heart icon toggle */}
                    {/* <HeartToggle /> */}
                  </div>
                  {/* <div>
                    <p className="text-2xl font-bold">{(() => {
                      // Wishlist count from localStorage (assume 'wishlist' is an array of book IDs)
                      let wishlistCount = 0;
                      try {
                        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                        if (Array.isArray(wishlist)) wishlistCount = wishlist.length;
                      } catch {}
                      return wishlistCount;
                    })()}</p>
                    <p className="text-sm text-muted-foreground">Wishlist Items</p>
                  </div> */}
                </CardContent>
              </Card>
        
            
            </div>

            {/* Recent Orders */}
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link to="/cart">
                  <Button variant="outline" size="sm">
                    View All Orders
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/30"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{order._id}</span>
                          <span className="ml-3 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span
                            className={`text-sm font-medium ${
                              order.status === 'delivered'
                                ? 'text-secondary'
                                : order.status === 'shipped'
                                ? 'text-primary'
                                : 'text-accent'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.items.map((item) => (
                            <img
                              key={item.book._id}
                              src={item.book.coverImage}
                              alt={item.book.title}
                              className="h-16 w-12 rounded object-cover"
                            />
                        ))}
                        <div className="ml-auto text-right">
                          <p className="font-display text-lg font-bold">
                            R{order.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Books */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {books.slice(0, 4).map(book => (
                    <Link
                      key={book._id}
                      to={`/book/${book._id}`}
                      className="group flex flex-col rounded-lg p-2 transition-colors hover:bg-muted/30"
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="mb-2 aspect-[3/4] w-full rounded-lg object-cover"
                      />
                      <h3 className="font-medium line-clamp-1 group-hover:text-primary">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <p className="mt-auto font-bold">${book.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientAccount;
