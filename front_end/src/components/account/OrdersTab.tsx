import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle, Truck, Clock, Package, Eye } from 'lucide-react';
import { books } from '../../data/mockData';

const orders = [
  {
    id: '#ORD-1234',
    date: '2024-01-15',
    status: 'Delivered',
    total: 67.98,
    books: [books[0], books[2]],
    trackingNumber: 'TRK-9876543210',
  },
  {
    id: '#ORD-1233',
    date: '2024-01-10',
    status: 'Shipped',
    total: 24.99,
    books: [books[1]],
    trackingNumber: 'TRK-1234567890',
  },
  {
    id: '#ORD-1232',
    date: '2024-01-05',
    status: 'Processing',
    total: 89.97,
    books: [books[3], books[4], books[5]],
    trackingNumber: null,
  },
  {
    id: '#ORD-1231',
    date: '2023-12-20',
    status: 'Delivered',
    total: 42.98,
    books: [books[6], books[7]],
    trackingNumber: 'TRK-5555555555',
  },
  {
    id: '#ORD-1230',
    date: '2023-12-10',
    status: 'Cancelled',
    total: 17.99,
    books: [books[7]],
    trackingNumber: null,
  },
];

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">My Orders</h2>
        <p className="text-sm text-muted-foreground">{orders.length} orders</p>
      </div>

      {orders.map((order) => (
        <Card key={order.id} className="shadow-soft">
          <CardContent className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-semibold">{order.id}</span>
                <Badge variant={getStatusVariant(order.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{order.date}</span>
            </div>

            <div className="flex items-center gap-3">
              {order.books.map((book) => (
                <div key={book._id} className="relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-20 w-14 rounded object-cover shadow-sm"
                  />
                </div>
              ))}
              <div className="ml-auto text-right">
                <p className="font-display text-xl font-bold">${order.total.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  {order.books.length} {order.books.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <div className="text-sm text-muted-foreground">
                {order.trackingNumber ? (
                  <span>Tracking: <span className="font-medium text-foreground">{order.trackingNumber}</span></span>
                ) : (
                  <span>No tracking available</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-1 h-3 w-3" />
                  View Details
                </Button>
                {order.status === 'Delivered' && (
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
