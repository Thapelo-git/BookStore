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
  Pencil,Trash2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../stores/authStore'
import { useBooks } from '../hooks/useBooks';
import { AddBookDialog } from '../components/merchant/AddBookDialog';
import { Book } from '../types/book';
import { toast } from 'sonner';
import { useState,useEffect } from 'react';
import { MerchantOrdersTab } from '../components/merchant/MerchantOrdersTab';
import { EditBookDialog } from '../components/merchant/EditBookDialog';
import { bookService } from "../services/api";

type MerchantTab = 'dashboard' | 'products' | 'orders' | 'analytics' | 'settings';
const MerchantDashboard = () => {
   const { user,  logout } = useAuthStore();
  const { books } = useBooks();
  // Only show books listed by this merchant
  const [activeTab, setActiveTab] = useState<MerchantTab>('dashboard');
    const [merchantBookList, setMerchantBookList] = useState<Book[]>(
    books.filter((book) => book.merchantId === user?.id ))
useEffect(() => {
  setMerchantBookList(
    books.filter(book => book.merchantId === user?.id)
  );
}, [books, user]);
const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleAddBook = (newBook: Book) => {
    // Optionally, you can refetch books or update state if needed
  };
const handleEditBook = async (updatedBook: Book) => {
  try {
    await bookService.update(updatedBook._id, updatedBook);

    setMerchantBookList(prev =>
      prev.map(b => (b._id === updatedBook._id ? updatedBook : b))
    );

    toast.success("Book updated successfully!");
  } catch (error) {
    toast.error("Failed to update book");
  }
};

 const handleDeleteBook = async (bookId: string) => {
  try {
    await bookService.delete(bookId);

    setMerchantBookList((prev) =>
      prev.filter((b) => b._id !== bookId)
    );

    toast.success("Book deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete book");
  }
};
  const merchantBooks = merchantBookList;
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
      value: merchantBookList.length.toString(),
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
const navItems: { key: MerchantTab; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products', label: 'My Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingCart },
    { key: 'analytics', label: 'Analytics', icon: TrendingUp },
    { key: 'settings', label: 'Settings', icon: Settings },]

 const BooksTable = ({ books, showAll }: { books: Book[]; showAll?: boolean }) => (
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
          {(showAll ? books : books.slice(0, 5)).map((book) => (
            <tr key={book._id} className="border-b border-border">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <img src={book.coverImage} alt={book.title} className="h-14 w-10 rounded object-cover" />
                  <div>
                    <p className="font-medium line-clamp-1">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <span className="rounded-full bg-muted px-2 py-1 text-xs">{book.category}</span>
              </td>
              <td className="py-4 font-medium">${book.price.toFixed(2)}</td>
              <td className="py-4">
                <span className={`font-medium ${book.stock > 50 ? 'text-secondary' : book.stock > 10 ? 'text-accent' : 'text-destructive'}`}>
                  {book.stock}
                </span>
              </td>
              <td className="py-4 text-muted-foreground">{book.reviewCount}</td>
              <td className="py-4">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setEditingBook(book); setEditDialogOpen(true); }}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteBook(book._id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className="shadow-soft">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <div className={`rounded-lg p-2 ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-secondary">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Listed Books</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('products')}>View All</Button>
              </CardHeader>
              <CardContent>
                <BooksTable books={merchantBookList} />
              </CardContent>
            </Card>
          </>
        );
      case 'products':
        return (
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Products ({merchantBooks.length})</CardTitle>
              <AddBookDialog onAddBook={handleAddBook} merchantId="m1" merchantName={user?.name || 'Merchant'}>
                <Button variant="default" size="sm"><Plus className="mr-2 h-4 w-4" />Add Book</Button>
              </AddBookDialog>
            </CardHeader>
            <CardContent>
              <BooksTable books={merchantBooks} showAll />
            </CardContent>
          </Card>
        );
      case 'orders':
        return <MerchantOrdersTab />;
      case 'analytics':
        return (
          <Card className="shadow-soft">
            <CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Analytics dashboard coming soon.</p></CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card className="shadow-soft">
            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Merchant settings coming soon.</p></CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="font-display text-xl font-bold">BookNest</span>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                  activeTab === key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
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

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <h1 className="font-display text-xl font-bold">
            {activeTab === 'dashboard' ? 'Merchant Dashboard' : navItems.find((n) => n.key === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-3">
            {activeTab === 'dashboard' && (
              <AddBookDialog onAddBook={handleAddBook} merchantId="m1" merchantName={user?.name || 'Merchant'}>
                <Button variant="default" size="sm"><Plus className="mr-2 h-4 w-4" />Add Book</Button>
              </AddBookDialog>
            )}
            <Link to="/"><Button variant="outline" size="sm">View Store<ChevronRight className="ml-1 h-4 w-4" /></Button></Link>
          </div>
        </header>
        <div className="p-6">{renderContent()}</div>
      </main>

      <EditBookDialog book={editingBook} open={editDialogOpen} onOpenChange={setEditDialogOpen} onSave={handleEditBook} />
    </div>
  );
};

export default MerchantDashboard;
