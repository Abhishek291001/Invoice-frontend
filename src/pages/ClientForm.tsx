import { useEffect, useState } from 'react';
import { useNavigate, useParams,useLocation  } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../Apiconfig/ApiConfig.ts'

const currencies = [
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
];

export default function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const location = useLocation();

  const isEditRoute = location.pathname.includes('/edit'); 
  const isViewOnly = !!id && !isEditRoute;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    billing_address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    gst_number: '',
    
    currency_preference: 'INR',
  });
  
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];



  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isEdit) {
      fetchClient();
    }
  }, [id]);


  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

 
  const fetchClient = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clients/${id}`, axiosConfig);
      const data = response.data;

      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phoneNumber || '',
        billing_address: data.address?.street || '',
        city: data.address?.city || '',
        state: data.address?.state || '',
        country: data.address?.country || '',
        postal_code: data.address?.postalCode || '',
        gst_number: data.gstNumber || '',
        
        currency_preference: data.currencyPreference || 'INR',
      });
    } catch (error: any) {
      console.error('Error fetching client:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load client data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewOnly) return; 
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      currencyPreference: formData.currency_preference,
      gstNumber: formData.gst_number,
     
      address: {
        street: formData.billing_address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postal_code,
      },
    };

    try {
      if (isEditRoute) {
        await axios.patch(`${API_BASE_URL}/api/clients/${id}`, payload, axiosConfig);
        toast({
          title: 'Success',
          description: 'Client updated successfully',
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/clients`, payload, axiosConfig);
        toast({
          title: 'Success',
          description: 'Client created successfully',
        });
      }

      navigate('/clients');
    } catch (error: any) {
      console.error('Error saving client:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save client',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async () => {
   if (!id || isViewOnly) return;

  const confirmDelete = window.confirm(
    'Are you sure you want to delete this client? This action cannot be undone.'
  );

  if (!confirmDelete) return;

  setLoading(true);

  try {
    await axios.delete(`${API_BASE_URL}/api/clients/${id}`, axiosConfig);
    toast({
      title: 'Deleted',
      description: 'Client deleted successfully',
    });
    navigate('/clients'); 
  } catch (error: any) {
    console.error('Error deleting client:', error);
    toast({
      title: 'Error',
      description: error.response?.data?.message || 'Failed to delete client',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditRoute ? 'Edit Client' : isViewOnly ? 'View Client' : 'Add New Client'}
          </h1>
          <p className="text-muted-foreground">
            {isEditRoute ? 'Update client information' : isViewOnly ? 'Client details (read-only)' : 'Enter client details'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                   readOnly={isViewOnly}
              
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 readOnly={isViewOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  readOnly={isViewOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency Preference</Label>
                <Select
                  value={formData.currency_preference}
                  onValueChange={(value) => setFormData({ ...formData, currency_preference: value })}
                  disabled={isViewOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_address">Billing Address</Label>
              <Textarea
                id="billing_address"
                value={formData.billing_address}
                onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                readOnly={isViewOnly}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                readOnly={isViewOnly}
                />
              </div>

              <div className="space-y-2">
  <Label htmlFor="state">State</Label>
  <Select
    value={formData.state}
    onValueChange={(value) => setFormData({ ...formData, state: value })}
   disabled={isViewOnly}
  >
    <SelectTrigger id="state">
      <SelectValue placeholder="Select a state" />
    </SelectTrigger>
    <SelectContent>
      {indianStates.map((state) => (
        <SelectItem key={state} value={state}>
          {state}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  readOnly={isViewOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                 readOnly={isViewOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gst_number">GST Number</Label>
                <Input
                  id="gst_number"
                  value={formData.gst_number}
                  onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                 readOnly={isViewOnly}
                />
              </div>

          
            </div>


               <div className="flex justify-end gap-4">
  <Button
    type="button"
    variant="outline"
    onClick={() => navigate('/clients')}
  >
    Cancel
  </Button>

  {isEditRoute && id && (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      disabled={loading}
    >
      Delete Client
    </Button>
  )}

  {!isViewOnly && (
    <Button type="submit" disabled={loading}>
      {loading ? 'Saving...' : isEditRoute ? 'Update Client' : 'Create Client'}
    </Button>
  )}
</div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
