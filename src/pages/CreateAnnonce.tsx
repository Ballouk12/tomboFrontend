import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAnnonce } from '@/store/slices/annonceSlice';
import { RootState, AppDispatch } from '@/store/store';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const CreateAnnonce = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.annonces);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const [files ,setFiles] = useState<File[]>([]);
  const [annonce, setAnnonce] = useState({
    brand: '',
    model: '',
    fuelType: '',
    location: '',
    price: '',
    year: '',
    mileage: '',
    transmission: '',
    description: '',
  });
  const formData = new FormData();


  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[CreateAnnonce] Bouton submit cliqué');
    console.log('voici le user id :', user?.id);
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      const annonceData = {
        ...annonce,
        price: parseFloat(annonce.price),
        year: parseInt(annonce.year),
        mileage: parseInt(annonce.mileage),
        userId: user.id,
      };
      console.log('[CreateAnnonce] Données envoyées au dispatch:', annonceData);
      await dispatch(createAnnonce(annonceData)).unwrap();
      toast({
        title: "Success!",
        description: "Your car listing has been created.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('[CreateAnnonce] Erreur lors du dispatch:', error);
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    }
  };*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[CreateAnnonce] Bouton submit cliqué');
    console.log('voici le user id :', user?.id);
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      const annonceData = {
        ...annonce,
        price: parseFloat(annonce.price),
        year: parseInt(annonce.year),
        mileage: parseInt(annonce.mileage),
        user: { id : user.id},
      };
      formData.append('annonce', JSON.stringify(annonceData));
      files.forEach(file => {
        formData.append('images', file);
      })
      console.log('[CreateAnnonce] Données envoyées au dispatch:', annonceData);
      await dispatch(createAnnonce(formData)).unwrap();
      toast({
        title: "Success!",
        description: "Your car listing has been created.",
      });
      navigate('/home');
    } catch (error) {
      console.error('[CreateAnnonce] Erreur lors du dispatch:', error);
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnnonce(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setAnnonce(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Car Listing</CardTitle>
              <CardDescription>
                Fill in the details to create your car advertisement
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={annonce.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      name="model"
                      value={annonce.model}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={annonce.year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={annonce.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileage">Mileage *</Label>
                    <Input
                      id="mileage"
                      name="mileage"
                      type="number"
                      min="0"
                      value={annonce.mileage}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={annonce.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select onValueChange={(value) => handleSelectChange('fuelType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gasoline">Gasoline</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select onValueChange={(value) => handleSelectChange('transmission', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="cvt">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={annonce.description}
                    onChange={handleChange}
                    placeholder="Describe your car's condition, features, and any additional information..."
                  />
                </div>
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles(Array.from(e.target.files));
                      }
                    }}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Creating...' : 'Create Listing'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnonce;