import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Annonce } from '@/store/slices/annonceSlice';
import { Calendar, MapPin, Gauge, Fuel, Settings, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarCardProps {
  annonce: Annonce;
}

const CarCard = ({ annonce }: CarCardProps) => {
  const [imgIndex, setImgIndex] = useState(0);

  const hasImages = annonce.images && annonce.images.length > 0;
  const currentImage = hasImages ? annonce.images[imgIndex] : null;

  const prevImage = () => {
    setImgIndex((prev) => (prev === 0 ? annonce.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setImgIndex((prev) => (prev === annonce.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden flex items-center justify-center">
        {hasImages ? (
          <>
            <img
              src={"http://localhost:8082" + currentImage}
              alt={`${annonce.brand} ${annonce.model}`}
              className="object-cover w-full h-full"
              loading="lazy"
            />
            {annonce.images.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-1 hover:bg-opacity-70 transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  aria-label="Next image"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-1 hover:bg-opacity-70 transition"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 mb-2 bg-primary/10 rounded-full flex items-center justify-center">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm">Photo Coming Soon</p>
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1">
            ${annonce.price?.toLocaleString() ?? 'N/A'}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {annonce.brand} {annonce.model}
        </CardTitle>
        <CardDescription className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {annonce.location}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{annonce.year ?? 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{annonce.mileage !== undefined && annonce.mileage !== null ? annonce.mileage.toLocaleString() + ' mi' : 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="capitalize">{annonce.fuelType ?? 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="capitalize">{annonce.transmission ?? 'N/A'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full group-hover:shadow-md transition-all">
              Voir détails
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails de l'annonce</DialogTitle>
              <DialogDescription>
                {annonce.brand} {annonce.model} - {annonce.year}
              </DialogDescription>
            </DialogHeader>
            {/* Images carousel in modal */}
            {annonce.images && annonce.images.length > 0 && (
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden flex items-center justify-center mb-4">
                <img
                  src={"http://localhost:8082" + annonce.images[imgIndex]}
                  alt={`${annonce.brand} ${annonce.model}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
                {annonce.images.length > 1 && (
                  <>
                    <button
                      aria-label="Previous image"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-1 hover:bg-opacity-70 transition"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      aria-label="Next image"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-1 hover:bg-opacity-70 transition"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            )}
            {annonce.description && (
              <div className="bg-muted rounded-lg p-4 text-base text-foreground shadow-inner border mt-4 whitespace-pre-line">
                {annonce.description}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
