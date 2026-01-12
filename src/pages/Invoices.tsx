// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Plus, Search, Eye, Edit, Download } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
// import { format } from 'date-fns';
// import axios from 'axios';
// import { generateInvoicePDF } from '@/lib/pdf';
// import { Trash } from "lucide-react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { toast } from '@/hooks/use-toast';

// export default function Invoices() {
//   const navigate = useNavigate();
//   const { userRole } = useAuth();
//   const [invoices, setInvoices] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
//   const [paymentData, setPaymentData] = useState({
//     remark: '',
//     amount: 0,
//     payment_method: 'Cash',
//     payment_date: format(new Date(), 'yyyy-MM-dd'),
//   });
//   const paymentMethods = ['Cash', 'Bank Transfer', 'Card', 'UPI'];
  

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   const fetchInvoices = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/invoices', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setInvoices(res.data || []);
//     } catch (error) {
//       console.error('Error fetching invoices:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredInvoices = invoices.filter((invoice) => {
//     const searchLower = searchQuery.toLowerCase();
//     const matchesSearch =
//       invoice.invoice_number.toLowerCase().includes(searchLower) ||
//       invoice.client_id?.name?.toLowerCase().includes(searchLower) ||
//       invoice.brand_id?.brandName?.toLowerCase().includes(searchLower);
//     const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'paid':
//         return 'bg-green-500/10 text-green-500';
//       case 'partially-paid':
//         return 'bg-blue-500/10 text-blue-500';
//       case 'pending':
//         return 'bg-destructive/10 text-destructive';
//       case 'cancelled':
//         return 'bg-muted text-muted-foreground';
//       default:
//         return '';
//     }
//   };

//   const canCreateInvoice = userRole === 'superadmin' || userRole === 'admin';

//   const openPaymentModal = (invoice: any) => {
//     console.log('Selected Invoice:', invoice);
//     setSelectedInvoice(invoice);
//     setPaymentData({ remark: '', amount: invoice.due_amount || 0, payment_method: 'Cash', payment_date: format(new Date(), 'yyyy-MM-dd') });
//     setShowPaymentModal(true);
//   };
  
//   const handleSavePayment = async () => {
//     try {
//       if (!selectedInvoice) return;
//       const res = await fetch(`http://localhost:5000/api/invoices/${selectedInvoice._id}/payments`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(paymentData),
//       });
//       if (!res.ok) throw new Error('Failed to save payment');
//       toast({ title: 'Success', description: 'Payment added successfully' });
//       setShowPaymentModal(false);
//       fetchInvoices();
//     } catch (err: any) {
//       toast({ title: 'Error', description: err.message || 'Failed to save payment', variant: 'destructive' });
//     }
//   };
// const handleRazorpayPayment = async (invoice) => {
//   try {
//     const res = await fetch(
//       `http://localhost:5000/api/invoices/${invoice._id}/pay-link`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);

//     // 🔗 Open shareable payment link
//     window.open(data.paymentLink, "_blank");

//   } catch (err: any) {
//     toast({
//       title: "Error",
//       description: err.message || "Failed to create payment link",
//       variant: "destructive",
//     });
//   }
// };

// const handleDelete = async (e, invoiceId) => {
//   e.stopPropagation(); // 🔴 prevent row click

//   const confirmDelete = window.confirm(
//     "Are you sure you want to delete this invoice?"
//   );
//   if (!confirmDelete) return;

//   try {
//     const token = localStorage.getItem("token");

//     await axios.delete(
//       `http://localhost:5000/api/invoices/${invoiceId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     toast({
//       title: "Invoice Deleted",
//       description: "The invoice has been removed successfully.",
//     });

//     // ✅ remove deleted invoice from table instantly
//     setInvoices((prev) =>
//       prev.filter((inv) => inv._id !== invoiceId)
//     );
//   } catch (err: any) {
//     console.error(err);
//     toast({
//       title: "Error",
//       description: err.message || "Failed to delete invoice",
//       variant: "destructive",
//     });
//   }
// };


