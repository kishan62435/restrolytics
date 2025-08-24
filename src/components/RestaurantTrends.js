import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function RestaurantTrends({ selectedRestaurant, selectedRestaurantTrends }) {
    if (!selectedRestaurant || !selectedRestaurantTrends) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {selectedRestaurant.name} - Performance Trends
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Detailed analytics for the selected restaurant
                </p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">
                            {selectedRestaurantTrends.total_orders || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">
                            ₹{(selectedRestaurantTrends.total_revenue || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">
                            ₹{(selectedRestaurantTrends.average_order_value || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Average Order Value</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">
                            {selectedRestaurantTrends.hourly && selectedRestaurantTrends.hourly.length > 0 
                                ? (() => {
                                    const peakHour = selectedRestaurantTrends.hourly.reduce((max, hour) => 
                                        hour.count > max.count ? hour : max
                                    );
                                    // Extract hour from timestamp or use direct hour value
                                    let hour = peakHour.hour;
                                    if (typeof hour === 'string') {
                                        if (hour.includes(' ')) {
                                            hour = hour.split(' ')[1]; // Extract hour from "2025-01-01 14:00:00"
                                        } else if (hour.includes(':')) {
                                            hour = hour.split(':')[0]; // Extract hour from "14:00:00"
                                        }
                                    }
                                    return `${parseInt(hour) || 0}:00`;
                                })()
                                : 'N/A'
                            }
                        </div>
                        <div className="text-sm text-muted-foreground">Peak Order Hour</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
