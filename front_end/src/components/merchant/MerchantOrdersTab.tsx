import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useEffect, useState } from "react";
import { orderService  } from "../../services/api";
import { MerchantOrder } from '../../types/book';
const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-accent/20 text-accent-foreground',
  shipped: 'bg-primary/20 text-primary',
  delivered: 'bg-secondary/20 text-secondary',
  cancelled: 'bg-destructive/20 text-destructive',
};
 
export function MerchantOrdersTab() {
 const [orders, setOrders] = useState<MerchantOrder[]>([]);
  useEffect(() => {

    const fetchOrders = async () => {
      const res = await orderService.getMerchantOrders();
      setOrders(res.data.data);
    };

    fetchOrders();

  }, []);
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Book</th>
                <th className="pb-3 font-medium">Qty</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-border">
                  <td className="py-4 font-medium">{order._id}</td>
                  <td className="py-4">{order.user?.name}</td>
                  <td className="py-4">{order.items.map(item => item.book.title).join(", ")}</td>
                  <td className="py-4">{order.items.map(item => item.quantity).join(", ")}</td>
                  <td className="py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="py-4">
                    <Badge variant="outline" className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
