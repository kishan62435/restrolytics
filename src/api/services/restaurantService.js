import { API_CONFIG } from "../config";
import axios from "axios";

class RestaurantService {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    async getRestaurants(params = {}) {
        try {
            const backendParams = {};
            
            // Handle pagination for large datasets
            if (params.per_page) {
                backendParams.per_page = params.per_page;
            } else {
                backendParams.per_page = 100; // Get more restaurants for dashboard
            }

            const queryString = new URLSearchParams(backendParams).toString();
            const url = `${this.baseURL}/restaurants?${queryString}`;
            
            // console.log('Restaurant API Request URL:', url);

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // console.log('Restaurant API Response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            if (error.response) {
                throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else if (error.request) {
                throw new Error('No response received from server');
            } else {
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }
}

export const restaurantService = new RestaurantService();