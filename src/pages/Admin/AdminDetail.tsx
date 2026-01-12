// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { supabase, Client, Invoice } from '@/lib/supabase';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { ArrowLeft, Edit, FileText } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { format } from 'date-fns';

// export default function AdminDetail() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { userRole } = useAuth();
//   const [client, setClient] = useState<Client | null>(null);
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (id) {
//       fetchClientData();
//     }
//   }, [id]);

//   const fetchClientData = async () => {
//     try {
//       // Fetch client
//       const { data: clientData, error: clientError } = await supabase
//         .from('clients')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (clientError) throw clientError;
//       setClient(clientData);

//       // Fetch invoices for this client
//       const { data: invoicesData, error: invoicesError } = await supabase
//         .from('invoices')
//         .select('*')
//         .eq('client_id', id)
//         .order('created_at', { ascending: false });

//       if (invoicesError) throw invoicesError;
//       setInvoices(invoicesData || []);
//     } catch (error) {
//       console.error('Error fetching client data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'paid': return 'bg-green-500/10 text-green-500';
//       case 'sent': return 'bg-blue-500/10 text-blue-500';
//       case 'overdue': return 'bg-destructive/10 text-destructive';
//       case 'draft': return 'bg-muted text-muted-foreground';
//       case 'cancelled': return 'bg-muted text-muted-foreground';
//       default: return '';
//     }
//   };

//   const canEdit = userRole === 'superadmin' || userRole === 'admin';

//   if (loading) {
//     return <div className="flex items-center justify-center h-96">Loading...</div>;
//   }

//   if (!client) {
//     return <div className="text-center py-12">Client not found</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}>
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
//             <p className="text-muted-foreground">Client Details</p>
//           </div>
//         </div>
//         {canEdit && (
//           <Button onClick={() => navigate(`/clients/${id}/edit`)}>
//             <Edit className="h-4 w-4 mr-2" />
//             Edit Client
//           </Button>
//         )}
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Contact Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Email</p>
//               <p>{client.email || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Phone</p>
//               <p>{client.phone || 'N/A'}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Business Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Currency Preference</p>
//               <p>{client.currency_preference}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">GST Number</p>
//               <p>{client.gst_number || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">VAT Number</p>
//               <p>{client.vat_number || 'N/A'}</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Billing Address</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-1">
//             {client.billing_address && <p>{client.billing_address}</p>}
//             {(client.city || client.state) && (
//               <p>{[client.city, client.state].filter(Boolean).join(', ')}</p>
//             )}
//             {(client.country || client.postal_code) && (
//               <p>{[client.country, client.postal_code].filter(Boolean).join(' ')}</p>
//             )}
//             {!client.billing_address && !client.city && !client.state && !client.country && (
//               <p className="text-muted-foreground">No address provided</p>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Invoices ({invoices.length})</CardTitle>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {invoices.length === 0 ? (
//             <p className="text-center text-muted-foreground py-8">No invoices for this client yet.</p>
//           ) : (
//             <div className="space-y-3">
//               {invoices.map((invoice) => (
//                 <div
//                   key={invoice.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
//                   onClick={() => navigate(`/invoices/${invoice.id}`)}
//                 >
//                   <div className="flex items-center gap-3">
//                     <FileText className="h-5 w-5 text-muted-foreground" />
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <p className="font-medium">{invoice.invoice_number}</p>
//                         <Badge className={getStatusColor(invoice.status)}>
//                           {invoice.status}
//                         </Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         {format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="font-semibold">{invoice.currency} {Number(invoice.grand_total).toFixed(2)}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
