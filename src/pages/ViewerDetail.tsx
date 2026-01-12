  
  import { useEffect, useState } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import axios from 'axios';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { ArrowLeft } from 'lucide-react';
  import { useAuth } from '@/hooks/useAuth';
  import API_BASE_URL from '../Apiconfig/ApiConfig.ts'

  interface ViewerData {
    name: string;
    email: string;
    phoneNumber: string; 
    businessName: 'Monkey' | 'TAS' | 'Avsar';
   
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  }
  export default function ViewerDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { userRole } = useAuth();
    const [viewer, setViewer] = useState<ViewerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
      if (id) fetchViewer();
    }, [id]);

    const fetchViewer = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        setViewer(response.data);
      } catch (error) {
        console.error('Error fetching viewer:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (field: string, value: any) => {
      if (!viewer) return;

      if (field.startsWith('address.')) {
        const key = field.split('.')[1];
        setViewer({ ...viewer, address: { ...viewer.address, [key]: value } });
      } else {
        setViewer({ ...viewer, [field]: value });
      }
    };

    const handleSave = async () => {
      if (!viewer || !id) return;

      setSaving(true);

      try {
        console.log('PATCH URL:', `${API_BASE_URL}/api/users/${id}`);
        console.log('Payload:', viewer);

        await axios.patch(`${API_BASE_URL}/api/users/${id}`, viewer, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });

        navigate(`/viewers/${id}`);
      } catch (error) {
        console.error('Error updating viewer:', error);
      } finally {
        setSaving(false);
      }
    };

    if (loading) return <div className="flex items-center justify-center h-96">Loading...</div>;
    if (!viewer) return <div className="text-center py-12">Viewer not found</div>;
    if (userRole !== 'superadmin' && userRole !== 'admin' && userRole!='viewer') return <div>Unauthorized</div>;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/viewers/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Viewer</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Viewer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <Input value={viewer.name} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <Input value={viewer.email} onChange={(e) => handleChange('email', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <Input value={viewer.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">BusinessName</p>
              <Input
                value={viewer.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
              />
            </div>
            

            <h2 className="text-lg font-semibold mt-4">Billing Address</h2>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Street</p>
              <Input value={viewer.address?.street} onChange={(e) => handleChange('address.street', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">City</p>
              <Input value={viewer.address?.city} onChange={(e) => handleChange('address.city', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">State</p>
              <Input value={viewer.address?.state} onChange={(e) => handleChange('address.state', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Country</p>
              <Input value={viewer.address?.country} onChange={(e) => handleChange('address.country', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
              <Input
                value={viewer.address?.postalCode}
                onChange={(e) => handleChange('address.postalCode', e.target.value)}
              />
            </div>

            <Button onClick={handleSave} disabled={saving} className="mt-4">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