//   if (loading) return <div className="flex items-center justify-center h-96">Loading...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
          
//           <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
//           <p className="text-muted-foreground">Manage and track your invoices</p>
//         </div>
//         {canCreateInvoice && (
//           <Button onClick={() => navigate('/invoices/new')}>
//             <Plus className="h-4 w-4 mr-2" />
//             New Invoice
//           </Button>
//         )}
//       </div>

//       <Card>
//         <CardHeader>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by invoice number, client, or brand..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="paid">Paid</SelectItem>
//                 <SelectItem value="partially-paid">Partially-Paid</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardHeader>

//         <CardContent>
//           {filteredInvoices.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-muted-foreground">No invoices found.</p>
//             </div>
//           ) : (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Invoice #</TableHead>
                    
//                     <TableHead>Client</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Due Date</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Pending Amount</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredInvoices.map((invoice) => (
//                     <TableRow key={invoice._id} className="cursor-pointer hover:bg-muted/50"   onClick={() => navigate(`/invoices/${invoice._id}`)}>
//                       <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      
//                       <TableCell>{invoice.client_id?.name || "Unknown"}</TableCell>
//                       <TableCell>{format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</TableCell>
//                       <TableCell>{format(new Date(invoice.due_date), "MMM dd, yyyy")}</TableCell>
//                       <TableCell>{invoice.currency} {Number(invoice.grand_total).toFixed(2)}</TableCell>
//                       <TableCell className='text-red-400 font-semibold'>{invoice.currency} {Number(invoice.due_amount).toFixed(2)}</TableCell>
//                       <TableCell>
//                         <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                       <div className="flex justify-end ">

//                       {/* View – visible to everyone */}
//                       <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={(e) =>handleDelete(e, invoice._id)}
                        
//                       >
//                       <Trash className="h-4 w-4 text-red-500" />
//                       </Button>

//                        {/* Edit – admin & superadmin only */}
//                         {canCreateInvoice && (
//                          <Button
//                          variant="ghost"
//                           size="sm"
//                           onClick={(e) =>{e.stopPropagation();
//                              navigate(`/invoices/${invoice._id}/edit`)}}
//                           >
//                          <Edit className="h-4 w-4" />
//                         </Button>
//                         )}

//                         {/* Add Payment – admin & superadmin only */}
//                         {canCreateInvoice && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                            onClick={(e) =>{e.stopPropagation();
//                               openPaymentModal(invoice)}}
//                           >
//                             <Plus className="h-4 w-4" />
//                           </Button>
//                         )}

//                                   {/* Download PDF – visible to everyone */}
//                    <Button
//                      variant="ghost"
//                      size="sm"
//                      onClick={async (e) => {
//                       e.stopPropagation();
//                        try {
//                          const token = localStorage.getItem("token");
//                          const res = await fetch(
//                            `http://localhost:5000/api/invoices/${invoice._id}`,
//                            { headers: { Authorization: `Bearer ${token}` } }
//                          );

//                          if (!res.ok) throw new Error("Failed to fetch invoice");
                       
//                           const data = await res.json();
//                           const pdfBlob = await generateInvoicePDF(
//                           data,
//                           data.client_id,
//                          data.items,
//                            data.taxes,
//                           data.brand_id
//                           );

//           const url = URL.createObjectURL(pdfBlob);
//           const a = document.createElement("a");
//           a.href = url;
//           a.download = `${data.invoice_number}.pdf`;
//           a.click();
//           URL.revokeObjectURL(url);
//         } catch (err) {
//           console.error(err);
//         }
//       }}
//     >
//       <Download className="h-4 w-4" />
//     </Button>

//   </div>
// </TableCell>


