import { getUserAlerts } from '@/store/slices/alertSlice';
import { getUserNotifications } from '@/store/slices/notificationSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { getUserAnnonces } from '@/store/slices/annonceSlice';

import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Bell, AlertTriangle } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
  // Mock data pour d'autres statistiques
  const annoncesParMois = [
    { mois: 'Jan', annonces: 2 },
    { mois: 'Fév', annonces: 4 },
    { mois: 'Mar', annonces: 3 },
    { mois: 'Avr', annonces: 5 },
    { mois: 'Mai', annonces: 7 },
    { mois: 'Juin', annonces: 6 },
  ];

  const notificationsParJour = [
    { jour: 'Lun', notifications: 1 },
    { jour: 'Mar', notifications: 2 },
    { jour: 'Mer', notifications: 0 },
    { jour: 'Jeu', notifications: 3 },
    { jour: 'Ven', notifications: 2 },
    { jour: 'Sam', notifications: 1 },
    { jour: 'Dim', notifications: 0 },
  ];


const Dashboard = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [stats, setStats] = useState({ nbrAnnonce: 0, nbrAlert: 0, nbrNotification: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!user?.id) return;
    dispatch(getUserAnnonces(user.id));
    dispatch(getUserAlerts(user.id));
    dispatch(getUserNotifications(user.id));
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8082/stats/all/${user.id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user?.id, dispatch]);

  const chartData = [
    { name: 'Annonces', value: stats.nbrAnnonce, color: '#3b82f6' },
    { name: 'Alertes', value: stats.nbrAlert, color: '#f59e42' },
    { name: 'Notifications', value: stats.nbrNotification, color: '#10b981' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        {loading ? (
          <div className="text-center py-10">Chargement des statistiques...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vos annonces</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.nbrAnnonce}</div>
                  <p className="text-xs text-muted-foreground">Annonces actives</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.nbrAlert}</div>
                  <p className="text-xs text-muted-foreground">Alertes de recherche de voiture</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.nbrNotification}</div>
                  <p className="text-xs text-muted-foreground">Notifications non lues</p>
                </CardContent>
              </Card>
            </div>
            {/* Charts en ligne (horizontal) */}
            <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {/* PieChart Statistiques globales */}
              <div style={{ minWidth: 340, minHeight: 240 }}>
                <ChartContainer config={{}}>
                  <PieChart width={320} height={220}>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label
                    >
                      {chartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
              {/* BarChart Annonces par mois */}
              <div style={{ minWidth: 400, minHeight: 260 }}>
                <ChartContainer config={{}}>
                  <ResponsiveContainer width={380} height={220}>
                    <BarChart data={annoncesParMois} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="annonces" fill="#3b82f6" name="Annonces" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              {/* LineChart Notifications par jour */}
              <div style={{ minWidth: 400, minHeight: 260 }}>
                <ChartContainer config={{}}>
                  <ResponsiveContainer width={380} height={220}>
                    <LineChart data={notificationsParJour} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="jour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="notifications" stroke="#10b981" name="Notifications" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;