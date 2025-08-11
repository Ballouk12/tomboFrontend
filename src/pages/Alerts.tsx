import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { getUserAlerts, deleteAlert } from '@/store/slices/alertSlice';
import EditAlertDialog from '@/components/EditAlertDialog';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Alerts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { alerts, isLoading } = useSelector((state: RootState) => state.alerts);
  const { toast } = useToast();

  // Dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserAlerts(user.id));
    }
  }, [dispatch, user?.id]);

  const handleDeleteAlert = async (alertId: number) => {
    try {
      await dispatch(deleteAlert(alertId)).unwrap();
      toast({
        title: "Alert deleted",
        description: "Your alert has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <EditAlertDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        alert={selectedAlert}
        onSuccess={() => {
          if (user?.id) dispatch(getUserAlerts(user.id));
        }}
      />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Alerts</h1>
            <p className="text-muted-foreground">
              Manage your car search alerts and get notified when matching cars are listed.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-semibold mb-2">No alerts created yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first alert to get notified when cars matching your criteria are listed.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {alert.brand} {alert.model} Alert
                      </CardTitle>
                      <CardDescription>
                        Created on {new Date(alert.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.active ? "default" : "secondary"}>
                        {alert.active ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAlert(alert);
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Location:</span>
                      <p className="text-muted-foreground">{alert.location || "Any"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Year Range:</span>
                      <p className="text-muted-foreground">
                        {alert.year_min} - {alert.year_max}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Price Range:</span>
                      <p className="text-muted-foreground">
                        ${alert.price_min?.toLocaleString()} - ${alert.price_max?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Max Mileage:</span>
                      <p className="text-muted-foreground">
                        {alert.mileage_max?.toLocaleString()} miles
                      </p>
                    </div>
                    {alert.fuel_type && (
                      <div>
                        <span className="font-medium">Fuel Type:</span>
                        <p className="text-muted-foreground">{alert.fuel_type}</p>
                      </div>
                    )}
                    {alert.transmission && (
                      <div>
                        <span className="font-medium">Transmission:</span>
                        <p className="text-muted-foreground">{alert.transmission}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Has Defects:</span>
                      <p className="text-muted-foreground">
                        {alert.has_defects ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;