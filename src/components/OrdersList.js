import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";

export default function OrdersList({ 
    analyticsParams, 
    selectedRestaurant, 
    computedAnalytics,
    ordersData,
    ordersLoading,
    ordersError,
    ordersTotalCount,
    ordersTotalPages,
    ordersCurrentPage,
    ordersItemsPerPage,
    handleOrdersPageChange,
    handleOrdersItemsPerPageChange,
    refetchOrders
}) {
    
    if (!selectedRestaurant) {
        return null;
    }

    if (!analyticsParams) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Orders List - {selectedRestaurant?.name || 'All Restaurants'}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    {selectedRestaurant 
                        ? `Orders for ${selectedRestaurant.name} based on current filters`
                        : 'All orders based on current filters'
                    }
                </p>
            </CardHeader>
            <CardContent>
                {/* Orders Summary */}
                <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-lg font-semibold text-primary">
                                {ordersTotalCount || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Orders</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-primary">
                                ₹{(computedAnalytics.totalRevenue || 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Revenue</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-primary">
                                ₹{(computedAnalytics.averageOrderValue || 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">Average Order Value</div>
                        </div>
                    </div>
                </div>

                {/* Orders Controls */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                        {ordersTotalCount || 0} order{(ordersTotalCount || 0) !== 1 ? 's' : ''} found
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Orders per page:</span>
                        <Select value={ordersItemsPerPage.toString()} onValueChange={handleOrdersItemsPerPageChange}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder={ordersItemsPerPage === 'all' ? 'All' : ordersItemsPerPage.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Loading State */}
                {ordersLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Error State */}
                {ordersError && (
                    <div className="text-center py-8 text-destructive">
                        <p>Error loading orders: {ordersError}</p>
                        <Button onClick={refetchOrders} className="mt-2">
                            Retry
                        </Button>
                    </div>
                )}

                {/* Orders Table */}
                {!ordersLoading && !ordersError && ordersData && ordersData.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-semibold text-sm">Order ID</th>
                                        <th className="text-left p-3 font-semibold text-sm">Date & Time</th>
                                        <th className="text-right p-3 font-semibold text-sm">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersData.map((order) => (
                                        <tr key={order.id} className="border-b hover:bg-muted/30">
                                            <td className="p-3">
                                                <span className="font-mono text-sm font-medium">
                                                    #{order.id || order.order_id || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-muted-foreground">
                                                {order.order_date || order.created_at 
                                                    ? (() => {
                                                        const date = new Date(order.order_date || order.created_at);
                                                        const day = date.getDate();
                                                        const month = date.toLocaleDateString('en-US', { month: 'short' });
                                                        const year = date.getFullYear();
                                                        
                                                        // Add ordinal suffix to day
                                                        const getOrdinalSuffix = (day) => {
                                                            if (day > 3 && day < 21) return 'th';
                                                            switch (day % 10) {
                                                                case 1: return 'st';
                                                                case 2: return 'nd';
                                                                case 3: return 'rd';
                                                                default: return 'th';
                                                            }
                                                        };
                                                        
                                                        return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
                                                    })()
                                                    : 'N/A'
                                                }
                                            </td>
                                            <td className="p-3 text-right text-sm font-medium text-primary">
                                                ₹{parseFloat(order.order_amount || order.amount || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Orders Pagination */}
                        {ordersTotalCount > 0 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((ordersCurrentPage - 1) * (ordersItemsPerPage === 'all' ? ordersData.length : ordersItemsPerPage)) + 1} to {Math.min(ordersCurrentPage * (ordersItemsPerPage === 'all' ? ordersData.length : ordersItemsPerPage), ordersTotalCount)} of {ordersTotalCount} results
                                </div>
                                {ordersTotalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOrdersPageChange(ordersCurrentPage - 1)}
                                            disabled={ordersCurrentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        
                                        {/* Page Numbers */}
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: ordersTotalPages }, (_, i) => i + 1).map((page) => {
                                                // Show first page, last page, current page, and pages around current
                                                if (
                                                    page === 1 ||
                                                    page === ordersTotalPages ||
                                                    (page >= ordersCurrentPage - 1 && page <= ordersCurrentPage + 1)
                                                ) {
                                                    return (
                                                        <Button
                                                            key={page}
                                                            variant={page === ordersCurrentPage ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => handleOrdersPageChange(page)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            {page}
                                                        </Button>
                                                    );
                                                } else if (
                                                    page === ordersCurrentPage - 2 ||
                                                    page === ordersCurrentPage + 2
                                                ) {
                                                    return <span key={page} className="px-2 text-muted-foreground">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOrdersPageChange(ordersCurrentPage + 1)}
                                            disabled={ordersCurrentPage === ordersTotalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <div className="text-sm">No orders found</div>
                        <div className="text-xs mt-1">Try adjusting your filters or selecting a restaurant</div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
