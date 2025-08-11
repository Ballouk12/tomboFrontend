import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { getUserAnnonces } from '@/store/slices/annonceSlice';
import Navbar from '@/components/Navbar';
import CarCard from '@/components/CarCard';

export default function MyAnnonces() {
  const dispatch = useDispatch<AppDispatch>();
  const { userAnnonces, isLoading, error } = useSelector((state: RootState) => state.annonces);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.id) {
      console.log('[MyAnnonces] Appel getUserAnnonces pour user.id =', user.id);
      dispatch(getUserAnnonces(user.id))
        .unwrap()
        .then((res) => {
          console.log('[MyAnnonces] Réponse getUserAnnonces:', res);
        })
        .catch((err) => {
          console.error('[MyAnnonces] Erreur getUserAnnonces:', err);
        });
    } else {
      console.log('[MyAnnonces] Aucun user connecté, pas d\'appel getUserAnnonces');
    }
  }, [dispatch, user?.id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Mes Annonces</h1>
        {isLoading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Erreur : {error}</div>
        ) : userAnnonces.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Vous n'avez créé aucune annonce.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAnnonces.map((annonce: any) => (
              <CarCard key={annonce.id} annonce={annonce} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
