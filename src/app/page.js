'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import FilterBar from "@/components/FilterBar";
import { DEFAULT_FILTERS, hasActiveFilters } from "@/lib/filterMappings";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useOrders } from "@/hooks/useOrders";
import { useRestaurants } from "@/hooks/useRestaurants";
import ThemeToggle from "@/components/ThemeToggle";
import DashboardHeader from "@/components/DashboardHeader";
import FilterSummary from "@/components/FilterSummary";
import KeyMetricsCards from "@/components/KeyMetricsCards";
import TopRestaurants from "@/components/TopRestaurants";
import RestaurantTrends from "@/components/RestaurantTrends";
import RestaurantsList from "@/components/RestaurantsList";
import OrdersList from "@/components/OrdersList";

export default function DashboardPage() {
    const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
    const [selectedRestaurantIds, setSelectedRestaurantIds] = useState([]);
    const [selectedRestaurantNames, setSelectedRestaurantNames] = useState([]); // Track actual names
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(2);

    const handleFiltersChange = (newFilters) => {
        setActiveFilters(newFilters);
        // console.log("Filters changed:", newFilters);
    };

    // Get restaurants for selection and display
    const { restaurants, loading: restaurantsLoading, error: restaurantsError } = useRestaurants(useMemo(() => ({
        search: searchTerm || undefined,
        sort: sortBy,
        dir: sortDirection,
        per_page: 100
    }), [searchTerm, sortBy, sortDirection]));

    // Memoize analytics params to prevent unnecessary re-renders
    const analyticsParams = useMemo(() => {
        // Always fetch analytics if we have restaurants available
        const hasRestaurants = restaurants && restaurants.length > 0;
        
        if (hasRestaurants) {
            // Get restaurant IDs based on FilterBar selection
            let restaurantIds = undefined;
            if (activeFilters.restaurant && activeFilters.restaurant !== "All Restaurants") {
                if (activeFilters.restaurant.startsWith("Multiple (")) {
                    // Multiple restaurants selected - use selectedRestaurantNames to find IDs
                    if (selectedRestaurantNames.length > 0) {
                        restaurantIds = selectedRestaurantNames
                            .map(name => restaurants.find(r => r.name === name))
                            .filter(r => r)
                            .map(r => r.id);
                    }
                } else {
                    // Single restaurant selected - find its ID
                    const selectedRestaurant = restaurants.find(r => r.name === activeFilters.restaurant);
                    restaurantIds = selectedRestaurant ? [selectedRestaurant.id] : undefined;
                }
            }

        const params = {
                restaurant_ids: restaurantIds,
            dateRange: activeFilters.dateRange,
            customFromDate: activeFilters.customFromDate,
            customToDate: activeFilters.customToDate,
            amountRange: activeFilters.amountRange,
            hourRange: activeFilters.hourRange
        };
            
            // Debug logging
            // console.log('Analytics params:', {
            //     restaurant_ids: restaurantIds,
            //     restaurant_filter: activeFilters.restaurant,
            //     selectedRestaurantNames: selectedRestaurantNames,
            //     dateRange: activeFilters.dateRange,
            //     amountRange: activeFilters.amountRange,
            //     hourRange: activeFilters.hourRange
            // });
            
        return params;
        }
        
        return null;
    }, [
        restaurants,
        selectedRestaurantNames,
        activeFilters.restaurant,
        activeFilters.dateRange,
        activeFilters.customFromDate,
        activeFilters.customToDate,
        activeFilters.amountRange,
        activeFilters.hourRange
    ]);

    // Separate params for top restaurants (date filters + restaurant selection only)
    const topRestaurantsParams = useMemo(() => {
        // Always return params, even if no filters are applied
        // This ensures we get top restaurants data even on initial load
        
            // Get restaurant IDs based on FilterBar selection
            let restaurantIds = undefined;
            if (activeFilters.restaurant && activeFilters.restaurant !== "All Restaurants") {
                if (activeFilters.restaurant.startsWith("Multiple (")) {
                    // Multiple restaurants selected - use selectedRestaurantNames to find IDs
                    if (selectedRestaurantNames.length > 0) {
                        restaurantIds = selectedRestaurantNames
                            .map(name => restaurants.find(r => r.name === name))
                            .filter(r => r)
                            .map(r => r.id);
                    }
                } else {
                    // Single restaurant selected - find its ID
                    const selectedRestaurant = restaurants.find(r => r.name === activeFilters.restaurant);
                    restaurantIds = selectedRestaurant ? [selectedRestaurant.id] : undefined;
                }
            }

            // Top restaurants should respect date filters, restaurant selection, and amount filters
            // Hour filters don't affect top restaurants data
            const params = {
                restaurant_ids: restaurantIds,
                dateRange: activeFilters.dateRange,
                customFromDate: activeFilters.customFromDate,
                customToDate: activeFilters.customToDate,
                amountRange: activeFilters.amountRange
                // Removed: hourRange
            };
            
        // console.log('Top restaurants params:', params);
            return params;
    }, [
        restaurants, 
        selectedRestaurantNames, 
        activeFilters.restaurant, 
        activeFilters.dateRange, 
        activeFilters.customFromDate, 
        activeFilters.customToDate,
        activeFilters.amountRange
        // Removed: activeFilters.hourRange
    ]);

    // Get analytics data based on filters
    const { computedAnalytics, analyticsLoading, topRestaurantsLoading, error: analyticsError, refetch: refetchAnalytics } = useAnalytics(analyticsParams, topRestaurantsParams);

    // Get orders data based on filters
    const ordersParams = useMemo(() => ({
        restaurant_id: selectedRestaurant?.id ?? null,
        dateRange: activeFilters.dateRange,
        customFromDate: activeFilters.customFromDate,
        customToDate: activeFilters.customToDate,
        amountRange: activeFilters.amountRange,
        hourRange: activeFilters.hourRange
    }), [
        selectedRestaurant?.id,
        activeFilters.dateRange,
        activeFilters.customFromDate,
        activeFilters.customToDate,
        activeFilters.amountRange,
        activeFilters.hourRange
    ]);

    const { 
        ordersData, 
        ordersLoading, 
        error: ordersError, 
        currentPage: ordersCurrentPage, 
        itemsPerPage: ordersItemsPerPage, 
        totalOrders: ordersTotalCount, 
        totalPages: ordersTotalPages, 
        handlePageChange: handleOrdersPageChange, 
        handleItemsPerPageChange: handleOrdersItemsPerPageChange, 
        refetch: refetchOrders 
    } = useOrders(analyticsParams, ordersParams);

    // Filter and sort restaurants
    const filteredRestaurants = useMemo(() => {
        if (!restaurants || restaurants.length === 0) return [];
        
        let filtered = restaurants;

        // Apply additional filters if needed
        if (activeFilters.restaurant && activeFilters.restaurant !== "All Restaurants") {
            if (activeFilters.restaurant.startsWith("Multiple (")) {
                // Multiple restaurants selected - show all
            } else {
                // Single restaurant selected - filter to that one
                filtered = filtered.filter(r => r.name === activeFilters.restaurant);
            }
        }

        return filtered;
    }, [restaurants, activeFilters.restaurant]);

    // Pagination logic
    const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = itemsPerPage === 'all' ? filteredRestaurants.length : startIndex + itemsPerPage;
    const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy, sortDirection, activeFilters.restaurant]);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value === 'all' ? 'all' : parseInt(value));
        setCurrentPage(1); // Reset to first page
    };

    // Handle restaurant selection for detailed view
    const handleRestaurantSelect = (restaurant) => {
        // Add a subtle animation effect
        const element = document.querySelector(`[data-restaurant-id="${restaurant.id}"]`);
        if (element) {
            element.classList.add('animate-pulse');
            setTimeout(() => {
                element.classList.remove('animate-pulse');
            }, 300);
        }
        
        setSelectedRestaurant(restaurant);
        
        // No need to fetch trends manually - they come from computedAnalytics
        // console.log(`Selected restaurant: ${restaurant.name} (ID: ${restaurant.id})`);
    };

    // Function to fetch trends for a specific restaurant 
    // const fetchRestaurantTrends = async (restaurantId) => {
    //     try {
    //         // console.log(`Fetching trends for restaurant ${restaurantId}`);
    //         // This function can be used in the future if you need to fetch specific restaurant data
    //         // For now, trends come from the main analytics API
    //     } catch (error) {
    //         console.error('Error fetching restaurant trends:', error);
    //     }
    // };

    // Get selected restaurant trends
    const selectedRestaurantTrends = useMemo(() => {
        if (!selectedRestaurant || !computedAnalytics.trendsByRestaurant) return null;
        
        const trends = computedAnalytics.trendsByRestaurant[selectedRestaurant.id];
        console.log('Selected restaurant trends:', {
            restaurantId: selectedRestaurant.id,
            restaurantName: selectedRestaurant.name,
            trends,
            allTrends: computedAnalytics.trendsByRestaurant
        });
        
        return trends;
    }, [selectedRestaurant, computedAnalytics.trendsByRestaurant]);

    return (
        <div className="min-h-screen bg-subtle">
            {/* Subtle Page-Level Loading Bar */}
            {(analyticsLoading || topRestaurantsLoading) && (
                <div className="fixed top-0 left-0 right-0 z-50">
                    <div className="h-1 bg-primary/20">
                        <div className="h-full bg-primary animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                </div>
            )}
            
            {/* Professional Header */}
            <div className="border-b bg-card-subtle shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-bold text-gradient-primary">Restrolytics</h1>
                    <ThemeToggle />
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Dashboard Header */}
                <DashboardHeader 
                    analyticsLoading={analyticsLoading}
                    topRestaurantsLoading={topRestaurantsLoading}
                    analyticsParams={analyticsParams}
                    computedAnalytics={computedAnalytics}
                />

            {/* Filter Bar */}
            <FilterBar
                title="Filters"
                showRestaurantSelector={true}
                restaurants={restaurants}
                loading={false}
                onFiltersChange={handleFiltersChange}
                activeFilters={activeFilters}
                selectedRestaurantNames={selectedRestaurantNames}
                onRestaurantIdsChange={(ids, names) => {
                    setSelectedRestaurantIds(ids);
                    setSelectedRestaurantNames(names || []);
                }}
            />

                {/* Professional Filter Summary */}
                <FilterSummary 
                    analyticsParams={analyticsParams}
                    activeFilters={activeFilters}
                    selectedRestaurantIds={selectedRestaurantIds}
                />

            {/* Key Metrics Cards */}
                <KeyMetricsCards 
                    analyticsParams={analyticsParams}
                    computedAnalytics={computedAnalytics}
                />

                {/* Top 3 Restaurants by Revenue - Always Visible */}
                <TopRestaurants 
                    computedAnalytics={computedAnalytics}
                    selectedRestaurant={selectedRestaurant}
                    handleRestaurantSelect={handleRestaurantSelect}
                    restaurants={restaurants}
                />

            {/* Restaurant List with Search and Sort */}
                <RestaurantsList
                    analyticsParams={analyticsParams}
                    restaurants={filteredRestaurants}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalPages={totalPages}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    paginatedRestaurants={paginatedRestaurants}
                    handlePageChange={handlePageChange}
                    handleItemsPerPageChange={handleItemsPerPageChange}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    selectedRestaurant={selectedRestaurant}
                    handleRestaurantSelect={handleRestaurantSelect}
                    loading={restaurantsLoading}
                    error={restaurantsError}
                />

            {/* Selected Restaurant Trends */}
                <RestaurantTrends 
                    selectedRestaurant={selectedRestaurant}
                    selectedRestaurantTrends={selectedRestaurantTrends}
                />

                {/* Orders List - Based on current filters and restaurant selection */}
                <OrdersList
                    analyticsParams={analyticsParams}
                    selectedRestaurant={selectedRestaurant}
                    computedAnalytics={computedAnalytics}
                    ordersData={ordersData}
                    ordersLoading={ordersLoading}
                    ordersError={ordersError}
                    ordersTotalCount={ordersTotalCount}
                    ordersTotalPages={ordersTotalPages}
                    ordersCurrentPage={ordersCurrentPage}
                    ordersItemsPerPage={ordersItemsPerPage}
                    handleOrdersPageChange={handleOrdersPageChange}
                    handleOrdersItemsPerPageChange={handleOrdersItemsPerPageChange}
                    refetchOrders={refetchOrders}
                />
            </div>
        </div>
    );
}