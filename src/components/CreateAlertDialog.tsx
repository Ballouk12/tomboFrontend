import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { createAlert } from '@/store/slices/alertSlice';

interface CreateAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateAlertDialog({ open, onOpenChange, onSuccess }: CreateAlertDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState({
    location: '',
    brand: '',
    model: '',
    year_min: '',
    year_max: '',
    price_min: '',
    price_max: '',
    mileage_max: '',
    fuel_type: '',
    transmission: '',
    user: { id: user?.id },
    has_defects: false,
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [marques, setMarques] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/makes")
      .then(res => res.json())
      .then(data => {
        if (data && data.Makes) {
          const makes = data.Makes.map((m: any) => m.make_display).filter(Boolean);
          setMarques(makes.sort((a: string, b: string) => a.localeCompare(b)));
        } else {
          setMarques([]);
        }
      })
      .catch(err => {
        console.error('Error loading brands:', err);
        setMarques([]);
      });
  }, []);

  useEffect(() => {
    if (!form.brand) {
      setModels([]);
      return;
    }
    fetch(`http://localhost:3001/api/models/${form.brand}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.Results) {
          const modelsList = data.Results.map((m: any) => m.Model_Name).filter(Boolean);
          setModels(modelsList.sort((a: string, b: string) => a.localeCompare(b)));
        } else {
          setModels([]);
        }
      })
      .catch(err => {
        console.error('Error loading models:', err);
        setModels([]);
      });
  }, [form.brand]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(form.year_min) > Number(form.year_max)) {
      alert('Year min must be less than or equal to Year max');
      return;
    }
    setLoading(true);
    if (!user?.id) return;
    const data = {
      ...form,
      year_min: Number(form.year_min),
      year_max: Number(form.year_max),
      price_min: Number(form.price_min),
      price_max: Number(form.price_max),
      mileage_max: Number(form.mileage_max),
      user: { id: user.id },
    };
    try {
      await dispatch(createAlert(data)).unwrap();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch {
      // handle error (toast?)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand */}
          <select
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full border rounded-md px-2 py-2 bg-background text-foreground"
          >
            <option value="">Select brand</option>
            {marques.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {/* Model */}
          <select
            name="model"
            value={form.model}
            onChange={handleChange}
            className="w-full border rounded-md px-2 py-2 bg-background text-foreground"
            disabled={!form.brand}
          >
            <option value="">Select model</option>
            {models.length === 0 ? (
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Enter model"
                className="w-full border rounded-md px-2 py-2 bg-background text-foreground"
              />
            ) : (
              models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))
            )}
          </select>
          {/* Transmission */}
          <select
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
            className="w-full border rounded-md px-2 py-2 bg-background text-foreground"
          >
            <option value="">Select transmission</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
            <option value="cvt">CVT</option>
          </select>
          {/* Fuel Type */}
          <select
            name="fuel_type"
            value={form.fuel_type}
            onChange={handleChange}
            className="w-full border rounded-md px-2 py-2 bg-background text-foreground"
          >
            <option value="">Select fuel type</option>
            <option value="gasoline">Gasoline</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {/* Year Range */}
          <div className="flex gap-2">
            <select
              name="year_min"
              value={form.year_min}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-2 bg-background text-foreground"
            >
              <option value="">Select year min</option>
              {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => 1990 + i).reverse().map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              name="year_max"
              value={form.year_max}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-2 bg-background text-foreground"
            >
              <option value="">Select year max</option>
              {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => 1990 + i).reverse().map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Input name="price_min" value={form.price_min} onChange={handleChange} placeholder="Price min" type="number" />
            <Input name="price_max" value={form.price_max} onChange={handleChange} placeholder="Price max" type="number" />
          </div>
          <Input name="mileage_max" value={form.mileage_max} onChange={handleChange} placeholder="Max mileage" type="number" />
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_defects" checked={form.has_defects} onChange={handleChange} />
              Has Defects
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              Active
            </label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
