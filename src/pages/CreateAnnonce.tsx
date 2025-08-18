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
import { useEffect } from 'react';

const CreateAnnonce = () => {
  // Liste des villes marocaines
  const villesMaroc = [
    "Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tanger", "Meknès", "Oujda", "Kenitra", "Tetouan", "Safi", "El Jadida", "Beni Mellal", "Nador", "Khouribga", "Khemisset", "Taza", "Settat", "Berrechid", "Ouarzazate", "Larache", "Guelmim", "Mohammedia", "Errachidia", "Sidi Kacem", "Sidi Slimane", "Sidi Bennour", "Taourirt", "Essaouira", "Azrou", "Ifrane", "Al Hoceima", "Dakhla", "Laayoune"
  ];
  // State pour marques et modèles
  const [marques, setMarques] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  // Chargement des marques au montage
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
        console.error('Erreur chargement marques:', err);
        setMarques([]);
      });
  }, []);
  // Chargement des modèles à chaque changement de marque
  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      setSelectedModel('');
      return;
    }
    fetch(`http://localhost:3001/api/models/${selectedBrand}`)
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
        console.error('Erreur chargement modèles:', err);
        setModels([]);
      });
  }, [selectedBrand]);
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
    user: { id: user?.id } // Initialisé à 0, sera mis à jour lors de la soumission
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
                    <Select value = {selectedBrand} onValueChange={(value) =>{
                      setSelectedBrand(value);
                      setAnnonce(prev => ({ ...prev, brand: value, model: '' }));
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {marques.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                  </div>
                  <div>
                    <Label htmlFor="model">Model *</Label>
                    {models.length === 0 ? (
                      <Input
                        id="model"
                        name="model"
                        type="text"
                        value={selectedModel}
                        onChange={e => {
                          setSelectedModel(e.target.value);
                          setAnnonce(prev => ({ ...prev, model: e.target.value }));
                        }}
                      />
                    ) : (
                      <Select value={selectedModel} onValueChange={(value) => {
                        setSelectedModel(value);
                        setAnnonce(prev => ({ ...prev, model: value }));
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                 

                  <Label>Year *</Label>
                  <Select value = {annonce.year} onValueChange={(value) => handleSelectChange('year', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: new Date().getFullYear() - 1990 + 1}, (_, i) => 1990 + i).reverse().map(y => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  
                    <Select value={annonce.location} onValueChange={(value) => handleSelectChange('location', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {villesMaroc.map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                 <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="picture">Pictures</Label>
                  <Input id="picture" type="file" 
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