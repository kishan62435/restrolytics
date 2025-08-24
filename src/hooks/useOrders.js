import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { analyticsService } from '@/api/services/analyticsService';

export const useOrders = (params, ordersParams) => {
    const [ordersData, setOrdersData] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const lastOrdersParamsRef = useRef(null);
    const isInitialMount = useRef(true);

    // Fetch orders data
    const fetchOrders = useCallback(async (page = currentPage, perPage = itemsPerPage) => {
        
        if (!ordersParams || !ordersParams.restaurant_id) {
            setOrdersLoading(false);
            return;
        }

        try {
            setOrdersLoading(true);
            setError(null);
            
            const apiParams = {
                ...ordersParams,
                page: page,
                per_page: perPage === 'all' ? 1000 : perPage
            };
            
            // console.log('Fetching orders with params:', apiParams);
            
            const response = await analyticsService.getOrdersList(apiParams);
            
            // console.log('Orders API response:', response);
            
            if (response && response.success && response.data && Array.isArray(response.data)) {
                setOrdersData(response.data);
                setTotalOrders(response.pagination?.total || response.data.length);
                
                // Calculate total pages properly
                if (response.pagination?.total_pages) {
                    setTotalPages(response.pagination.total_pages);
                } else if (response.pagination?.total) {
                    const total = response.pagination.total;
                    const calculatedPerPage = perPage === 'all' ? total : perPage;
                    setTotalPages(Math.ceil(total / calculatedPerPage));
                } else {
                    setTotalPages(1);
                }
                
                // console.log('Orders data set:', {
                //     dataLength: response.data.length,
                //     totalOrders: response.pagination?.total || response.data.length,
                //     totalPages: response.pagination?.total_pages || Math.ceil((response.pagination?.total || response.data.length) / (perPage === 'all' ? response.data.length : perPage))
                // });
            } else if (Array.isArray(response)) {
                setOrdersData(response);
                setTotalOrders(response.length);
                const calculatedPerPage = perPage === 'all' ? response.length : perPage;
                setTotalPages(Math.ceil(response.length / calculatedPerPage));
                
                // console.log('Orders data set (array response):', {
                //     dataLength: response.length,
                //     totalOrders: response.length,
                //     totalPages: Math.ceil(response.length / calculatedPerPage)
                // });
            } else {
                // console.warn('Unexpected orders data structure:', response);
                // setOrdersData([]);
                // setTotalOrders(0);
                // setTotalPages(0);
            }
            
            lastOrdersParamsRef.current = ordersParams;
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.message);
        } finally {
            setOrdersLoading(false);
        }
    }, [ordersParams, currentPage, itemsPerPage]);

    // params change (initial load and filter changes)
    useEffect(() => {
        if (ordersParams && ordersParams.restaurant_id) {
            // console.log('Initial fetch or params changed, fetching orders');
            fetchOrders();
        }
    }, [ordersParams?.restaurant_id, ordersParams?.dateRange, ordersParams?.amountRange, ordersParams?.hourRange, fetchOrders, ordersParams]);

    // page or items per page change
    useEffect(() => {
        if (ordersParams && ordersParams.restaurant_id && !ordersLoading && !isInitialMount.current) {
            // console.log('Page/items per page changed, fetching orders:', { currentPage, itemsPerPage });
            fetchOrders(currentPage, itemsPerPage);
        }
    }, [currentPage, itemsPerPage, fetchOrders, ordersParams, ordersLoading]);

    // Set initial mount to false after first render
    useEffect(() => {
        isInitialMount.current = false;
    }, []);

    // Reset to first page on filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [ordersParams?.restaurant_id, ordersParams?.dateRange, ordersParams?.amountRange, ordersParams?.hourRange]);

    // Handle page change
    const handlePageChange = (page) => {
        // console.log('Page change requested:', { from: currentPage, to: page });
        setCurrentPage(page);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (value) => {
        const newItemsPerPage = value === 'all' ? 'all' : parseInt(value);
        // console.log('Items per page change:', { from: itemsPerPage, to: newItemsPerPage });
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
    };

    // Refetch orders
    const refetch = useCallback(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        ordersData,
        ordersLoading,
        error,
        currentPage,
        itemsPerPage,
        totalOrders,
        totalPages,
        handlePageChange,
        handleItemsPerPageChange,
        refetch
    };
};
