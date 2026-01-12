
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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

const businesses = [
  { value: 'TAS', label: 'TAS - Tech Arch Softwares' },
  { value: 'MONKEY', label: 'MONKEY' },
  { value: 'AVSAR', label: 'AVSAR' },
  
];

export default function ViewerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isCreate = !id;
  const isEditRoute = location.pathname.includes('/edit');
  const isViewOnly = !!id && !isEditRoute;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'viewer',
    password: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    businessName: 'INR',
  });

  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!id) return;
    fetchViewer();
  }, [id]);

  const fetchViewer = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, axiosConfig);

      const data = response.data.user; 

      setFormData({
        name: data.name ?? '',
        email: data.email ?? '',
        phoneNumber: data.phoneNumber ?? '',
        role: data.role ?? '',
        password: '', 
        address: data.address?.street ?? '',
        city: data.address?.city ?? '',
        state: data.address?.state ?? '',
        country: data.address?.country ?? '',
        postalCode: data.address?.postalCode ?? '',
        businessName: data.businessName ?? 'INR',
      });

    } catch (error) {
      console.error("Error fetching viewer", error);
      toast({
        title: "Error",
        description: "Failed to load viewer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isViewOnly) return;

    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      role: "viewer",
      businessName: formData.businessName,
      ...(isCreate && { password: formData.password }), 
      address: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
      }
    };

    try {
      if (isEditRoute) {
        await axios.patch(`${API_BASE_URL}/api/users/${id}`, payload, axiosConfig);
        toast({ title: "Success", description: "Viewer updated successfully" });
      } else {
        await axios.post(`${API_BASE_URL}/api/users`, payload, axiosConfig);
        toast({ title: "Success", description: "Viewer created successfully" });
      }

      navigate('/viewers');

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save viewer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isViewOnly || !id) return;

    if (!window.confirm("Are you sure you want to delete this viewer?")) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${id}`, axiosConfig);
      toast({ title: "Deleted", description: "Viewer deleted successfully" });
      navigate('/viewers');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete viewer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
    
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/viewers')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold">
            {isCreate ? "Add New Viewer" : isEditRoute ? "Edit Viewer" : "View Viewer"}
          </h1>
          <p className="text-muted-foreground">
            {isCreate ? "Enter viewer details" :
              isEditRoute ? "Update viewer details" : "Read-only viewer details"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Viewer Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">

          
            <div className="grid gap-4 md:grid-cols-2">
            
              <div className="space-y-2">
                <Label>Name </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  readOnly={isViewOnly}
                />
              </div>

           
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  name="viewer-email"
                  autoComplete="new-email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  readOnly={isViewOnly}
                />
              </div>

           
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  readOnly={isViewOnly}
                />
              </div>

             
              <div className="space-y-2">
                <Label>Business Preference</Label>
                <Select
                  value={formData.businessName}
                  readOnly={isViewOnly}
                  onValueChange={(value) => setFormData({ ...formData, businessName: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {businesses.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            
            <div className={`grid gap-4 ${isCreate ? "md:grid-cols-2" : "grid-cols-1"}`}>
              {isCreate && (
                <div className="space-y-2">
                  <Label>Password </Label>
                  <Input
                    type="password"
                    value={formData.password}
                    name="viewer-password"
                    autoComplete="new-password"
                    required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

       <div className="space-y-2">
  <Label>Role</Label>
  <Input
    value="viewer"
    disabled
    className="bg-muted"
  />
</div>


              <div className="space-y-2 md:col-span-2">
                <Label>Street Address</Label>
                <Textarea
                  value={formData.address}
                  rows={3}
                  readOnly={isViewOnly}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="City" value={formData.city} 
                onChange={(v) => setFormData({ ...formData, city: v })} />

              <InputField label="State" value={formData.state} 
                onChange={(v) => setFormData({ ...formData, state: v })} />

              <InputField label="Country" value={formData.country} 
                onChange={(v) => setFormData({ ...formData, country: v })} />

              <InputField label="Postal Code" value={formData.postalCode}
                onChange={(v) => setFormData({ ...formData, postalCode: v })} />
            </div>

        
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/viewers')}>
                Cancel
              </Button>

              {!isViewOnly && (
                <>
                  {id && (
                    <Button type="button" variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  )}
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : isEditRoute ? "Update Viewer" : "Create Viewer"}
                  </Button>
                </>
              )}
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function InputField({ label, value, onChange, readOnly=false}: any) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
