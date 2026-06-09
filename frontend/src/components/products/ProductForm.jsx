import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '@/constants';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  imageUrl: '',
};

/**
 * Create / Edit product form used inside a Dialog.
 * @param {object} product - existing product for editing, null for create
 * @param {function} onSubmit - async function(data)
 * @param {function} onCancel
 */
export function ProductForm({ product, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
        imageUrl: product.imageUrl || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [product]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      errs.price = 'Valid price is required';
    if (form.stock !== '' && (isNaN(Number(form.stock)) || Number(form.stock) < 0))
      errs.stock = 'Stock must be a non-negative number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stock: form.stock !== '' ? parseInt(form.stock, 10) : 0,
      category: form.category,
      imageUrl: form.imageUrl.trim(),
    });
  };

  const field = (id, label, props = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
      {errors[id] && <p className="text-xs text-destructive">{errors[id]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {field('name', 'Product Name *', {
        placeholder: 'iPhone 15',
        value: form.name,
        onChange: set('name'),
      })}

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Brief product description"
          value={form.description}
          onChange={set('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('price', 'Price (₹) *', {
          type: 'number',
          min: '0',
          step: '0.01',
          placeholder: '999.00',
          value: form.price,
          onChange: set('price'),
        })}
        {field('stock', 'Stock Quantity', {
          type: 'number',
          min: '0',
          placeholder: '50',
          value: form.stock,
          onChange: set('stock'),
        })}
      </div>

      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select
          value={form.category}
          onValueChange={(v) => setForm((prev) => ({ ...prev, category: v }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {DEFAULT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          placeholder="https://example.com/image.jpg"
          value={form.imageUrl}
          onChange={set('imageUrl')}
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {product ? 'Save Changes' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
