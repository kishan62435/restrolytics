import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { analyticsService } from "@/api/services/analyticsService";

export const useAnalytics = (analyticsParams = {}, topRestaurantsParams = {}) => {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [topRestaurantsData, setTopRestaurantsData] = useState([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [topRestaurantsLoading, setTopRestaurantsLoading] = useState(false);
    const [error, setError] = useState(null);
    const lastAnalyticsParamsRef = useRef(null);
    const lastTopRestaurantsParamsRef = useRef(null);
    const isInitialMount = useRef(true);

    // Fetch analytics data
    const fetchAnalytics = useCallback(async () => {
        // Safety check - don't fetch if params are null or empty
        if (!analyticsParams || Object.keys(analyticsParams).length === 0) {
            setAnalyticsLoading(false);
            return;
        }
        
        // Prevent duplicate fetches with same params
        if (lastAnalyticsParamsRef.current && 
            JSON.stringify(analyticsParams) === JSON.stringify(lastAnalyticsParamsRef.current)) {
            setAnalyticsLoading(false);
            return;
        }

        try {
            setAnalyticsLoading(true);
            setError(null);

            const response = await analyticsService.getRestaurantTrends(analyticsParams);
            
            if (response && response.success && response.data && Array.isArray(response.data)) {
                setAnalyticsData(response.data);
            } else if (Array.isArray(response)) {
                setAnalyticsData(response);
            } else {
                console.warn('Unexpected analytics data structure:', response);
                setAnalyticsData([]);
            }
            
            lastAnalyticsParamsRef.current = analyticsParams;
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            setError(error.message);
        } finally {
            setAnalyticsLoading(false);
        }
    }, [analyticsParams]);

    // Fetch top restaurants data
    const fetchTopRestaurants = useCallback(async () => {
        // Safety check - don't fetch if params are null
        if (!topRestaurantsParams) {
            setTopRestaurantsLoading(false);
            return;
        }
        
        // Allow empty params object for initial fetch
        
        // Prevent duplicate fetches with same params
        if (lastTopRestaurantsParamsRef.current && 
            JSON.stringify(topRestaurantsParams) === JSON.stringify(lastTopRestaurantsParamsRef.current)) {
            setTopRestaurantsLoading(false);
            return;
        }
        
        try {
            setTopRestaurantsLoading(true);
            setError(null);
            
            const response = await analyticsService.getTopRestaurants(topRestaurantsParams);
            
            if (response && response.success && response.data && Array.isArray(response.data)) {
                setTopRestaurantsData(response.data);
            } else if (Array.isArray(response)) {
                setTopRestaurantsData(response);
            } else {
                console.warn('Unexpected top restaurants data structure:', response);
                setTopRestaurantsData([]);
            }
            
            lastTopRestaurantsParamsRef.current = topRestaurantsParams;
        } catch (error) {
            console.error('Error fetching top restaurants:', error);
            setError(error.message);
        } finally {
            setTopRestaurantsLoading(false);
        }
    }, [topRestaurantsParams]);

    // Check if analytics should be fetched - REMOVED loading dependency to break circular loop
    const shouldFetchAnalytics = useMemo(() => {
        // Always fetch on initial mount, even with empty params
        if (isInitialMount.current) {
            return true;
        }
        
        // Don't fetch if params are null
        if (!analyticsParams) {
            return false;
        }
        
        // Fetch if no last params
        if (!lastAnalyticsParamsRef.current) {
            return true;
        }
        
        const changed = JSON.stringify(analyticsParams) !== JSON.stringify(lastAnalyticsParamsRef.current);
        return changed;
    }, [analyticsParams]); // Removed analyticsLoading dependency

    // Check if top restaurants should be fetched - REMOVED loading dependency to break circular loop
    const shouldFetchTopRestaurants = useMemo(() => {
        // Always fetch on initial mount, even with empty params
        if (isInitialMount.current) {
            return true;
        }
        
        // Don't fetch if params are null
        if (!topRestaurantsParams) {
            return false;
        }
        
        // Fetch if no last params
        if (!lastTopRestaurantsParamsRef.current) {
            return true;
        }
        
        const changed = JSON.stringify(topRestaurantsParams) !== JSON.stringify(lastTopRestaurantsParamsRef.current);
        return changed;
    }, [topRestaurantsParams]); // Removed topRestaurantsLoading dependency

    // Fetch data when params change
    useEffect(() => {
        if (shouldFetchAnalytics && !analyticsLoading) {
            fetchAnalytics();
        }
    }, [shouldFetchAnalytics, fetchAnalytics, analyticsLoading]);

    useEffect(() => {
        if (shouldFetchTopRestaurants && !topRestaurantsLoading) {
            fetchTopRestaurants();
        }
    }, [shouldFetchTopRestaurants, fetchTopRestaurants, topRestaurantsLoading]);

    // Set initial mount to false after first render
    useEffect(() => {
        isInitialMount.current = false;
    }, []);

    // Memoized computed values for common analytics
    const computedAnalytics = useMemo(() => {
        if (!analyticsData || analyticsData.length === 0) {
            return {
                totalRestaurants: 0,
                totalOrders: 0,
                totalRevenue: 0,
                averageOrderValue: 0,
                topPerformingRestaurants: [],
                trendsByRestaurant: {}
            };
        }

        let totalOrders = 0;
        let totalRevenue = 0;
        const trendsByRestaurant = {};

        analyticsData.forEach(restaurantData => {
            const { restaurant_id, restaurant_name, trends } = restaurantData;
            
            if (trends && trends.daily && Array.isArray(trends.daily)) {
                // Calculate summary metrics from daily trends
                let restaurantOrders = 0;
                let restaurantRevenue = 0;
                
                trends.daily.forEach(dayData => {
                    // Ensure we have valid numbers with safety checks
                    const dayOrders = parseInt(dayData.count) || 0;
                    const dayRevenue = parseFloat(dayData.amount_sum) || 0;
                    
                    restaurantOrders += dayOrders;
                    restaurantRevenue += dayRevenue;
                });
                
                totalOrders += restaurantOrders;
                totalRevenue += restaurantRevenue;

                trendsByRestaurant[restaurant_id] = {
                    name: restaurant_name,
                    total_orders: restaurantOrders,
                    total_revenue: restaurantRevenue,
                    average_order_value: restaurantOrders > 0 ? restaurantRevenue / restaurantOrders : 0,
                    daily: trends.daily,
                    hourly: trends.hourly || []
                };
            }
        });

        // Use top restaurants data from API instead of calculating
        const topPerformingRestaurants = topRestaurantsData.map(restaurant => {
            // Ensure we have valid numbers with safety checks
            const orders = parseInt(restaurant.orders_count) || 0;
            const revenue = parseFloat(restaurant.orders_sum_order_amount) || 0;
            const aov = orders > 0 ? revenue / orders : 0;
            
            return {
                id: restaurant.id,
                name: restaurant.name,
                orders: orders,
                revenue: revenue,
                aov: aov
            };
        });

        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            totalRestaurants: analyticsData.length, // This now shows selected restaurants count
            totalOrders,
            totalRevenue,
            averageOrderValue,
            topPerformingRestaurants,
            trendsByRestaurant
        };
    }, [analyticsData, topRestaurantsData]);

    const refetch = useCallback(() => {
        // Reset the refs to force a fresh fetch
        lastAnalyticsParamsRef.current = null;
        lastTopRestaurantsParamsRef.current = null;
        isInitialMount.current = true;
        
        // Trigger both fetches
        fetchAnalytics();
        fetchTopRestaurants();
    }, [fetchAnalytics, fetchTopRestaurants]);

    // Combined loading state for backward compatibility
    const loading = analyticsLoading || topRestaurantsLoading;

    return {
        analyticsData,
        topRestaurantsData,
        computedAnalytics,
        loading,
        analyticsLoading,
        topRestaurantsLoading,
        error,
        refetch
    };
};
