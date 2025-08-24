'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Building2,
    DollarSign,
    Clock,
    ChevronDown,
    X
} from "lucide-react";
import { 
    DEFAULT_FILTERS, 
    FILTER_OPTIONS, 
    isDefaultFilter 
} from "@/lib/filterMappings";

export default function FilterBar({
    title = "Filters",
    restaurants = [],
    loading = false,
    onFiltersChange,
    activeFilters = {},
    selectedRestaurantNames = [],
    onRestaurantIdsChange,
    hiddenFilters = []
}) {
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);
    const [isAmountOpen, setIsAmountOpen] = useState(false);
    const [isHourOpen, setIsHourOpen] = useState(false);
    const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
    const [customFromDate, setCustomFromDate] = useState('');
    const [customToDate, setCustomToDate] = useState('');
    
    // Use the passed selectedRestaurantNames
    const selectedRestaurants = selectedRestaurantNames;

    const handleRestaurantToggle = (restaurantName) => {
        let newSelection;
        
        if (selectedRestaurants.includes(restaurantName)) {
            // Remove restaurant
            newSelection = selectedRestaurants.filter(name => name !== restaurantName);
            } else {
            // Add restaurant
            newSelection = [...selectedRestaurants, restaurantName];
            }

        // Update parent state
        if (newSelection.length === 0) {
            onFiltersChange({ ...activeFilters, restaurant: "All Restaurants" });
            if (onRestaurantIdsChange) {
                onRestaurantIdsChange([], []);
            }
        } else if (newSelection.length === 1) {
            onFiltersChange({ ...activeFilters, restaurant: newSelection[0] });
            if (onRestaurantIdsChange) {
                const restaurant = restaurants.find(r => r.name === newSelection[0]);
                onRestaurantIdsChange(restaurant ? [restaurant.id] : [], newSelection);
            }
        } else {
            // For multiple restaurants, we'll use a special format
            onFiltersChange({ ...activeFilters, restaurant: `Multiple (${newSelection.length})` });
            if (onRestaurantIdsChange) {
                const restaurantIds = newSelection
                    .map(name => restaurants.find(r => r.name === name))
                    .filter(r => r)
                    .map(r => r.id);
                onRestaurantIdsChange(restaurantIds, newSelection);
            }
        }
        };

    // Use activeFilters from parent instead of local state
    const filters = activeFilters;

    
    // The parent component already initializes with DEFAULT_FILTERS

    const dateOptions = FILTER_OPTIONS.dateRange;
    const amountOptions = FILTER_OPTIONS.amountRange;
    const hourOptions = FILTER_OPTIONS.hourRange;

    const restaurantOptions = useMemo(() => {
        const options = ["All Restaurants"];
        if (restaurants && restaurants.length > 0) {
            restaurants.forEach(restaurant => {
                options.push(restaurant.name);
            });
        }
        return options;
    }, [restaurants])

    const handleFilterChange = (filterType, value) => {
        // console.log('Filter change:', filterType, value, 'Current filters:', filters);
        
        // If custom range is selected, don't update filters yet - wait for user to select dates
        if (filterType === 'dateRange' && value === 'Custom range') {
            setIsCustomDateOpen(true);
            setIsDateOpen(false);
            return; // Don't call onFiltersChange yet
        }
        
        const newFilters = { ...filters, [filterType]: value };
        // console.log('New filters:', newFilters);
        onFiltersChange(newFilters);
    };

    const handleCustomDateApply = () => {
        if (customFromDate && customToDate) {
            const newFilters = { 
                ...filters, 
                dateRange: `${formatDateForDisplay(customFromDate)} to ${formatDateForDisplay(customToDate)}`,
                customFromDate: customFromDate,
                customToDate: customToDate
            };
            onFiltersChange(newFilters);
            setIsCustomDateOpen(false);
        }
    };

    const handleCustomDateCancel = () => {
        setIsCustomDateOpen(false);
        setCustomFromDate('');
        setCustomToDate('');
        // Don't reset filters here - just close the modal
        // The user can manually select a different date range if needed
    };

    const handleReset = () => {
        onFiltersChange(DEFAULT_FILTERS);
        setCustomFromDate('');
        setCustomToDate('');
    };

    const handleApply = () => {
        onFiltersChange(filters);
    };

    // Generate calendar days for current month
    const generateCalendarDays = (month = new Date().getMonth(), year = new Date().getFullYear()) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        
        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const calendarDays = generateCalendarDays(currentMonthIndex, currentYear);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[currentMonthIndex];

    const navigateMonth = (direction) => {
        let newMonth = currentMonthIndex + direction;
        let newYear = currentYear;
        
        if (newMonth < 0) {
            newMonth = 11;
            newYear = currentYear - 1;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear = currentYear + 1;
        }
        
        setCurrentMonthIndex(newMonth);
        setCurrentYear(newYear);
    };

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
            </div>

            {/* Filters - Right Aligned with Wrapping */}
            <div className="flex flex-wrap items-center justify-end gap-3">
                {/* Date Range Dropdown */}
                <div className="relative">
                    <div
                        className={`flex items-center space-x-2 bg-background px-3 py-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                            isCustomDateOpen ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setIsDateOpen(!isDateOpen)}
                    >
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">{filters.dateRange}</span>
                        {!isDefaultFilter('dateRange', filters.dateRange) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newFilters = { ...filters, dateRange: DEFAULT_FILTERS.dateRange };
                                    onFiltersChange(newFilters);
                                    setCustomFromDate('');
                                    setCustomToDate('');
                                }}
                                className="ml-2 p-1 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                                title="Clear date filter"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                        <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    </div>

                    {isDateOpen && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-card border rounded-lg shadow-lg z-10 backdrop-blur-sm">
                            {dateOptions.map((option) => (
                                <div
                                    key={option}
                                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm text-foreground"
                                    onClick={() => {
                                        handleFilterChange('dateRange', option);
                                        if (option !== 'Custom range') {
                                            setIsDateOpen(false);
                                        }
                                    }}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Restaurant Selector Dropdown */}
                <div className="relative">
                    <div
                        className="flex items-center space-x-2 bg-background px-3 py-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
                    >
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {loading ? "loading..." : 
                                selectedRestaurants.length === 0 ? "All Restaurants" :
                                selectedRestaurants.length === 1 ? selectedRestaurants[0] :
                                `Multiple (${selectedRestaurants.length})`
                            }
                        </span>
                        {selectedRestaurants.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Clear restaurant selection
                                    if (onRestaurantIdsChange) {
                                        onRestaurantIdsChange([], []);
                                    }
                                    const newFilters = { ...filters, restaurant: DEFAULT_FILTERS.restaurant };
                                    onFiltersChange(newFilters);
                                }}
                                className="ml-2 p-1 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                                title="Clear restaurant filter"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                        <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    </div>

                    {isRestaurantOpen && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-card border rounded-lg shadow-lg z-10 backdrop-blur-sm max-h-60 overflow-y-auto">
                            {
                                loading ? (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">Loading restaurants...</div>
                                ) : (
                                    restaurantOptions.map((option) => (
                                        <div
                                            key={option}
                                            className="px-3 py-2 hover:bg-muted cursor-pointer text-sm text-foreground"
                                            onClick={() => {
                                                handleRestaurantToggle(option);
                                                setIsRestaurantOpen(false);
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRestaurants.includes(option)}
                                                onChange={() => {}} // No state update here, handled by useEffect
                                                className="mr-2"
                                            />
                                            {option}
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    )}
                </div>

                {/* Amount Filter Dropdown */}
                <div className="relative">
                    <div
                        className="flex items-center space-x-2 bg-background px-3 py-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setIsAmountOpen(!isAmountOpen)}
                    >
                        <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground whitespace-nowrap">{filters.amountRange || "Amount"}</span>
                        {filters.amountRange && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newFilters = { ...filters, amountRange: undefined };
                                    onFiltersChange(newFilters);
                                }}
                                className="ml-2 p-1 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                                title="Clear amount filter"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                        <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    </div>

                    {isAmountOpen && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-card border rounded-lg shadow-lg z-10 backdrop-blur-sm">
                            {amountOptions.map((option) => (
                                <div
                                    key={option}
                                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm text-foreground"
                                    onClick={() => {
                                        handleFilterChange('amountRange', option);
                                        setIsAmountOpen(false);
                                    }}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hour Filter Dropdown */}
                {!hiddenFilters.includes('hourRange') && (
                    <div className="relative">
                        <div
                            className="flex items-center space-x-2 bg-background px-3 py-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setIsHourOpen(!isHourOpen)}
                        >
                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground whitespace-nowrap">Hour</span>
                            <span className="text-sm text-foreground whitespace-nowrap">{filters.hourRange}</span>
                            {!isDefaultFilter('hourRange', filters.hourRange) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newFilters = { ...filters, hourRange: DEFAULT_FILTERS.hourRange };
                                        onFiltersChange(newFilters);
                                    }}
                                    className="ml-2 p-1 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                                    title="Clear hour filter"
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            )}
                            <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>

                        {isHourOpen && (
                            <div className="absolute top-full right-0 mt-1 w-48 bg-card border rounded-lg shadow-lg z-10 backdrop-blur-sm">
                                {hourOptions.map((option) => (
                                    <div
                                        key={option}
                                        className="px-3 py-2 hover:bg-muted cursor-pointer text-sm text-foreground"
                                        onClick={() => {
                                            handleFilterChange('hourRange', option);
                                            setIsHourOpen(false);
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset} className="text-sm py-2">Reset</Button>
                    <Button size="sm" onClick={handleApply} className="text-sm py-2">Apply</Button>
                </div>
            </div>

            {/* Custom Date Picker Modal */}
            {isCustomDateOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg p-4 sm:p-6 w-full max-w-sm sm:w-80 max-h-[90vh] overflow-y-auto border shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Select Date Range</h3>
                            <button
                                onClick={handleCustomDateCancel}
                                className="text-muted-foreground hover:text-foreground p-1"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Calendar View */}
                            <div className="border rounded-lg p-3 sm:p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <button
                                        onClick={() => navigateMonth(-1)}
                                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                                    >
                                        <ChevronDown className="h-4 w-4 rotate-90" />
                                    </button>
                                    <div className="flex flex-col items-center">
                                        <span className="text-base sm:text-lg font-semibold text-center">
                                            {currentMonth} {currentYear}
                                        </span>
                                        <button
                                            onClick={() => {
                                                const today = new Date();
                                                setCurrentMonthIndex(today.getMonth());
                                                setCurrentYear(today.getFullYear());
                                            }}
                                            className="text-xs text-primary hover:text-primary/80 underline"
                                        >
                                            Today
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => navigateMonth(1)}
                                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                                    >
                                        <ChevronDown className="h-4 w-4 -rotate-90" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-xs">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center text-muted-foreground p-1">
                                            {day}
                                        </div>
                                    ))}
                                    {calendarDays.map((day, index) => {
                                        if (day === null) return <div key={index} className="invisible" />;
                                        
                                        // Create date using local timezone to avoid timezone issues
                                        const currentDate = new Date(currentYear, currentMonthIndex, day);
                                        const dateString = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const today = new Date();
                                        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                        const isToday = dateString === todayString;
                                        const isFuture = dateString > todayString;
                                        const isSelected = dateString === customFromDate || dateString === customToDate;
                                        const isInRange = customFromDate && customToDate && 
                                            dateString >= customFromDate && dateString <= customToDate;
                                        const isStartDate = dateString === customFromDate;
                                        const isEndDate = dateString === customToDate;
                                        
                                        return (
                                            <div
                                                key={index}
                                                className={`text-center p-1 cursor-pointer rounded text-xs sm:text-sm transition-colors ${
                                                    isFuture 
                                                        ? 'text-muted-foreground cursor-not-allowed opacity-50' 
                                                        : isSelected 
                                                            ? 'bg-primary text-primary-foreground font-semibold' 
                                                            : isInRange 
                                                                ? 'bg-primary/20 text-primary' 
                                                                : isToday
                                                                    ? 'bg-muted font-semibold ring-2 ring-primary/30'
                                                                    : 'hover:bg-muted'
                                                } ${
                                                    isStartDate ? 'rounded-l-md' : ''
                                                } ${
                                                    isEndDate ? 'rounded-r-md' : ''
                                                }`}
                                                onClick={() => {
                                                    if (isFuture) return; // Prevent future date selection
                                                    
                                                    if (!customFromDate || (customFromDate && customToDate)) {
                                                        // First selection or reset selection
                                                        setCustomFromDate(dateString);
                                                        setCustomToDate('');
                                                    } else if (customFromDate && !customToDate) {
                                                        // Second selection
                                                        if (dateString >= customFromDate) {
                                                            setCustomToDate(dateString);
                                                        } else {
                                                            // If second date is before first date, swap them
                                                            setCustomToDate(customFromDate);
                                                            setCustomFromDate(dateString);
                                                        }
                                                    }
                                                }}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Selected Date Range Display */}
                            {(customFromDate || customToDate) && (
                                <div className="text-center p-3 bg-muted/30 rounded-lg">
                                    <div className="text-sm text-muted-foreground">Selected Range:</div>
                                    <div className="font-medium text-sm">
                                        {customFromDate ? formatDateForDisplay(customFromDate) : 'Start date'} 
                                        {customToDate ? ` - ${formatDateForDisplay(customToDate)}` : ''}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setCustomFromDate('');
                                            setCustomToDate('');
                                        }}
                                        className="text-xs text-muted-foreground hover:text-foreground underline mt-2"
                                    >
                                        Clear selection
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={handleCustomDateCancel}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCustomDateApply}
                                disabled={!customFromDate || !customToDate}
                                className="flex-1"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close dropdowns */}
            {(isDateOpen || isRestaurantOpen || isAmountOpen || (!hiddenFilters.includes('hourRange') && isHourOpen)) && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => {
                        setIsDateOpen(false);
                        setIsRestaurantOpen(false);
                        setIsAmountOpen(false);
                        setIsHourOpen(false);
                    }}
                />
            )}

            {/* Click outside to close custom date picker */}
            {isCustomDateOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={handleCustomDateCancel}
                />
            )}
        </div>
    );
}
