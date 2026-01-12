import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { generateInvoicePDF } from "@/lib/pdf";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import API_BASE_URL from '../Apiconfig/ApiConfig.ts'

export default function InvoiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { userRole } = useAuth();

  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [items, setItems] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) fetchInvoiceData();
  }, [id]);

 const fetchInvoiceData = async () => {
  if (!token) {
    toast({
      title: "Unauthorized",
      description: "No token found, please login first",
      variant: "destructive",
    });
    setLoading(false);
    return;
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/api/invoices/${id}`, {  
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data;

 
    setInvoice(data);
    setClient(data.client_id || null);
    setBrand(data.brand_id || null);
    setItems(data.items || []);
    setTaxes(data.taxes || []);
  } catch (error: any) {
    console.error("Error fetching invoice data:", error);
    toast({
      title: "Error",
      description: "Failed to fetch invoice",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const handleDownload = async () => {
    if (!invoice || !client) {
      toast({
        title: "Error",
        description: "Invoice data not loaded",
        variant: "destructive",
      });
      return;
    }

    try {
      const pdfBlob = await generateInvoicePDF(invoice, client, items, taxes, brand);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoice_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Success", description: "PDF generated and downloaded" });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/invoices/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({ title: "Success", description: "Invoice status updated" });
      fetchInvoiceData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-500';
     
      case 'pending': return 'bg-destructive/10 text-destructive';
      case 'partially-paid': return 'bg-blue-500/10 text-blue-500';
      case 'cancelled': return 'bg-muted text-muted-foreground';
      default: return '';
    }
  };

  const canEdit = userRole === 'superadmin' || userRole === 'admin';

  if (loading) return <div className="flex items-center justify-center h-96">Loading...</div>;
  if (!invoice) return <div className="text-center py-12">Invoice not found</div>;

  return (
    <div className="space-y-6">
     
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className='min-w-0'>
            <div className="flex flex-wrap items-center gap-2">

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight
                     whitespace-nowrap truncate max-w-[70vw] sm:max-w-none">{invoice.invoice_number}</h1>
              <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">Invoice Details</p>
          </div>
        </div>
      
       <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">

         {/* <div
    className={`px-2 py-0.5 rounded-lg font-semibold sm:text-sm lg:text-lg text-base
    ${invoice.due_amount > 0 ? "text-red-600 bg-red-100" : "text-green-700 bg-green-100"}`}
  >
    Due Amount: {invoice.currency} {invoice.due_amount ? invoice.due_amount.toLocaleString() : 0}
  </div> */}

  <div
  className={`inline-flex items-center justify-center
  px-2 sm:px-3 py-1
  rounded-lg font-semibold
  text-xs sm:text-sm md:text-base
  whitespace-nowrap
  ${
    invoice.due_amount > 0
      ? "text-red-600 bg-red-100"
      : "text-green-700 bg-green-100"
  }`}
>
  <span className="hidden sm:inline">Due Amount:</span>
  <span className="sm:hidden">Due:</span>
  <span className="ml-1">
    {invoice.currency}{" "}
    {invoice.due_amount ? invoice.due_amount.toLocaleString() : 0}
  </span>
</div>

          {canEdit && (
            <>

              <Select value={invoice.status} onValueChange={handleStatusUpdate}>
                <SelectTrigger className="w-full sm:w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                 
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partially-paid">Partially-paid</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => navigate(`/invoices/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Invoice Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground sm:text-base">Invoice Date</p>
              <p>{format(new Date(invoice.invoice_date), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground sm:text-base">Due Date</p>
              <p>{format(new Date(invoice.due_date), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground sm:text-base">Currency</p>
              <p>{invoice.currency}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground sm:text-base">Name</p>
              <p className="font-medium">{client?.name}</p>
            </div>   
            <div>
              <p className="text-sm text-muted-foreground sm:text-base">Email</p>
              <p>{client?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground sm:text-base">Phone</p>
              <p>{client?.phoneNumber || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

    
      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table className="text-sm sm:text-base">
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item._id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{Number(item.quantity).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{invoice.currency} {Number(item.unit_price).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">{invoice.currency} {Number(item.amount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    
<Card>
  <CardHeader><CardTitle>Brand</CardTitle></CardHeader>
  <CardContent className="space-y-3">
   <div className="flex flex-wrap items-center gap-4 sm:gap-6">

      {invoice.brand_id?.brandLogo ? (
        <img src={invoice.brand_id.brandLogo} className="h-12 w-12 rounded-md object-cover border" />
      ) : (
        <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
          <span className="text-xs text-muted-foreground">No logo</span>
        </div>
      )}
      <div>
        <p className="font-medium text-base sm:text-lg">{invoice.brand_id?.brandName || "—"}</p>
        <p className="text-sm text-muted-foreground">{invoice.brand_id?.businessName || ""}</p>
      </div>
    </div>
  </CardContent>
</Card>





{invoice.previous_payments && invoice.previous_payments.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle>Previous Payments</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="rounded-md border overflow-x-auto">
        <Table className="text-sm sm:text-base">
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead>Payment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.previous_payments
              .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
              .map(payment => (
                <TableRow key={payment._id}>
                  <TableCell>{invoice.currency} {Number(payment.amount).toLocaleString()}</TableCell>
                  <TableCell>{payment.payment_method || "N/A"}</TableCell>
                  <TableCell>{payment.remark || "N/A"}</TableCell>
                  <TableCell>{payment.payment_date ? format(new Date(payment.payment_date), "MMMM dd, yyyy") : "N/A"}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
)}


      <Card>
        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3">

          <div className="flex justify-between text-base sm:text-lg font-medium pt-3 border-t">
            <span className="text-muted-foreground text-sm sm:text-base">Initial Amount</span>
            <span className="font-normal">{invoice.currency} {Number(invoice.subtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-base sm:text-lg font-medium pt-3 border-t">
            <span className="text-muted-foreground text-sm sm:text-base">Discount</span>
            <span className="font-normal">- {invoice.currency} {Number(invoice.discount_amount).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-base sm:text-lg font-medium pt-3 border-t">
            <span className="text-muted-foreground text-sm sm:text-base">Amount for services</span>
            <span className="font-normal">{invoice.currency} {Number(invoice.amountForServices).toFixed(2)}</span>
          </div>
          
          {taxes.map(tax => (
            <div key={tax._id} className="flex justify-between text-base sm:text-lg font-medium pt-3 border-t">
              <span className="text-muted-foreground text-sm sm:text-base">{tax.tax_name} ({tax.tax_percentage}%)</span>
              <span className='font-normal'>{invoice.currency} {Number(tax.tax_amount).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-base sm:text-lg font-medium pt-3 border-t">
            <span>Grand Total</span>
            <span>{invoice.currency} {Number(invoice.grand_total).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>


<div className="flex justify-center sm:justify-end mt-6">
  <Button
    variant="outline"
    className="px-6"
    onClick={() => navigate("/invoices")}
  >
    Cancel
  </Button>
</div>

    </div>
  );
}
