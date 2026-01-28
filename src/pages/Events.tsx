import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Calendar, Loader2 } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { format } from "date-fns";

const categories = [
  "All Events",
  "Music & Concerts",
  "Business & Networking",
  "Workshops & Classes",
  "Sports & Fitness",
  "Arts & Culture",
  "Food & Drink",
  "Charity & Causes",
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [sortBy, setSortBy] = useState("date");

  const { listings, isLoading, error } = useListings({
    type: "event",
    category: selectedCategory,
    searchQuery,
    sortBy,
  });

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-accent text-white">
        <div className="container py-12">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">Events</h1>
          </div>
          <p className="text-white/80">
            Discover exciting events, workshops, and gatherings near you
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date: Upcoming</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{listings.length}</span> events
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">Error loading events: {error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && listings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No events found matching your criteria.</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Events");
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && listings.length > 0 && (
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price || undefined}
                image={listing.images?.[0] || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80"}
                location={listing.location}
                category="event"
                isSponsored={listing.is_sponsored || false}
                isFeatured={listing.is_featured || false}
                isFree={listing.is_free || false}
                eventDate={listing.event_date ? format(new Date(listing.event_date), "MMM d") : undefined}
              />
            ))}
          </div>
        )}

        {!isLoading && listings.length > 0 && (
          <div className="text-center mt-10">
            <Button variant="outline" size="lg">
              Load More Events
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
