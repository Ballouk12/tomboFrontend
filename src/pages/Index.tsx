import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store/store';
import { getAllAnnonces } from '@/store/slices/annonceSlice';
import Navbar from '@/components/Navbar';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, Shield, Users, Clock } from 'lucide-react';
import heroImage from '@/assets/hero-car-image.jpg';

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { annonces, isLoading } = useSelector((state: RootState) => state.annonces);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getAllAnnonces());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 40, 49, 0.8), rgba(34, 40, 49, 0.8)), url(${heroImage})`,
          }}
        />
        
        <div className="relative z-10 text-center mt-24 px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Buy and Sell{' '}
              <span className="text-primary">Car</span>{' '}
              of your{' '}
              <span className="text-primary">choice!</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Find your perfect car from thousands of verified listings, or sell your car quickly to trusted buyers.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search by brand, model, or location..."
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 h-12"
                />
              </div>
              <Button size="lg" className="px-8">
                <Search className="h-5 w-5 mr-2" />
                Search Cars
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">              <Button size="lg" className="px-8 py-3 text-lg">
                Buy Car
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-white/30 hover:bg-white/10">
                Sell Car
              </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for buying and selling cars in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-primary/10 rounded-2xl p-6 mb-4 group-hover:bg-primary/20 transition-colors">
                <Star className="h-12 w-12 text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">All Brands</h3>
              <p className="text-muted-foreground">
                Find cars from all major brands in one place. From luxury to economy, we have it all.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-primary/10 rounded-2xl p-6 mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-12 w-12 text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-muted-foreground">
                All our car listings are verified to ensure quality and authenticity.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-primary/10 rounded-2xl p-6 mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="h-12 w-12 text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-muted-foreground">
                Join thousands of satisfied buyers and sellers in our trusted marketplace.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-primary/10 rounded-2xl p-6 mb-4 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-12 w-12 text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-muted-foreground">
                List your car in minutes or find your dream car with our advanced search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Cars</h2>
            <p className="text-xl text-muted-foreground">
              Discover our latest and most popular car listings
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading cars...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {annonces.slice(0, 6).map((annonce) => (
                <CarCard key={annonce.id} annonce={annonce} />
              ))}
            </div>
          )}

          {annonces.length > 6 && (
            <div className="text-center mt-12">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button size="lg" variant="outline">
                  View All Cars
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of car buyers and sellers today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <>
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="px-8">
                    Create Account
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button size="lg" variant="outline" className="px-8 border-white/30 text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
