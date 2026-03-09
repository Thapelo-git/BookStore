import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const mockOrders = [
  { id: 'ORD-001', customer: 'Alice Johnson', book: 'The Great Gatsby', quantity: 2, total: 29.98, status: 'delivered' as const, date: '2025-12-01' },
  { id: 'ORD-002', customer: 'Bob Smith', book: 'To Kill a Mockingbird', quantity: 1, total: 14.99, status: 'shipped' as const, date: '2025-12-05' },
  { id: 'ORD-003', customer: 'Carol White', book: '1984', quantity: 3, total: 38.97, status: 'processing' as const, date: '2025-12-10' },
  { id: 'ORD-004', customer: 'David Brown', book: 'Pride and Prejudice', quantity: 1, total: 12.99, status: 'pending' as const, date: '2025-12-12' },
  { id: 'ORD-005', customer: 'Eva Green', book: 'The Catcher in the Rye', quantity: 2, total: 25.98, status: 'cancelled' as const, date: '2025-12-15' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-accent/20 text-accent-foreground',
  shipped: 'bg-primary/20 text-primary',
  delivered: 'bg-secondary/20 text-secondary',
  cancelled: 'bg-destructive/20 text-destructive',
};

export function MerchantOrdersTab() {
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
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-border">
                  <td className="py-4 font-medium">{order.id}</td>
                  <td className="py-4">{order.customer}</td>
                  <td className="py-4">{order.book}</td>
                  <td className="py-4">{order.quantity}</td>
                  <td className="py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="py-4">
                    <Badge variant="outline" className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
