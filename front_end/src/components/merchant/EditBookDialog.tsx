import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Save } from 'lucide-react';
import { Book } from '../../types/book';
import { categories } from '../../data/mockData';
import { toast } from 'sonner';

interface EditBookDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Book) => void;
}

export function EditBookDialog({ book, open, onOpenChange, onSave }: EditBookDialogProps) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    originalPrice: '',
    coverImage: '',
    category: '',
    isbn: '',
    pages: '',
    language: '',
    stock: '',
  });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price.toString(),
        originalPrice: book.originalPrice?.toString() || '',
        coverImage: book.coverImage,
        category: book.category,
        isbn: book.isbn,
        pages: book.pages.toString(),
        language: book.language,
        stock: book.stock.toString(),
      });
    }
  }, [book]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    if (!form.title || !form.author || !form.price || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updated: Book = {
      ...book,
      title: form.title,
      author: form.author,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      coverImage: form.coverImage,
      category: form.category,
      isbn: form.isbn,
      pages: parseInt(form.pages) || 0,
      language: form.language,
      stock: parseInt(form.stock) || 0,
    };

    onSave(updated);
    toast.success('Book updated successfully!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Edit Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Cover Image URL</Label>
            <div className="flex gap-3">
              <Input
                placeholder="https://example.com/cover.jpg"
                value={form.coverImage}
                onChange={(e) => handleChange('coverImage', e.target.value)}
                className="flex-1"
              />
              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="h-16 w-12 rounded object-cover border border-border"
                />
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Author *</Label>
              <Input value={form.author} onChange={(e) => handleChange('author', e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => handleChange('category', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.icon} {cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Price ($) *</Label>
              <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => handleChange('price', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Original Price ($)</Label>
              <Input type="number" step="0.01" min="0" value={form.originalPrice} onChange={(e) => handleChange('originalPrice', e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input type="number" min="0" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Pages</Label>
              <Input type="number" min="0" value={form.pages} onChange={(e) => handleChange('pages', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Input value={form.language} onChange={(e) => handleChange('language', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>ISBN</Label>
            <Input value={form.isbn} onChange={(e) => handleChange('isbn', e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
