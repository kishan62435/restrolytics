import { useState, useEffect, useCallback, useMemo } from "react";
import { restaurantService } from "@/api/services/restaurantService";

export const useRestaurants = (params = {}) => {
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRestaurants = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Only fetch restaurants once with basic params (no search/sort needed)
            const data = await restaurantService.getRestaurants({
                per_page: 100 // Get all restaurants
            });

            // Handle the API response structure
            if (data && data.success && data.data) {
                // Check if it's a paginated response (data.data.data)
                if (data.data.data && Array.isArray(data.data.data)) {
                    setAllRestaurants(data.data.data);
                } else if (Array.isArray(data.data)) {
                    // Direct array response
                    setAllRestaurants(data.data);
                } else {
                    console.warn('Unexpected restaurant data structure:', data);
                    setAllRestaurants([]);
                }
            } else {
                console.warn('Unexpected restaurant data structure:', data);
                setAllRestaurants([]);
            }
        } catch (error) {
            console.error('Failed to fetch restaurants:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies - only fetch once

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    // Handle search, sort, and filter on the frontend
    const restaurants = useMemo(() => {
        if (!allRestaurants || !Array.isArray(allRestaurants) || allRestaurants.length === 0) return [];
        
        let filtered = [...allRestaurants];

        // Apply search filter
        if (params.search) {
            const searchTerm = params.search.toLowerCase();
            filtered = filtered.filter(restaurant => 
                restaurant.name.toLowerCase().includes(searchTerm) ||
                restaurant.location.toLowerCase().includes(searchTerm) ||
                restaurant.cuisine.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sorting
        if (params.sort) {
            filtered.sort((a, b) => {
                let aValue, bValue;
                
                switch (params.sort) {
                    case 'name':
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                        break;
                    case 'location':
                        aValue = a.location.toLowerCase();
                        bValue = b.location.toLowerCase();
                        break;
                    case 'cuisine':
                        aValue = a.cuisine.toLowerCase();
                        bValue = b.cuisine.toLowerCase();
                        break;
                    case 'created_at':
                        aValue = new Date(a.created_at);
                        bValue = new Date(b.created_at);
                        break;
                    default:
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                }

                if (params.dir === 'desc') {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                } else {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                }
            });
        }

        return filtered;
    }, [allRestaurants, params.search, params.sort, params.dir]);

    const refetch = useCallback(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    return {
        restaurants,
        loading,
        error,
        refetch
    };
};