import { Card, CardContent,  } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle, Truck, Clock, Package, Eye } from 'lucide-react';
import { Order,Book } from '../../types/book';
import { orderService } from '../../services/api';
import { useEffect,useState } from 'react';


const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Delivered':
      return <CheckCircle className="h-4 w-4 text-secondary" />;
    case 'Shipped':
      return <Truck className="h-4 w-4 text-primary" />;
    case 'Cancelled':
      return <Package className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-accent" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'secondary' as const;
    case 'Shipped':
      return 'default' as const;
    case 'Cancelled':
      return 'destructive' as const;
    default:
      return 'outline' as const;
  }
};

export const OrdersTab = () => {

    const [orders, setOrders] = useState<Order[]>([]);
      useEffect(() => {
      const fetchOrders = async () => {
        const res = await orderService.getMyOrders();
        setOrders(res.data);
      };
     
      fetchOrders();
    }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">My Orders</h2>
        <p className="text-sm text-muted-foreground">{orders.length} orders</p>
      </div>

      {orders.map((order) => (
        <Card key={order._id} className="shadow-soft">
          <CardContent className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-semibold">{order._id}</span>
                <Badge variant={getStatusVariant(order.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-3">
              {orders.map((order) => (
                <div key={order._id} className="relative">
                  <img
                    src={order.items[0]?.book.coverImage}
                    alt={order.items[0]?.book.title}
                    className="h-20 w-14 rounded object-cover shadow-sm"
                  />
                </div>
              ))}
              <div className="ml-auto text-right">
                <p className="font-display text-xl font-bold">R{order.total.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <div className="text-sm text-muted-foreground">
                {/* {order.trackingNumber ? (
                  <span>Tracking: <span className="font-medium text-foreground">{order.trackingNumber}</span></span>
                ) : (
                  <span>No tracking available</span>
                )} */}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-1 h-3 w-3" />
                  View Details
                </Button>
                {order.status === 'delivered' && (
                  <Button variant="secondary" size="sm">
                    Buy Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
