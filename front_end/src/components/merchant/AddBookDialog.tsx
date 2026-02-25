import { useState,useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Upload } from 'lucide-react';
import { Book } from '../../types/book';
import { Category  } from '../../types/book';
import { toast } from 'sonner';
import { BookCreateRequest, BookUpdateRequest } from '../../types/book';
import { bookService } from '../../services/api';
import { AxiosError } from "axios";
interface AddBookDialogProps {
  mode: 'create' | 'edit';
  initialData?: BookUpdateRequest;

  onAddBook: (book: Book) => void;
  merchantId: string;
  merchantName: string;
  children: React.ReactNode;
}

const categories: Category[] = [
  { id: '1', name: 'Fiction', slug: 'fiction', icon: '📖' },
  { id: '2', name: 'Science', slug: 'science', icon: '🔬' },
  { id: '3', name: 'History', slug: 'history', icon: '🏛️' },
  { id: '4', name: 'Technology', slug: 'technology', icon: '💻' },
];
export function AddBookDialog({
  mode,
  initialData,
  onAddBook,
  merchantId,
  merchantName,
  children,
}: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');
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
  merchantId,
  merchantName,
  language: 'English',
  stock: '',
});
useEffect(() => {
  if (mode === 'edit' && initialData) {
    setForm((prev) => ({
      ...prev,
      title: initialData.title ?? '',
      author: initialData.author ?? '',
      description: initialData.description ?? '',
      price: initialData.price?.toString() ?? '',
      originalPrice: initialData.originalPrice?.toString() ?? '',
      coverImage: initialData.coverImage ?? '',
      category: initialData.category ?? '',
      isbn: initialData.isbn ?? '',
      pages: initialData.pages?.toString() ?? '',
      language: initialData.language ?? 'English',
      stock: initialData.stock?.toString() ?? '',
    }));
  }

}, [mode, initialData]);
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverUrl = (url: string) => {
    handleChange('coverImage', url);
    setCoverPreview(url);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload: BookCreateRequest = {
      title: form.title,
      author: form.author,
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice
        ? Number(form.originalPrice)
        : undefined,
      coverImage: form.coverImage,
      category: form.category,
      stock: Number(form.stock),
      publishedDate: new Date().toISOString(),
      isbn: form.isbn,
      pages: Number(form.pages),
      language: form.language,
    };

    if (mode === 'create') {
      const response = await bookService.create(payload);
      onAddBook(response.data.data);
      toast.success('Book created successfully');
    } else if (mode === 'edit' && initialData?.id) {
      const updatePayload: BookUpdateRequest = {
        id: initialData.id,
        ...payload,
      };

      await bookService.update(updatePayload.id, updatePayload);
      toast.success('Book updated successfully');
    }

    setOpen(false);
  } catch (error) {
  console.error(error);
  toast.error('Failed to save book');
}
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image URL</Label>
            <div className="flex gap-3">
              <Input
                placeholder="https://example.com/cover.jpg"
                value={form.coverImage}
                onChange={(e) => handleCoverUrl(e.target.value)}
                className="flex-1"
              />
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="h-16 w-12 rounded object-cover border border-border"
                  onError={() => setCoverPreview('')}
                />
              )}
            </div>
          </div>

          {/* Title & Author */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="Book title"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Author *</Label>
              <Input
                placeholder="Author name"
                value={form.author}
                onChange={(e) => handleChange('author', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Book description..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => handleChange('category', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price & Original Price */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Price ($) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="19.99"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Original Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="29.99"
                value={form.originalPrice}
                onChange={(e) => handleChange('originalPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Stock, Pages, Language */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                min="0"
                placeholder="100"
                value={form.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Pages</Label>
              <Input
                type="number"
                min="0"
                placeholder="320"
                value={form.pages}
                onChange={(e) => handleChange('pages', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Input
                placeholder="English"
                value={form.language}
                onChange={(e) => handleChange('language', e.target.value)}
              />
            </div>
          </div>

          {/* ISBN */}
          <div className="space-y-2">
            <Label>ISBN</Label>
            <Input
              placeholder="978-0000000000"
              value={form.isbn}
              onChange={(e) => handleChange('isbn', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Upload className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
