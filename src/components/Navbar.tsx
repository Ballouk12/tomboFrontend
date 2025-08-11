import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Car, Bell, User, LogOut, Plus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-card/95 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* Logo dark mode uniquement */}
            <img
              src="/images/logo.png"
              alt="Car Logo"
              className="h-20 w-30 hidden dark:block"
            />
            {/* Logo light mode uniquement */}
            <img
              src="/images/logo2.png"
              alt="Car Logo Light"
              className="h-20 w-30 hidden md:block block dark:hidden"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <>
               <Link to="/home" className="text-foreground/80 hover:text-primary transition-colors">
                  Accueil
                </Link>
                <Link to="/dashboard" className="text-foreground/80 hover:text-primary transition-colors">
                  Tableau de bord
                </Link>
                <Link to="/alerts" className="text-foreground/80 hover:text-primary transition-colors">
                  Alertes
                </Link>
                <Link to="/my-annonces" className="text-foreground/80 hover:text-primary transition-colors">
                  Mes annonces
                </Link>
              </>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/annonce/create">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Plus className="h-4 w-4 mr-2" />
                    Vendre une voiture
                  </Button>
                </Link>
                
                <Link to="/notifications" className="relative">
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-foreground/60" />
                  <span className="text-sm text-foreground/80 hidden md:block">
                    {user?.firstName || 'User'}
                  </span>
                </div>

                <ThemeToggle />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Déconnexion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir vous déconnecter ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Se déconnecter</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;