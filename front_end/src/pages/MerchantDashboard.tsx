//import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  BookOpen,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../stores/authStore'
import { useBooks } from '../hooks/useBooks';
import { AddBookDialog } from '../components/merchant/AddBookDialog';
import { Book } from '../types/book';

const MerchantDashboard = () => {
   const { user,  logout } = useAuthStore();
  const { books } = useBooks();
  // Only show books listed by this merchant
  const merchantBooks = books.filter(book => book.merchantId === user?._id);

  const handleAddBook = (newBook: Book) => {
    // Optionally, you can refetch books or update state if needed
  };

  const stats = [
    {
      title: 'Total Sales',
      value: '$12,458',
      change: '+18.2%',
      icon: DollarSign,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Orders',
      value: '156',
      change: '+5 today',
      icon: ShoppingCart,
      color: 'bg-secondary/10 text-secondary',
    },
    {
      title: 'My Books',
      value: merchantBooks.length.toString(),
      change: 'Listed',
      icon: BookOpen,
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Views',
      value: '8,432',
      change: '+22.5%',
      icon: Eye,
      color: 'bg-primary/10 text-primary',
    },
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
              My Products
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
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
          <h1 className="font-display text-xl font-bold">Merchant Dashboard</h1>
          <div className="flex items-center gap-3">
  
            <AddBookDialog onAddBook={handleAddBook} merchantId="m1" merchantName={user?.name || 'Merchant'}>
              <Button variant="default" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </AddBookDialog>
            <Link to="/">
              <Button variant="outline" size="sm">
                View Store
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
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
                  <p className="text-xs text-secondary">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* My Books */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Listed Books</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Book</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium">Stock</th>
                      <th className="pb-3 font-medium">Sales</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantBooks.slice(0, 5).map((book) => (
                      <tr key={book._id} className="border-b border-border">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="h-14 w-10 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium line-clamp-1">{book.title}</p>
                              <p className="text-sm text-muted-foreground">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-muted px-2 py-1 text-xs">
                            {book.category}
                          </span>
                        </td>
                        <td className="py-4 font-medium">${book.price.toFixed(2)}</td>
                        <td className="py-4">
                          <span
                            className={`font-medium ${
                              book.stock > 50
                                ? 'text-secondary'
                                : book.stock > 10
                                ? 'text-accent'
                                : 'text-destructive'
                            }`}
                          >
                            {book.stock}
                          </span>
                        </td>
                        <td className="py-4 text-muted-foreground">{book.reviewCount}</td>
                        <td className="py-4">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MerchantDashboard;
