import { Link } from 'react-router-dom';
import { categories } from '../../data/mockData';

export function CategorySection() {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find your next read in your favorite genre
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col items-center rounded-xl bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1">
                <span className="mb-3 text-4xl">{category.icon}</span>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.bookCount} books
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
