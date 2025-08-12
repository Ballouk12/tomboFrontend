import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { getAllAnnonces, setCurrentPage } from '@/store/slices/annonceSlice';
import { Car, MapPin, Calendar, DollarSign, Gauge, Palette, Fuel, Settings } from 'lucide-react';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const PAGE_SIZE = 6;

export default function Home() {
  // Liste des villes marocaines
  const villesMaroc = [
    "Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tanger", "Meknès", "Oujda", "Kenitra", "Tetouan", "Safi", "El Jadida", "Beni Mellal", "Nador", "Khouribga", "Khemisset", "Taza", "Settat", "Berrechid", "Ouarzazate", "Larache", "Guelmim", "Mohammedia", "Errachidia", "Sidi Kacem", "Sidi Slimane", "Sidi Bennour", "Taourirt", "Essaouira", "Azrou", "Ifrane", "Al Hoceima", "Dakhla", "Laayoune"
  ];
  // State pour marques et modèles
  const [marques, setMarques] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
    // Filtering state
  const [filters, setFilters] = useState({
    marque: '',
    modele: '',
    annee: '',
    prixMin: '',
    prixMax: '',
    kilometrageMin: '',
    kilometrageMax: '',
    localisation: '',
    carburant: '',
    transmission: '',
  });
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
    if (!filters?.marque) {
      setModels([]);
      return;
    }
    fetch(`http://localhost:3001/api/models/${filters.marque}`)
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
  }, [filters?.marque]);
  const dispatch = useDispatch<AppDispatch>();
  const { annonces, isLoading, error, currentPage } = useSelector((state: RootState) => state.annonces);


  // Filtre panel visibility
  const [showFilters, setShowFilters] = useState(true);

  // Helper to get unique values for select options
  // Helper to get unique values for select options (only for existing annonces)
  const getUniqueValues = (key: string) => {
    // On filtre d'abord les annonces selon les autres filtres sauf la clé courante
    const filtered = annonces.filter((annonce: any) => {
      return Object.entries(filters).every(([k, v]) => {
        if (k === key) return true; // ignore current key
        if (!v) return true;
        if (k === 'annee') return String(annonce[k]) === v;
        if (k === 'prixMin') return annonce.prix >= Number(v);
        if (k === 'prixMax') return annonce.prix <= Number(v);
        if (k === 'kilometrageMin') return annonce.kilometrage >= Number(v);
        if (k === 'kilometrageMax') return annonce.kilometrage <= Number(v);
        return annonce[k] === v;
      });
    });
    return Array.from(new Set(filtered.map((a: any) => a[key]).filter(Boolean)));
  };

  // Filtering logic
  const filteredAnnonces = annonces.filter((annonce: any) => {
    if (filters.marque && annonce.marque !== filters.marque) return false;
    if (filters.modele && annonce.modele !== filters.modele) return false;
    if (filters.annee && String(annonce.annee) !== filters.annee) return false;
    if (filters.prixMin && annonce.prix < Number(filters.prixMin)) return false;
    if (filters.prixMax && annonce.prix > Number(filters.prixMax)) return false;
    if (filters.kilometrageMin && annonce.kilometrage < Number(filters.kilometrageMin)) return false;
    if (filters.kilometrageMax && annonce.kilometrage > Number(filters.kilometrageMax)) return false;
    if (filters.localisation && annonce.localisation !== filters.localisation) return false;
    // couleur supprimé du filtrage
    if (filters.carburant && annonce.carburant !== filters.carburant) return false;
    if (filters.transmission && annonce.transmission !== filters.transmission) return false;
    return true;
  });

  useEffect(() => {
    dispatch(getAllAnnonces());
  }, [dispatch,]);

  // Pagination logic (après filtrage)
  const totalPages = Math.ceil(filteredAnnonces.length / PAGE_SIZE);
  const paginated = filteredAnnonces.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <h2 className="text-3xl font-bold mb-6 text-center">All Cars</h2>
      {/* Filtrer toggle button */}
      <div className="flex justify-end mb-2">
        <button
          className="bg-primary hover:bg-primary/80 text-white rounded-md h-8 px-4 text-sm shadow"
          onClick={() => setShowFilters(v => !v)}
        >
          {showFilters ? 'Cacher le filtrage' : 'Filtrer'}
        </button>
      </div>
      {/* Filtering UI */}
      {showFilters && (
        <div className="sticky top-16 z-30 mb-4 bg-card/80 dark:bg-card/60 backdrop-blur-md rounded-xl p-1 border border-border shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {/* Marque */}
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            <select
              className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
              value={filters.marque}
              onChange={e => setFilters(f => ({ ...f, marque: e.target.value, modele: '' }))}
            >
              <option value="">Marque</option>
              {marques.length === 0 ? (
                <option value="">Aucune donnée</option>
              ) : marques.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
            {/* Modele */}
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            {models.length === 0 ? (
              <input
                type="text"
                className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
                placeholder="Saisir un modèle"
                value={filters.modele}
                onChange={e => setFilters(f => ({ ...f, modele: e.target.value }))}
              />
            ) : (
              <select
                className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
                value={filters.modele}
                onChange={e => setFilters(f => ({ ...f, modele: e.target.value }))}
                disabled={!filters.marque}
              >
                <option value="">Modèle</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
          </div>
            {/* Année */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <select
              className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
              value={filters.annee}
              onChange={e => setFilters(f => ({ ...f, annee: e.target.value }))}
            >
              <option value="">Année</option>
              {Array.from({length: new Date().getFullYear() - 1990 + 1}, (_, i) => 1990 + i).reverse().map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
            {/* Localisation */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <select
              className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
              value={filters.localisation}
              onChange={e => setFilters(f => ({ ...f, localisation: e.target.value }))}
            >
              <option value="">Localisation</option>
              {villesMaroc.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
            {/* Prix min */}
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <input
                type="number"
                className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
                placeholder="Prix min"
                value={filters.prixMin}
                onChange={e => setFilters(f => ({ ...f, prixMin: e.target.value }))}
                min={0}
              />
            </div>
            {/* Prix max */}
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <input
                type="number"
                className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
                placeholder="Prix max"
                value={filters.prixMax}
                onChange={e => setFilters(f => ({ ...f, prixMax: e.target.value }))}
                min={0}
              />
            </div>
            {/* Kilométrage min */}
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              <input
                type="number"
                className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
                placeholder="Kilométrage min"
                value={filters.kilometrageMin}
                onChange={e => setFilters(f => ({ ...f, kilometrageMin: e.target.value }))}
                min={0}
              />
            </div>
            {/* Kilométrage max */}
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              <input
                type="number"
                className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
                placeholder="Kilométrage max"
                value={filters.kilometrageMax}
                onChange={e => setFilters(f => ({ ...f, kilometrageMax: e.target.value }))}
                min={0}
              />
            </div>
            {/* Carburant */}
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-primary" />
              <select
                className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
                value={filters.carburant}
                onChange={e => setFilters(f => ({ ...f, carburant: e.target.value }))}
              >
                <option value="">Carburant</option>
                {getUniqueValues('carburant').map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            {/* Transmission */}
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <select
                className="flex-1 bg-background dark:bg-background border border-border text-foreground rounded-md h-8 px-2 text-sm"
                value={filters.transmission}
                onChange={e => setFilters(f => ({ ...f, transmission: e.target.value }))}
              >
                <option value="">Transmission</option>
                {getUniqueValues('transmission').map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            {/* Reset button */}
            <div className="col-span-full mt-1 flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 text-white rounded-md h-8 px-3 text-sm"
                onClick={() => setFilters({
                  marque: '', modele: '', annee: '', prixMin: '', prixMax: '', kilometrageMin: '', kilometrageMax: '', localisation: '', carburant: '', transmission: ''
                })}
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginated.map((annonce) => (
          <CarCard key={annonce.id} annonce={annonce} />
        ))}
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              onClick={() => {
                dispatch(setCurrentPage(i + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
