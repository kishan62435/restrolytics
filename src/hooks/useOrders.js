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
    const currentPageRef = useRef(1);
    const itemsPerPageRef = useRef(10);
    const shouldFetchAfterPageResetRef = useRef(false);
    const lastFetchSignatureRef = useRef(null);

    // Fetch orders data
    const fetchOrders = useCallback(async (page, perPage, force = false) => {
        
        if (!ordersParams || !ordersParams.restaurant_id) {
            setOrdersLoading(false);
            return;
        }

        try {
            setOrdersLoading(true);
            setError(null);
            
            const resolvedPage = page ?? currentPageRef.current;
            const resolvedPerPage = (perPage ?? itemsPerPageRef.current) === 'all' ? 1000 : (perPage ?? itemsPerPageRef.current);

            const apiParams = {
                ...ordersParams,
                page: resolvedPage,
                per_page: resolvedPerPage
            };

            const signature = JSON.stringify(apiParams);
            if (!force && signature === lastFetchSignatureRef.current) {
                setOrdersLoading(false);
                return;
            }
            lastFetchSignatureRef.current = signature;
            
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
    }, [ordersParams]);

    // params change (initial load and filter changes)
    useEffect(() => {
        if (!ordersParams || !ordersParams.restaurant_id) return;

        if (currentPageRef.current !== 1) {
            shouldFetchAfterPageResetRef.current = true;
            setCurrentPage(1);
            return;
        }

        fetchOrders(1, itemsPerPageRef.current);
    }, [ordersParams, fetchOrders]);

    // page or items per page change
    useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

    useEffect(() => {
        itemsPerPageRef.current = itemsPerPage;
    }, [itemsPerPage]);

    useEffect(() => {
        if (isInitialMount.current) return;

        // Fetch for pagination changes or when params effect requested fetch after reset
        fetchOrders(currentPage, itemsPerPage);
        // Clear the flag if it was set
        if (shouldFetchAfterPageResetRef.current) {
            shouldFetchAfterPageResetRef.current = false;
        }
    }, [currentPage, itemsPerPage, fetchOrders]);

    // Set initial mount to false after first render
    useEffect(() => {
        isInitialMount.current = false;
    }, []);

    // (removed) Reset to first page is now handled in params-change effect above

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
        fetchOrders(currentPage, itemsPerPage, true);
    }, [fetchOrders, currentPage, itemsPerPage]);

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
