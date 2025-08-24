// import { Building2, ShoppingCart, DollarSign } from "lucide-react";

export default function DashboardHeader({
    analyticsLoading,
    topRestaurantsLoading,
    analyticsParams,
    computedAnalytics
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {(analyticsLoading || topRestaurantsLoading) && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating data...</span>
                    </div>
                )}
                <div className="text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border">
                    {analyticsParams ? (
                        `${computedAnalytics.totalRestaurants} Restaurants • ${computedAnalytics.totalOrders} Orders • ₹${computedAnalytics.totalRevenue.toFixed(2)} Revenue`
                    ) : (
                        "Select restaurants or apply filters to view analytics"
                    )}
                </div>
            </div>
        </div>
    );
}
