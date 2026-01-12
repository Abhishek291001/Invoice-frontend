  import { useEffect, useState } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import axios from 'axios';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { ArrowLeft } from 'lucide-react';
  import { useAuth } from '@/hooks/useAuth';
  import API_BASE_URL from '../Apiconfig/ApiConfig.ts'

  interface ClientData {
    name: string;
    email: string;
    phoneNumber: string;
    currencyPreference: 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'AUD';
    gstNumber: string;
    vatNumber: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  }

  export default function EditClient() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { userRole } = useAuth();
    const [client, setClient] = useState<ClientData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
      if (id) fetchClient();
    }, [id]);

    const fetchClient = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clients/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        setClient(response.data);
      } catch (error) {
        console.error('Error fetching client:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (field: string, value: any) => {
      if (!client) return;

      if (field.startsWith('address.')) {
        const key = field.split('.')[1];
        setClient({ ...client, address: { ...client.address, [key]: value } });
      } else {
        setClient({ ...client, [field]: value });
      }
    };

    const handleSave = async () => {
      if (!client || !id) return;

      setSaving(true);

      try {
        console.log('PATCH URL:', `${API_BASE_URL}/api/clients/${id}`);
       

        await axios.patch(`${API_BASE_URL}/api/clients/${id}`, client, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });

        navigate(`/clients/${id}`);
      } catch (error) {
        console.error('Error updating client:', error);
      } finally {
        setSaving(false);
      }
    };

    if (loading) return <div className="flex items-center justify-center h-96">Loading...</div>;
    if (!client) return <div className="text-center py-12">Client not found</div>;
    if (userRole !== 'superadmin' && userRole !== 'admin') return <div>Unauthorized</div>;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/clients/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Client</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <Input value={client.name} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <Input value={client.email} onChange={(e) => handleChange('email', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <Input value={client.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Currency Preference</p>
              <Input
                value={client.currencyPreference}
                onChange={(e) => handleChange('currencyPreference', e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">GST Number</p>
              <Input value={client.gstNumber} onChange={(e) => handleChange('gstNumber', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">VAT Number</p>
              <Input value={client.vatNumber} onChange={(e) => handleChange('vatNumber', e.target.value)} />
            </div>

            <h2 className="text-lg font-semibold mt-4">Billing Address</h2>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Street</p>
              <Input value={client.address?.street} onChange={(e) => handleChange('address.street', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">City</p>
              <Input value={client.address?.city} onChange={(e) => handleChange('address.city', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">State</p>
              <Input value={client.address?.state} onChange={(e) => handleChange('address.state', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Country</p>
              <Input value={client.address?.country} onChange={(e) => handleChange('address.country', e.target.value)} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
              <Input
                value={client.address?.postalCode}
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
