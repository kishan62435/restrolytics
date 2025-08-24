
export const DATE_RANGE_MAPPINGS = {
    "Today": { 
        from: () => new Date().toISOString().split('T')[0], 
        to: () => new Date().toISOString().split('T')[0] 
    },
    "Last 7 days": { 
        from: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        to: () => new Date().toISOString().split('T')[0] 
    },
    "Last 30 days": { 
        from: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        to: () => new Date().toISOString().split('T')[0] 
    },
    "Last 3 months": { 
        from: () => new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        to: () => new Date().toISOString().split('T')[0] 
    },
    "Last 6 months": { 
        from: () => new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        to: () => new Date().toISOString().split('T')[0] 
    },
    "Last year": { 
        from: () => new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        to: () => new Date().toISOString().split('T')[0] 
    }
};

export const AMOUNT_RANGE_MAPPINGS = {
    "₹100-₹200": { min: 100, max: 200, label: "₹100-₹200" },
    "₹200-₹500": { min: 200, max: 500, label: "₹200-₹500" },
    "₹500-₹700": { min: 500, max: 700, label: "₹500-₹700" },
    "₹700-₹1k": { min: 700, max: 1000, label: "₹700-₹1k" }
};

export const HOUR_RANGE_MAPPINGS = {
    "0-23": { min: "00:00", max: "23:59", label: "0-23 (All day)" },
    "6-10 (Breakfast)": { min: "06:00", max: "10:00", label: "6-10 (Breakfast)" },
    "10-15 (Lunch)": { min: "10:00", max: "15:00", label: "10-15 (Lunch)" },
    "15-19 (Dinner)": { min: "15:00", max: "19:00", label: "15-19 (Dinner)" },
    "19-23 (Late Night)": { min: "19:00", max: "23:00", label: "19-23 (Late Night)" },
    "0-6 (Night)": { min: "00:00", max: "06:00", label: "0-6 (Night)" },
    "6-12 (Morning)": { min: "06:00", max: "12:00", label: "6-12 (Morning)" },
    "12-18 (Afternoon)": { min: "12:00", max: "18:00", label: "12-18 (Afternoon)" },
    "18-24 (Evening)": { min: "18:00", max: "23:59", label: "18-24 (Evening)" }
};

export const DEFAULT_FILTERS = {
    dateRange: "Date range",
    restaurant: "All Restaurants",
    amountRange: undefined,
    hourRange: "0-23"
};

export const FILTER_OPTIONS = {
    dateRange: [
        "Today",
        "Last 7 days",
        "Last 30 days",
        "Last 3 months",
        "Last 6 months",
        "Last year",
        "Custom range"
    ],
    amountRange: [
        "₹100-₹200",
        "₹200-₹500",
        "₹500-₹700",
        "₹700-₹1k",
    ],
    hourRange: [
        "6-10 (Breakfast)",
        "10-15 (Lunch)",
        "15-19 (Dinner)",
        "19-23 (Late Night)",
        "0-6 (Night)",
        "6-12 (Morning)",
        "12-18 (Afternoon)",
        "18-24 (Evening)",
        "0-23"
    ]
};

export const mapDateRangeToAPI = (dateRange, customFromDate = null, customToDate = null) => {
    if (!dateRange || dateRange === "Date range") {
        return {};
    }

    // Handle custom date range
    if (customFromDate && customToDate) {
        return {
            from: customFromDate,
            to: customToDate
        };
    }

    // Handle predefined date ranges
    if (DATE_RANGE_MAPPINGS[dateRange]) {
        const mapping = DATE_RANGE_MAPPINGS[dateRange];
        return {
            from: mapping.from(),
            to: mapping.to()
        };
    }

    return {};
};

export const mapAmountRangeToValues = (amountRange) => {
    if (!amountRange || !AMOUNT_RANGE_MAPPINGS[amountRange]) {
        return null;
    }
    return AMOUNT_RANGE_MAPPINGS[amountRange];
};

export const mapHourRangeToValues = (hourRange) => {
    if (!hourRange || !HOUR_RANGE_MAPPINGS[hourRange]) {
        return { min: "00:00", max: "23:59" };
    }
    return HOUR_RANGE_MAPPINGS[hourRange];
};

// Apply amount filtering to restaurant data
export const filterRestaurantsByAmount = (restaurants, amountRange) => {
    if (!amountRange) {
        return restaurants;
    }

    const mapping = mapAmountRangeToValues(amountRange);
    if (!mapping) return restaurants;

    return restaurants.filter(restaurant => {
        const orderAmount = restaurant.orders_sum_order_amount || 0;
        if (mapping.max === null) {
            return orderAmount >= mapping.min;
        }
        return orderAmount >= mapping.min && orderAmount <= mapping.max;
    });
};

export const filterRestaurantsByHour = (restaurants, hourRange) => {
    if (!hourRange || hourRange === "0-23") {
        return restaurants;
    }

    const mapping = mapHourRangeToValues(hourRange);
    if (!mapping) return restaurants;

    // Note: This would need hour data from the API to work properly
    // For now, we'll skip hour filtering until the backend supports it
    // console.log('Hour filtering not yet implemented - needs backend support');
    return restaurants;
};

// Check if filters are at default values
export const isDefaultFilter = (filterType, value) => {
    return value === DEFAULT_FILTERS[filterType];
};

// Get all non-default filters
export const getNonDefaultFilters = (filters) => {
    return Object.entries(filters).filter(([key, value]) => !isDefaultFilter(key, value));
};

// Check if any filters are active (non-default)
export const hasActiveFilters = (filters) => {
    return Object.values(filters).some(value => 
        !Object.values(DEFAULT_FILTERS).includes(value)
    );
};
