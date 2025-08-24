import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export default function TopRestaurants({ computedAnalytics, selectedRestaurant, handleRestaurantSelect, restaurants }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top 3 Restaurants by Revenue
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Select restaurants or apply filters to view detailed analytics
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {computedAnalytics.topPerformingRestaurants.slice(0, 3).map((restaurant, index) => (
                        <div 
                            key={restaurant.id} 
                            data-restaurant-id={restaurant.id}
                            className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-300 ease-in-out transform ${
                                selectedRestaurant?.id === restaurant.id 
                                    ? 'ring-2 ring-primary bg-primary/5 border-primary/20 shadow-lg scale-[1.02]' 
                                    : 'hover:bg-muted/30 hover:border-muted-foreground/30 hover:scale-[1.01] hover:shadow-md'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm ${
                                    selectedRestaurant?.id === restaurant.id 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-primary/10 text-primary'
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className={`font-semibold text-sm ${
                                        selectedRestaurant?.id === restaurant.id ? 'text-primary' : ''
                                    }`}>
                                        {restaurant.name}
                                        {selectedRestaurant?.id === restaurant.id && (
                                            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                                Selected
                                            </span>
                                        )}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {restaurant.orders || 0} orders • AOV: ₹{(restaurant.aov || 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-primary">₹{(restaurant.revenue || 0).toFixed(2)}</div>
                                <Button 
                                    variant={selectedRestaurant?.id === restaurant.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleRestaurantSelect(restaurants.find(r => r.id === restaurant.id))}
                                    className={`transition-all duration-200 text-xs ${
                                        selectedRestaurant?.id === restaurant.id 
                                            ? 'bg-primary text-primary-foreground shadow-lg' 
                                            : 'hover:bg-primary hover:text-primary-foreground'
                                    }`}
                                >
                                    {selectedRestaurant?.id === restaurant.id ? '✓ Selected' : 'Select'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
