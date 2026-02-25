import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  BookOpen,
  Store,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../stores/authStore';
import { useBooks } from '../hooks/useBooks';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
const { books, } = useBooks();
  const stats = [
    {
      title: 'Total Revenue',
      value: '$48,352',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Total Orders',
      value: '1,245',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'bg-secondary/10 text-secondary',
    },
    {
      title: 'Total Books',
      value: books.length.toString(),
      change: '+3 new',
      icon: BookOpen,
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Active Merchants',
      value: '24',
      change: '+2 new',
      icon: Store,
      color: 'bg-primary/10 text-primary',
    },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Smith', amount: '$124.99', status: 'Delivered' },
    { id: '#ORD-002', customer: 'Sarah Wilson', amount: '$89.50', status: 'Processing' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: '$256.00', status: 'Shipped' },
    { id: '#ORD-004', customer: 'Emily Brown', amount: '$45.99', status: 'Pending' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="font-display text-xl font-bold">BookNest</span>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
            >
              <Package className="h-5 w-5" />
              Products
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
            >
              <Users className="h-5 w-5" />
              Users
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
            >
              <Store className="h-5 w-5" />
              Merchants
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
            >
              <TrendingUp className="h-5 w-5" />
              Analytics
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"
            >
              <Settings className="h-5 w-5" />
              Settings
            </a>
          </nav>
          <div className="border-t border-border p-4">
            <div className="mb-3 flex items-center gap-3 px-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
          <Link to="/">
            <Button variant="outline" size="sm">
              View Store
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </header>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-secondary">{stat.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Orders */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                    >
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <span
                          className={`text-xs ${
                            order.status === 'Delivered'
                              ? 'text-secondary'
                              : order.status === 'Processing'
                              ? 'text-accent'
                              : order.status === 'Shipped'
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Top Selling Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {books.slice(0, 4).map((book, index) => (
                    <div
                      key={book._id}
                      className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {index + 1}
                      </span>
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-12 w-9 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{book.title}</p>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${book.price}</p>
                        <p className="text-xs text-muted-foreground">
                          {book.reviewCount} sold
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
