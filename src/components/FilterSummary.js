import { hasActiveFilters } from "@/lib/filterMappings";

export default function FilterSummary({ analyticsParams, activeFilters, selectedRestaurantIds }) {
    if (!analyticsParams || !hasActiveFilters(activeFilters)) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-6">
            <div className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-slate-700">Active Filters:</span>
                        {activeFilters.dateRange !== "Date range" && (
                            <span className="filter-tag bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700">
                                {activeFilters.dateRange}
                            </span>
                        )}
                        {activeFilters.amountRange && (
                            <span className="filter-tag">
                                {activeFilters.amountRange}
                            </span>
                        )}
                        {activeFilters.hourRange !== "0-23" && (
                            <span className="filter-tag bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700">
                                {activeFilters.hourRange}
                            </span>
                        )}
                        {selectedRestaurantIds.length > 0 && (
                            <span className="filter-tag">
                                {selectedRestaurantIds.length} Restaurant{selectedRestaurantIds.length > 1 ? 's' : ''} Selected
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
