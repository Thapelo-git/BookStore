
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { BookCard } from "../components/books/BookCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useBooks } from "../hooks/useBooks";

const BOOKS_PER_PAGE = 8;

const BooksPage: React.FC = () => {
  const { books } = useBooks();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter books by search
  const filteredBooks = useMemo(() => {
    if (!searchQuery) return books;

    const query = searchQuery.toLowerCase();

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    return filteredBooks.slice(start, end);
  }, [filteredBooks, currentPage]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Browse Books</h1>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        {/* Books */}
        {paginatedBooks.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-10">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span className="flex items-center text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold">No books found</h3>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BooksPage;

