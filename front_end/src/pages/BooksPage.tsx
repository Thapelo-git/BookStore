import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { BookCard } from '../components/books/BookCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Link } from 'react-router-dom';
import BookList from '../components/BookList';
import { useBooks } from '../hooks/useBooks';
import { Book, BookQueryParams } from '../types/book';

const BooksPage: React.FC = () => {
  const { 
    books, 
    loading, 
    error, 
    pagination, 
    filters, 
    deleteBook, 
    loadBooks, 
    // setFilters 
  } = useBooks();

  const handleEdit = (book: Book) => {
    window.location.href = `/books/edit/${book._id}`;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(id);
    }
  };

  // const handleFiltersChange = (newFilters: BookQueryParams) => {
  //   setFilters(newFilters);
  // };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
 const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter(
        (book) => book.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
      switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
      return result;
  }, [books,searchQuery, selectedCategory, sortBy]);
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground">Browse Books</h1>
          <p className="mt-2 text-muted-foreground">
            Discover your next favorite read from our collection of {books.length} books
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl bg-card p-4 shadow-soft lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
          </p>
        </div>

        {/* Books Grid/List */}
        {filteredBooks.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'flex flex-col gap-4'
            }
          >
            {filteredBooks.map((book, index) => (
              <div
                key={book._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-6xl">📚</div>
            <h3 className="font-display text-xl font-semibold">No books found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </Layout>
    // <div className="min-h-screen bg-gray-50 py-8">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     <div className="flex justify-between items-center mb-6">
    //       <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
    //       <Link
    //         to="/books/new"
    //         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    //       >
    //         Add New Book
    //       </Link>
    //     </div>

    //     <BookList
    //       books={books}
    //       loading={loading}
    //       error={error}
    //       pagination={pagination}
    //       filters={filters}
    //       onEdit={handleEdit}
    //       onDelete={handleDelete}
    //       // onFiltersChange={handleFiltersChange}
    //       onRefresh={() => loadBooks(filters)}
    //     />
    //   </div>
    // </div>
  );
};

export default BooksPage;