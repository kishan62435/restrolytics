import { API_CONFIG } from "../config";
import { mapDateRangeToAPI, mapAmountRangeToValues, mapHourRangeToValues } from "@/lib/filterMappings";
import axios from "axios";

class AnalyticsService {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    async getRestaurantTrends(params = {}) {
        try {
            
            if (!params) {
                console.warn('getRestaurantTrends called with null/undefined params, using empty object');
                params = {};
            }
            
            const requestBody = {};
            
            // Handle restaurant IDs
            if (params.restaurant_ids && params.restaurant_ids.length > 0) {
                requestBody.restaurant_ids = params.restaurant_ids;
            }
            
            // Handle date range for main analytics
            const dateParams = mapDateRangeToAPI(params.dateRange, params.customFromDate, params.customToDate);
            if (dateParams.from) requestBody.from = dateParams.from;
            if (dateParams.to) requestBody.to = dateParams.to;
            
            // Handle amount range
            if (params.amountRange) {
                const amountValues = mapAmountRangeToValues(params.amountRange);
                if (amountValues && amountValues.min !== undefined && amountValues.min !== null) requestBody.minA = amountValues.min;
                if (amountValues && amountValues.max !== undefined && amountValues.max !== null) requestBody.maxA = amountValues.max;
            }
            
            // Handle hour range
            if (params.hourRange && params.hourRange !== "0-23") {
                const hourValues = mapHourRangeToValues(params.hourRange);
                if (hourValues.min !== undefined) requestBody.hFrom = hourValues.min;
                if (hourValues.max !== undefined) requestBody.hTo = hourValues.max;
            }

            const url = `${this.baseURL}/analytics/restaurant-trends`;
            
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching restaurant trends:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                throw new Error('No response received from server');
            } else {
                console.error('Request setup error:', error.message);
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    async getTopRestaurants(params = {}) {
        try {
            
            if (!params) {
                console.warn('getTopRestaurants called with null/undefined params, using empty object');
                params = {};
            }
            
            const requestBody = {};
            
            // Per page limit
            requestBody.limit = 20;
            
            // restaurant IDs for top restaurants
            if (params.restaurant_ids && params.restaurant_ids.length > 0) {
                requestBody.restaurant_ids = params.restaurant_ids;
            }
            
            // date range for top restaurants
            if (params.dateRange && params.dateRange !== "Date range") {
                const dateParams = mapDateRangeToAPI(params.dateRange, params.customFromDate, params.customToDate);
                if (dateParams.from) requestBody.from = dateParams.from;
                if (dateParams.to) requestBody.to = dateParams.to;
            }
            
            // amount range for top restaurants
            if (params.amountRange) {
                const amountValues = mapAmountRangeToValues(params.amountRange);
                if (amountValues && amountValues.min !== undefined && amountValues.min !== null) requestBody.minA = amountValues.min;
                if (amountValues && amountValues.max !== undefined && amountValues.max !== null) requestBody.maxA = amountValues.max;
            }

            const url = `${this.baseURL}/analytics/top-restaurants`;
            
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching top restaurants:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                throw new Error('No response received from server');
            } else {
                console.error('Request setup error:', error.message);
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    async getOrdersList(params) {
        try {
            const requestBody = {};
            
            // single restaurant ID
            if (params.restaurant_id) {
                requestBody.restaurant_id = params.restaurant_id;
            }
            
            // date range
            if (params.dateRange && params.dateRange !== "Date range") {
                const dateParams = mapDateRangeToAPI(params.dateRange, params.customFromDate, params.customToDate);
                if (dateParams.from) requestBody.from = dateParams.from;
                if (dateParams.to) requestBody.to = dateParams.to;
            }
            
            // amount range
            if (params.amountRange) {
                const amountValues = mapAmountRangeToValues(params.amountRange);
                if (amountValues && amountValues.min !== undefined && amountValues.min !== null) requestBody.minA = amountValues.min;
                if (amountValues && amountValues.max !== undefined && amountValues.max !== null) requestBody.maxA = amountValues.max;
            }
            
            // hour range
            if (params.hourRange && params.hourRange !== "0-23") {
                const hourValues = mapHourRangeToValues(params.hourRange);
                if (hourValues.min !== undefined) requestBody.hFrom = hourValues.min;
                if (hourValues.max !== undefined) requestBody.hTo = hourValues.max;
            }
            
            // pagination
            if (params.page) requestBody.page = params.page;
            if (params.per_page) requestBody.per_page = params.per_page;
            
            // sorting
            if (params.sortBy) requestBody.sort_by = params.sortBy;
            if (params.sortDirection) requestBody.sort_dir = params.sortDirection;

            const url = `${this.baseURL}/orders`;
            
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('Error fetching orders list:', error);
            throw error;
        }
    }
}

export const analyticsService = new AnalyticsService();