//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Add Payment</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div>
//               <Label>Amount</Label>
//               <Input
//                 type="number"
//                 value={paymentData.amount}
//                 onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
//               />
//             </div>
//             <div>
//               <Label>Payment Method</Label>
//               <Select
//                 value={paymentData.payment_method}
//                 onValueChange={(val) => setPaymentData({ ...paymentData, payment_method: val })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Method" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {paymentMethods.map((method) => (
//                     <SelectItem key={method} value={method}>{method}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Payment Date</Label>
//               <Input
//                 type="date"
//                 value={paymentData.payment_date}
//                 onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label>Remark</Label>
//               <Textarea
//                 value={paymentData.remark}
//                 onChange={(e) => setPaymentData({ ...paymentData, remark: e.target.value })}
//               />
//             </div>
//           </div>
//           <DialogFooter className="flex justify-end gap-2">
//             <Button onClick={handleSavePayment}>Add Payment</Button>
//            <Button
//   disabled={!selectedInvoice || selectedInvoice.due_amount <= 0}
//   onClick={() => handleRazorpayPayment(selectedInvoice)}
//   className="bg-blue-600 hover:bg-blue-700 text-white"
// >
//   Pay via Razorpay
// </Button>


//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import axios from 'axios';
import { generateInvoicePDF } from '@/lib/pdf';
import { Trash } from "lucide-react";
import API_BASE_URL from '../Apiconfig/ApiConfig.ts'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export default function Invoices() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({
    remark: '',
    amount: 0,
    payment_method: 'Cash',
    payment_date: format(new Date(), 'yyyy-MM-dd'),
  });
  const paymentMethods = ['Cash', 'Bank Transfer', 'Card', 'UPI'];
  // const ITEMS_PER_PAGE = 5;
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalInvoices, setTotalInvoices] = useState(0);



  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchInvoices();
  }, [currentPage]);

const fetchInvoices = async () => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/invoices`,
      {
        params: {
          page: currentPage,
          search: searchQuery,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setInvoices(res.data.invoices || []);
    setTotalPages(res.data.totalPages);
    setTotalInvoices(res.data.totalInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
  } finally {
    setLoading(false);
  }
};



  // const filteredInvoices = invoices.filter((invoice) => {
  //   const searchLower = searchQuery.toLowerCase();
  //   const matchesSearch =
  //     invoice.invoice_number.toLowerCase().includes(searchLower) ||
  //     invoice.client_id?.name?.toLowerCase().includes(searchLower) ||
  //     invoice.brand_id?.brandName?.toLowerCase().includes(searchLower);
  //   const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });

  useEffect(() => {
  setCurrentPage(1);
  fetchInvoices();
}, [searchQuery, statusFilter]);


// const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);

// const paginatedInvoices = filteredInvoices.slice(
//   (currentPage - 1) * ITEMS_PER_PAGE,
//   currentPage * ITEMS_PER_PAGE
// );



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-500';
      case 'partially-paid':
        return 'bg-blue-500/10 text-blue-500';
      case 'pending':
        return 'bg-destructive/10 text-destructive';
      case 'cancelled':
        return 'bg-muted text-muted-foreground';
      default:
        return '';
    }
  };

  const canCreateInvoice = userRole === 'superadmin' || userRole === 'admin';

  const openPaymentModal = (invoice: any) => {
    console.log('Selected Invoice:', invoice);
    setSelectedInvoice(invoice);
    setPaymentData({ remark: '', amount: invoice.due_amount || 0, payment_method: 'Cash', payment_date: format(new Date(), 'yyyy-MM-dd') });
    setShowPaymentModal(true);
  };
  
  const handleSavePayment = async () => {
    try {
      if (!selectedInvoice) return;
      const res = await fetch(`${API_BASE_URL}/api/invoices/${selectedInvoice._id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(paymentData),
      });
      if (!res.ok) throw new Error('Failed to save payment');
      toast({ title: 'Success', description: 'Payment added successfully' });
      setShowPaymentModal(false);
      fetchInvoices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save payment', variant: 'destructive' });
    }
  };
