import { Building2, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default function KeyMetricsCards({ analyticsParams, computedAnalytics }) {
    if (!analyticsParams) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <div className="text-lg">No analytics data available</div>
                <div className="text-sm mt-2">Select restaurants or apply filters to view analytics</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="metric-card">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-600">Total Restaurants</p>
                        <p className="text-2xl font-bold text-enterprise-primary">{computedAnalytics.totalRestaurants}</p>
                    </div>
                </div>
            </div>

            <div className="metric-card">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-600">Total Orders</p>
                        <p className="text-2xl font-bold text-enterprise-primary">{computedAnalytics.totalOrders}</p>
                    </div>
                </div>
            </div>

            <div className="metric-card">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-enterprise-primary">₹{computedAnalytics.totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="metric-card">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-600">Average Order Value</p>
                        <p className="text-2xl font-bold text-enterprise-primary">₹{computedAnalytics.averageOrderValue.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
