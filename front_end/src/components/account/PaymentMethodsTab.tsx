import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/Label';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
  name: string;
}

const initialCards: PaymentMethod[] = [
  { id: '1', type: 'visa', last4: '4242', expiry: '12/26', isDefault: true, name: 'John Reader' },
  { id: '2', type: 'mastercard', last4: '8888', expiry: '06/25', isDefault: false, name: 'John Reader' },
];

const cardBrandColors: Record<string, string> = {
  visa: 'bg-primary/10 text-primary',
  mastercard: 'bg-accent/10 text-accent',
  amex: 'bg-secondary/10 text-secondary',
};

export const PaymentMethodsTab = () => {
  const [cards, setCards] = useState<PaymentMethod[]>(initialCards);
  const [dialogOpen, setDialogOpen] = useState(false);

  const setDefault = (id: string) => {
    setCards((prev) =>
      prev.map((c) => ({ ...c, isDefault: c.id === id }))
    );
    toast({ title: 'Default updated', description: 'Default payment method changed.' });
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    toast({ title: 'Card removed', description: 'Payment method has been removed.' });
  };

  const addCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: 'visa',
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      expiry: '01/28',
      isDefault: cards.length === 0,
      name: 'John Reader',
    };
    setCards((prev) => [...prev, newCard]);
    setDialogOpen(false);
    toast({ title: 'Card added', description: 'New payment method has been added.' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Payment Methods</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <form onSubmit={addCard} className="space-y-4">
              <div>
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Reader" required />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="4242 4242 4242 4242" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" required />
                </div>
              </div>
              <Button type="submit" className="w-full">Add Payment Method</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CreditCard className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h3 className="font-display text-xl font-bold">No payment methods</h3>
          <p className="mt-2 text-muted-foreground">Add a card to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card) => (
            <Card key={card.id} className={`shadow-soft ${card.isDefault ? 'ring-2 ring-primary/30' : ''}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${cardBrandColors[card.type]}`}>
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">{card.type}</span>
                    <span className="text-muted-foreground">•••• {card.last4}</span>
                    {card.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <Star className="h-3 w-3 fill-primary" />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Expires {card.expiry} · {card.name}</p>
                </div>
                <div className="flex gap-2">
                  {!card.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => setDefault(card.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCard(card.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