const handleRazorpayPayment = async (invoice) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/invoices/${invoice._id}/pay-link`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // 🔗 Open shareable payment link
    window.open(data.paymentLink, "_blank");

  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Failed to create payment link",
      variant: "destructive",
    });
  }
};

const handleDelete = async (e, invoiceId) => {
  e.stopPropagation(); // 🔴 prevent row click

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this invoice?"
  );
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `${API_BASE_URL}/api/invoices/${invoiceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast({
      title: "Invoice Deleted",
      description: "The invoice has been removed successfully.",
    });

    // ✅ remove deleted invoice from table instantly
    setInvoices((prev) =>
      prev.filter((inv) => inv._id !== invoiceId)
    );
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Error",
      description: err.message || "Failed to delete invoice",
      variant: "destructive",
    });
  }
};


  if (loading) return <div className="flex items-center justify-center h-96">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage and track your invoices</p>
        </div>
        {canCreateInvoice && (
          <Button onClick={() => navigate('/invoices/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number, client, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partially-paid">Partially-Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No invoices found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Pending Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice._id} className="cursor-pointer hover:bg-muted/50"   onClick={() => navigate(`/invoices/${invoice._id}`)}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      
                      <TableCell>{invoice.client_id?.name || "Unknown"}</TableCell>
                      <TableCell>{format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(new Date(invoice.due_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{invoice.currency} {Number(invoice.grand_total).toFixed(2)}</TableCell>
                      <TableCell className='text-red-400 font-semibold'>{invoice.currency} {Number(invoice.due_amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                      <div className="flex justify-end ">

                      {/* View – visible to everyone */}
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) =>handleDelete(e, invoice._id)}
                        
                      >
                      <Trash className="h-4 w-4 text-red-500" />
                      </Button>

                       {/* Edit – admin & superadmin only */}
                        {canCreateInvoice && (
                         <Button
                         variant="ghost"
                          size="sm"
                          onClick={(e) =>{e.stopPropagation();
                             navigate(`/invoices/${invoice._id}/edit`)}}
                          >
                         <Edit className="h-4 w-4" />
                        </Button>
                        )}

                        {/* Add Payment – admin & superadmin only */}
                        {canCreateInvoice && (
                          <Button
                            variant="ghost"
                            size="sm"
                           onClick={(e) =>{e.stopPropagation();
                              openPaymentModal(invoice)}}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}

                                  {/* Download PDF – visible to everyone */}
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={async (e) => {
                      e.stopPropagation();
                       try {
                         const token = localStorage.getItem("token");
                         const res = await fetch(
                           `${API_BASE_URL}/api/invoices/${invoice._id}`,
                           { headers: { Authorization: `Bearer ${token}` } }
                         );

                         if (!res.ok) throw new Error("Failed to fetch invoice");
                       
                          const data = await res.json();
                          const pdfBlob = await generateInvoicePDF(
                          data,
                          data.client_id,
                         data.items,
                           data.taxes,
                          data.brand_id
                          );

          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${data.invoice_number}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error(err);
        }
      }}
    >
      <Download className="h-4 w-4" />
    </Button>

  </div>
</TableCell>


                    </TableRow>
                  ))}
                </TableBody>
              </Table>



             <div className="flex flex-col items-center gap-2 mt-4">
  <p className="text-sm text-muted-foreground">
    Page {currentPage} of {totalPages}
  </p>

  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      
    >
      Previous
    </Button>

    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
    >
      Next
    </Button>
  </div>
</div>


            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select
                value={paymentData.payment_method}
                onValueChange={(val) => setPaymentData({ ...paymentData, payment_method: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Date</Label>
              <Input
                type="date"
                value={paymentData.payment_date}
                onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Remark</Label>
              <Textarea
                value={paymentData.remark}
                onChange={(e) => setPaymentData({ ...paymentData, remark: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button onClick={handleSavePayment}>Add Payment</Button>
           <Button
  disabled={!selectedInvoice || selectedInvoice.due_amount <= 0}
  onClick={() => handleRazorpayPayment(selectedInvoice)}
  className="bg-blue-600 hover:bg-blue-700 text-white"
>
  Pay via Razorpay
</Button>





          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
