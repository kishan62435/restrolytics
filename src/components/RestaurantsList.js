import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Building2, List, Grid3X3, Search, ArrowUpDown } from "lucide-react";

export default function RestaurantsList({
    analyticsParams,
    restaurants,
    viewMode,
    setViewMode,
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedRestaurants,
    handlePageChange,
    handleItemsPerPageChange,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedRestaurant,
    handleRestaurantSelect,
    loading,
    error
}) {
    if (!analyticsParams) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Restaurants List
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Search, sort, and select restaurants to view detailed analytics
                </p>
            </CardHeader>
            <CardContent>
                {/* Search and Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search restaurants by name, location, or cuisine..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border shadow-lg">
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="location">Location</SelectItem>
                                <SelectItem value="cuisine">Cuisine</SelectItem>
                                <SelectItem value="created_at">Created Date</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                            className="w-10 h-10"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* View Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 order-1">
                        <span className="text-sm font-medium">View:</span>
                        <Button
                            variant={viewMode === 'cards' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('cards')}
                            className="flex items-center gap-2"
                        >
                            <Grid3X3 className="h-4 w-4" />
                            Cards
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className="flex items-center gap-2"
                        >
                            <List className="h-4 w-4" />
                            Table
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 order-2 sm:order-1">
                        <span className="text-sm font-medium">Items per page:</span>
                        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder={itemsPerPage === 'all' ? 'All' : itemsPerPage.toString()} />
                            </SelectTrigger>
                            <SelectContent className="bg-card border shadow-lg">
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Results Counter */}
                <div className="text-sm text-muted-foreground mb-4">
                    Showing {startIndex + 1} to {Math.min(endIndex, restaurants.length)} of {restaurants.length} restaurants
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-8 text-destructive">
                        <p>Error loading restaurants: {error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-2">
                            Retry
                        </Button>
                    </div>
                )}

                {/* No Restaurants State */}
                {!loading && !error && (!restaurants || restaurants.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                        <div className="text-sm">No restaurants found</div>
                        <div className="text-xs mt-1">Try adjusting your search or filters</div>
                    </div>
                )}

                {/* Restaurant Views - Only show when there are restaurants and no loading/error */}
                {!loading && !error && restaurants && restaurants.length > 0 && (
                    <>
                        {/* Cards View */}
                        {viewMode === 'cards' && (
                            <div className="space-y-3">
                                {paginatedRestaurants.map((restaurant) => (
                                    <div 
                                        key={restaurant.id} 
                                        data-restaurant-id={restaurant.id}
                                        className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-300 ease-in-out transform ${
                                            selectedRestaurant?.id === restaurant.id 
                                                ? 'ring-2 ring-primary bg-primary/5 border-primary/20 shadow-lg scale-[1.02]' 
                                                : 'hover:bg-muted/30 hover:border-muted-foreground/30 hover:scale-[1.01] hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                                selectedRestaurant?.id === restaurant.id 
                                                    ? 'bg-primary text-primary-foreground' 
                                                    : 'bg-primary/10 text-primary'
                                            }`}>
                                                {restaurant.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold text-lg ${
                                                    selectedRestaurant?.id === restaurant.id ? 'text-primary' : ''
                                                }`}>
                                                    {restaurant.name}
                                                    {selectedRestaurant?.id === restaurant.id && (
                                                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                                            Selected
                                                        </span>
                                                    )}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {restaurant.location} • {restaurant.cuisine}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                                                                         <Button 
                                                 variant={selectedRestaurant?.id === restaurant.id ? "default" : "outline"}
                                                 onClick={() => handleRestaurantSelect(restaurant)}
                                                 className={`transition-all duration-200 min-w-[80px] ${
                                                     selectedRestaurant?.id === restaurant.id 
                                                         ? 'bg-primary text-primary-foreground shadow-lg' 
                                                         : 'hover:bg-primary hover:text-primary-foreground'
                                                 }`}
                                             >
                                                 {selectedRestaurant?.id === restaurant.id ? '✓' : 'Select'}
                                             </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Table View */}
                        {viewMode === 'table' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-semibold text-sm">Restaurant</th>
                                            <th className="text-left p-3 font-semibold text-sm">Location</th>
                                            <th className="text-left p-3 font-semibold text-sm">Cuisine</th>
                                            <th className="text-left p-3 font-semibold text-sm">Created</th>
                                            <th className="text-right p-3 font-semibold text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRestaurants.map((restaurant) => (
                                            <tr 
                                                key={restaurant.id} 
                                                data-restaurant-id={restaurant.id}
                                                className={`border-b transition-all duration-200 hover:bg-muted/30 ${
                                                    selectedRestaurant?.id === restaurant.id 
                                                        ? 'bg-primary/5 border-primary/20' 
                                                        : ''
                                                }`}
                                            >
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                            selectedRestaurant?.id === restaurant.id 
                                                                ? 'bg-primary text-primary-foreground' 
                                                                : 'bg-primary/10 text-primary'
                                                        }`}>
                                                            {restaurant.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className={`font-semibold ${
                                                                selectedRestaurant?.id === restaurant.id ? 'text-primary' : ''
                                                            }`}>
                                                                {restaurant.name}
                                                                {selectedRestaurant?.id === restaurant.id && (
                                                                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                                                        Selected
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    {restaurant.location}
                                                </td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    {restaurant.cuisine}
                                                </td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    {new Date(restaurant.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-3 text-right">
                                                                                                         <Button 
                                                         variant={selectedRestaurant?.id === restaurant.id ? "default" : "outline"}
                                                         size="sm"
                                                         onClick={() => handleRestaurantSelect(restaurant)}
                                                         className={`transition-all duration-200 min-w-[70px] ${
                                                             selectedRestaurant?.id === restaurant.id 
                                                                 ? 'bg-primary text-primary-foreground shadow-lg' 
                                                                 : 'hover:bg-primary hover:text-primary-foreground'
                                                         }`}
                                                     >
                                                         {selectedRestaurant?.id === restaurant.id ? '✓' : 'Select'}
                                                     </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
                                    <div className="flex items-center gap-2 order-2 sm:order-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="min-w-[80px]"
                                        >
                                            Previous
                                        </Button>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="min-w-[80px]"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    
                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1 order-1 sm:order-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            // Show first page, last page, current page, and pages around current
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <Button
                                                        key={page}
                                                        variant={page === currentPage ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handlePageChange(page)}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        {page}
                                                    </Button>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return <span key={page} className="px-2 text-muted-foreground">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
