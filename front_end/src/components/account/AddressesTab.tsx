import { useState } from 'react';
import { MapPin, Plus, Trash2, Star, Edit2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/Label';
import { Badge } from '../../components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '../../components/ui/dialog';
import { useAddress, SavedAddress } from '../../contexts/AddressContext';

const emptyForm = { label:'', street:'', city: '', state: '', zipCode: '', country: '', isDefault: false };

export const AddressesTab = () => {
  const { addresses, addAddress, removeAddress, updateAddress, setDefaultAddress } = useAddress();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setForm({ label: addr.label??'', street: addr.street ?? '', city: addr.city ?? "", state: addr.state ?? '', zipCode: addr.zipCode ?? "", country: addr.country?? '', isDefault: addr.isDefault });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim() || !form.street.trim() || !form.city.trim() || !form.country.trim()) return;
    if (editingId) {
      updateAddress(editingId, form);
    } else {
      addAddress(form);
    }
    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const setField = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">My Addresses</h2>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold">No addresses yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add a shipping address to get started.</p>
            <Button className="mt-4" onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id} className={`shadow-soft transition-colors ${addr.isDefault ? 'border-primary/40' : ''}`}>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-display font-semibold">{addr.label}</span>
                  </div>
                  {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zipCode}</p>
                <p className="text-sm text-muted-foreground">{addr.country}</p>
                <div className="mt-4 flex gap-2">
                  {!addr.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => setDefaultAddress(addr.id)}>
                      <Star className="mr-1 h-3 w-3" /> Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => openEdit(addr)}>
                    <Edit2 className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeAddress(addr.id)}>
                    <Trash2 className="mr-1 h-3 w-3" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>Fill in the address details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="addr-label">Label (e.g. Home, Office)</Label>
              <Input id="addr-label" value={form.label} onChange={(e) => setField('label', e.target.value)} placeholder="Home" required maxLength={50} />
            </div>
            <div>
              <Label htmlFor="addr-street">Street Address</Label>
              <Input id="addr-street" value={form.street} onChange={(e) => setField('street', e.target.value)} placeholder="123 Main St" required maxLength={200} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="addr-city">City</Label>
                <Input id="addr-city" value={form.city} onChange={(e) => setField('city', e.target.value)} placeholder="New York" required maxLength={100} />
              </div>
              <div>
                <Label htmlFor="addr-state">State / Province</Label>
                <Input id="addr-state" value={form.state} onChange={(e) => setField('state', e.target.value)} placeholder="NY" maxLength={100} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="addr-zip">Zip / Postal Code</Label>
                <Input id="addr-zip" value={form.zipCode} onChange={(e) => setField('zipCode', e.target.value)} placeholder="10001" maxLength={20} />
              </div>
              <div>
                <Label htmlFor="addr-country">Country</Label>
                <Input id="addr-country" value={form.country} onChange={(e) => setField('country', e.target.value)} placeholder="United States" required maxLength={100} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingId ? 'Save Changes' : 'Add Address'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
