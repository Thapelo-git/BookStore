import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
type Book = {
  _id: string;
  title: string;
  author: string;
  genre: string;
  status: string;
  isPublic: boolean;
  publishedYear: number;
  description: string;
};

export function BookGrid() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5002/api/books") // replace with your endpoint
      .then((res) => res.json())
      .then((data) => {
        const allBooks: Book[] = data.data || [];
        // Only show public books
        const publicBooks = allBooks.filter((b) => b.isPublic);
        setBooks(publicBooks);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Available Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
        
            <Link
                  to="/login"
              key={book._id}
              className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    book.status === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.status.toUpperCase()}
                </span>
                {book.isPublic && (
                  <span className="text-xs font-medium text-blue-600">Public</span>
                )}
              </div>
              <h3 className="text-lg font-bold mb-1">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Genre:</span> {book.genre}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                <span className="font-medium">Year:</span> {book.publishedYear}
              </p>
              {book.description && (
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                  {book.description}
                </p>
              )}
              {/* <button className="w-full py-2 mt-auto bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                View Details
              </button> */}
           </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
