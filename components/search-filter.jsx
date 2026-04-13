

import { useState, useCallback } from "react";
import { Search, X, SlidersHorizontal, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/products";

export function SearchFilter({ onFilterChange }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = useCallback(() => {
    onFilterChange({
      query,
      category: category === "all" ? "" : category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  }, [query, category, priceRange, onFilterChange]);

  const handleReset = () => {
    setQuery("");
    setCategory("all");
    setPriceRange([0, 1000]);
    onFilterChange({
      query: "",
      category: "",
      minPrice: 0,
      maxPrice: 1000,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="origami-card mb-8 overflow-hidden bg-card p-6">
      {/* Main Search Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search fireworks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-11 border-2 border-foreground bg-background pl-11 text-foreground placeholder:text-muted-foreground focus:ring-0"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Select */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-11 w-full border-2 border-foreground bg-background text-foreground md:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="border-2 border-foreground bg-popover">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Toggle (Mobile) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex h-11 items-center justify-center gap-2 border-2 border-foreground bg-background px-4 text-foreground transition-all hover:bg-foreground hover:text-background md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* Search & Reset Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            className="paper-btn flex h-11 flex-1 items-center justify-center gap-2 md:flex-none"
          >
            <Sparkles className="h-4 w-4" />
            Search
          </button>
          <button
            onClick={handleReset}
            className="paper-btn-outline flex h-11 items-center justify-center px-5 font-semibold"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isExpanded
            ? "mt-6 max-h-40 opacity-100"
            : "mt-6 hidden max-h-0 opacity-0 md:block md:opacity-100"
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Price Range */}
          <div className="flex-1 border border-border bg-background p-4">
            <label className="mb-3 flex items-center justify-between text-sm font-semibold text-foreground">
              <span>Price Range</span>
              <span className="border border-foreground px-2 py-0.5 text-xs">
                Rs.{priceRange[0]} - Rs.{priceRange[1]}
              </span>
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              step={50}
              className="py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
