

import { useState, useMemo, useCallback } from "react";
import {
  categories,
  searchProducts,
  getProductsByCategory,
} from "@/lib/products";
import { SearchFilter } from "./search-filter";
import { ProductRow } from "./product-row";
import { ProductCard } from "./product-card";
import { ScrollAnimation } from "./ui/scroll-animation";

export function ProductSection() {
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    minPrice: 0,
    maxPrice: 100,
  });
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setIsFiltering(
      newFilters.query !== "" ||
        newFilters.category !== "" ||
        newFilters.minPrice > 0 ||
        newFilters.maxPrice < 100,
    );
  }, []);

  const filteredProducts = useMemo(() => {
    if (!isFiltering) return null;
    return searchProducts(
      filters.query,
      filters.category,
      filters.minPrice,
      filters.maxPrice,
    );
  }, [filters, isFiltering]);

  const categoryProducts = useMemo(() => {
    return categories.map((category) => ({
      category,
      products: getProductsByCategory(category),
    }));
  }, []);

  return (
    <section id="products" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <ScrollAnimation className="mb-12 text-center" animation="fade-up">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-primary">
            Our Collection
          </span>
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Browse Our Products
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            Explore our extensive collection of fireworks, organized by
            category. Use the filters to find exactly what you need for your
            celebration.
          </p>
        </ScrollAnimation>

        {/* Search & Filter */}
        <SearchFilter onFilterChange={handleFilterChange} />

        {/* Content */}
        {isFiltering ? (
          // Filtered Results
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Search Results ({filteredProducts?.length || 0})
              </h3>
            </div>
            {filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  No Results Found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        ) : (
          // Category Rows (Netflix-style)
          <ScrollAnimation animation="fade-up" delay={0.2}>
            {categoryProducts.map(({ category, products }) => (
              <ProductRow key={category} title={category} products={products} />
            ))}
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}
