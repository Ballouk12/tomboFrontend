import React, { useState } from 'react';
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
    has_defects: false,
    active: true,
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    if (!user?.id) return;
    const data = {
      ...form,
      year_min: Number(form.year_min),
      year_max: Number(form.year_max),
      price_min: Number(form.price_min),
      price_max: Number(form.price_max),
      mileage_max: Number(form.mileage_max),
      userId: user.id,
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
          <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
          <Input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" />
          <Input name="model" value={form.model} onChange={handleChange} placeholder="Model" />
          <div className="flex gap-2">
            <Input name="year_min" value={form.year_min} onChange={handleChange} placeholder="Year min" type="number" />
            <Input name="year_max" value={form.year_max} onChange={handleChange} placeholder="Year max" type="number" />
          </div>
          <div className="flex gap-2">
            <Input name="price_min" value={form.price_min} onChange={handleChange} placeholder="Price min" type="number" />
            <Input name="price_max" value={form.price_max} onChange={handleChange} placeholder="Price max" type="number" />
          </div>
          <Input name="mileage_max" value={form.mileage_max} onChange={handleChange} placeholder="Max mileage" type="number" />
          <Input name="fuel_type" value={form.fuel_type} onChange={handleChange} placeholder="Fuel type" />
          <Input name="transmission" value={form.transmission} onChange={handleChange} placeholder="Transmission" />
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
