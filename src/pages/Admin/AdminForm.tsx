// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { supabase, Client } from '@/lib/supabase';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { toast } from '@/hooks/use-toast';
// import { ArrowLeft } from 'lucide-react';

// const currencies = [
//   { value: 'INR', label: 'INR - Indian Rupee' },
//   { value: 'USD', label: 'USD - US Dollar' },
//   { value: 'EUR', label: 'EUR - Euro' },
//   { value: 'GBP', label: 'GBP - British Pound' },
//   { value: 'AED', label: 'AED - UAE Dirham' },
//   { value: 'AUD', label: 'AUD - Australian Dollar' },
// ];

// export default function AdminForm() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = !!id;

//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     billing_address: '',
//     city: '',
//     state: '',
//     country: '',
//     postal_code: '',
//     gst_number: '',
//     vat_number: '',
//     currency_preference: 'INR',
//   });

//   useEffect(() => {
//     if (isEdit) {
//       fetchClient();
//     }
//   }, [id]);

//   const fetchClient = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('clients')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (error) throw error;
//       if (data) {
//         setFormData(data);
//       }
//     } catch (error) {
//       console.error('Error fetching client:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to load client data',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (isEdit) {
//         const { error } = await supabase
//           .from('clients')
//           .update(formData)
//           .eq('id', id);

//         if (error) throw error;

//         toast({
//           title: 'Success',
//           description: 'Client updated successfully',
//         });
//       } else {
//         const { error } = await supabase
//           .from('clients')
//           .insert([{ ...formData, created_by: user?.id }]);

//         if (error) throw error;

//         toast({
//           title: 'Success',
//           description: 'Client created successfully',
//         });
//       }

//       navigate('/clients');
//     } catch (error: any) {
//       console.error('Error saving client:', error);
//       toast({
//         title: 'Error',
//         description: error.message || 'Failed to save client',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}>
//           <ArrowLeft className="h-4 w-4" />
//         </Button>
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">
//             {isEdit ? 'Edit Client' : 'Add New Client'}
//           </h1>
//           <p className="text-muted-foreground">
//             {isEdit ? 'Update client information' : 'Enter client details'}
//           </p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Client Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Name *</Label>
//                 <Input
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   value={formData.phone}
//                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="currency">Currency Preference</Label>
//                 <Select
//                   value={formData.currency_preference}
//                   onValueChange={(value) => setFormData({ ...formData, currency_preference: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {currencies.map((currency) => (
//                       <SelectItem key={currency.value} value={currency.value}>
//                         {currency.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="billing_address">Billing Address</Label>
//               <Textarea
//                 id="billing_address"
//                 value={formData.billing_address}
//                 onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
//                 rows={3}
//               />
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="city">City</Label>
//                 <Input
//                   id="city"
//                   value={formData.city}
//                   onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="state">State</Label>
//                 <Input
//                   id="state"
//                   value={formData.state}
//                   onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="country">Country</Label>
//                 <Input
//                   id="country"
//                   value={formData.country}
//                   onChange={(e) => setFormData({ ...formData, country: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="postal_code">Postal Code</Label>
//                 <Input
//                   id="postal_code"
//                   value={formData.postal_code}
//                   onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="gst_number">GST Number</Label>
//                 <Input
//                   id="gst_number"
//                   value={formData.gst_number}
//                   onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="vat_number">VAT Number</Label>
//                 <Input
//                   id="vat_number"
//                   value={formData.vat_number}
//                   onChange={(e) => setFormData({ ...formData, vat_number: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-4">
//               <Button type="button" variant="outline" onClick={() => navigate('/clients')}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? 'Saving...' : isEdit ? 'Update Client' : 'Create Client'}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
