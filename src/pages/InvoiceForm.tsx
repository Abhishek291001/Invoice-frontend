import { useEffect, useState,useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { Download } from "lucide-react";
import { generateInvoicePDF } from "@/lib/pdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils";
import API_BASE_URL from '../Apiconfig/ApiConfig.ts'

const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'AUD'];
const statuses = ["pending", "paid", "partially-paid", "cancelled"];

export default function InvoiceForm() {
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
    const isViewOnly = !!id && !isEdit;
const [showClientDropdown, setShowClientDropdown] = useState(false);
const clientDropdownRef = useRef<HTMLDivElement>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
const [showAddClientModal, setShowAddClientModal] = useState(false);
const [openClientPopover, setOpenClientPopover] = useState(false);
const filteredClients = clients.filter(client => 
  client.name.toLowerCase().includes(clientSearch.toLowerCase())
);
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
      setShowClientDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

const [newClientData, setNewClientData] = useState({
  name: '',
  email: '',
  phoneNumber: '',
  currency_preference: 'INR',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  gst_number: '',
  
});
const [creatingClient, setCreatingClient] = useState(false);



  const [formData, setFormData] = useState({
    invoice_number: '',
    client_id: '',
    brand_id: '',       
    invoice_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    currency: 'INR',
    discount_type: 'flat' as 'flat' | 'percentage',
    discount_amount: 0,
    status: 'pending' as any,
    notes: '',
    terms_and_conditions: '',
    
  });

 

  const generateInvoiceNumber = (brandId: string, lastInvoiceNumberOfTheDay?: string) => {
  const brand = brands.find(b => b.id === brandId);
  const prefix = brand?.prefix || '';
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  let sequence = 1;
  if (lastInvoiceNumberOfTheDay) {
    
    const parts = lastInvoiceNumberOfTheDay.split('-');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) sequence = lastSeq + 1;
  }

  return `${prefix}-${yyyy}${mm}${dd}-${sequence}`;
};

  const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: 0 }]);
  const [taxes, setTaxes] = useState<{ tax_name: string; tax_percentage: number }[]>([]);


const fetchBrands = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/brands`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch brands');

    const data = await res.json();

  
    const mappedBrands = data.map((b: any) => ({
      id: b._id,           
      brandName: b.brandName || b.brand_name || '', 
      businessName: b.businessName || '',
      accountNo: b.accountNo || '',
      ifscCode: b.ifscCode || '',
      gstin: b.gstin || '',
      addressLine1: b.addressLine || '',
      prefix: b.prefix || '',
      country: b.country || '',
      email: b.email || '',
      website: b.website || '',
      brandLogo: b.brandLogo || '',
    }));

    setBrands(mappedBrands);

   
    if (!isEdit && mappedBrands.length > 0) {
      setFormData(prev => ({ ...prev, brand_id: mappedBrands[0].id }));
    }
  } catch (err) {
    console.error('Error loading brands:', err);
  }
};



const fetchLastInvoice = async (brandId: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/api/invoices/last/${brandId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  return data.lastInvoiceNumber;
};




useEffect(() => {
  const loadInvoiceNumber = async () => {
    if (!isEdit && brands.length > 0 && formData.brand_id) {
      const lastNumber = await fetchLastInvoice(formData.brand_id);

      setFormData(prev => ({
        ...prev,
        invoice_number: generateInvoiceNumber(prev.brand_id, lastNumber)
      }));
    }
  };

  loadInvoiceNumber();
}, [brands, formData.brand_id]);



const fetchClients = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/clients`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch clients');

    const data = await res.json();
    setClients(data || []);
    if (!isEdit && data?.length > 0) {
      setFormData(prev => ({ ...prev, client_id: data[0].id, currency: data[0].currency_preference || 'INR' }));
        setClientSearch(data[0].name);
    }

  } catch (err) {
    console.error('Error fetching clients:', err);
  }
};


  
const fetchInvoice = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axios.get(`${API_BASE_URL}/api/invoices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data;

    
    setFormData({
      invoice_number: data.invoice_number || '',
      client_id: data.client_id?._id || data.client_id || '',
      brand_id: data.brand_id?._id || data.brand_id || '',
      invoice_date: data.invoice_date ? format(new Date(data.invoice_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      due_date: data.due_date ? format(new Date(data.due_date), 'yyyy-MM-dd') : format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      currency: data.currency || 'INR',
      discount_type: data.discount_type || 'flat',
      discount_amount: data.discount_amount || 0,
      status: data.status || 'pending',
      notes: data.notes || '',
      terms_and_conditions: data.terms_and_conditions || '',
      due_amount: data.due_amount || 0,
    });

    setItems(data.items || [{ description: '', quantity: 1, unit_price: 0 }]);
    setTaxes(data.taxes || []);

    const clientObj = clients.find(c => c._id === (data.client_id?._id || data.client_id));
    if (clientObj) setClientSearch(clientObj.name);

  } catch (err: any) {
    console.error("Error fetching invoice:", err);
    toast({ title: "Error", description: "Failed to fetch invoice", variant: "destructive" });
  }
};


useEffect(() => {
  const loadData = async () => {
    await fetchBrands();
    await fetchClients();
    if (isEdit) await fetchInvoice();
  };
  loadData();
}, [id]);


const handleDownload = async () => {
  try {
    if (!isEdit) {
      toast({
        title: "Not Allowed",
        description: "You can download PDF only after saving the invoice.",
        variant: "destructive",
      });
      return;
    }


    const invoiceData = {
      ...formData,
      items,
      taxes,
      subtotal,
      discount_amount: discountAmount,
      grand_total: grandTotal,
      tax_total: taxTotal,
    };

    const clientData = clients.find(c => c._id === formData.client_id);
    const brandData = brands.find(b => b.id === formData.brand_id);

    if (!clientData || !brandData) {
      toast({
        title: "Error",
        description: "Client or Brand data missing",
        variant: "destructive",
      });
      return;
    }

    const pdfBlob = await generateInvoicePDF(
      invoiceData,
      clientData,
      items,
      taxes,
      brandData
    );

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceData.invoice_number}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Success", description: "PDF downloaded" });
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Error",
      description: err.message || "Failed to generate PDF",
      variant: "destructive",
    });
  }
};

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const discountAmount = formData.discount_type === 'percentage' ? subtotal * (formData.discount_amount / 100) : formData.discount_amount;
    const taxableAmount = subtotal - discountAmount;
    const taxTotal = taxes.reduce((sum, tax) => sum + taxableAmount * (tax.tax_percentage / 100), 0);
    const grandTotal = taxableAmount + taxTotal;
    return { subtotal, discountAmount, taxableAmount, taxTotal, grandTotal };
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  if (!formData.client_id || !formData.brand_id) {
    toast({ title: 'Error', description: 'Client and Brand are required', variant: 'destructive' });
    setLoading(false);
    return;
  }

  const { subtotal, discountAmount, taxTotal, grandTotal } = calculateTotals();

    const itemsWithAmount = items.map(item => ({
    ...item,
    amount: item.quantity * item.unit_price,
  }));

  const payload = {
    ...formData,
    subtotal,
    discount_amount: discountAmount,
    tax_total: taxTotal,
    grand_total: grandTotal,
    items: itemsWithAmount,
    
  };

  try {
    const url = isEdit ? `${API_BASE_URL}/api/invoices/${id}` : `${API_BASE_URL}/api/invoices`;
    const method = isEdit ? 'PATCH' : 'POST';
    const token = localStorage.getItem('token'); 

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to save invoice');
    }

    const savedInvoice = await res.json();
    toast({ title: 'Success', description: `Invoice ${isEdit ? 'updated' : 'created'} successfully` });
    
    navigate(`/invoices/${savedInvoice.invoice?._id || savedInvoice._id}`);

  } catch (err: any) {
    console.error(err);
    toast({ title: 'Error', description: err.message || 'Failed to save invoice', variant: 'destructive' });
  } finally {
    setLoading(false);
  }
};

const handleDelete = async () => {
  if (!id) return;

  const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${API_BASE_URL}/api/invoices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast({
      title: "Invoice Deleted",
      description: "The invoice has been removed successfully.",
    });

    navigate("/invoices");
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Error",
      description: err.message || "Failed to delete invoice",
      variant: "destructive",
    });
  }
};

  const addItem = () => setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const addTax = () => setTaxes([...taxes, { tax_name: 'GST', tax_percentage: 18 }]);
  const removeTax = (index: number) => setTaxes(taxes.filter((_, i) => i !== index));
  const updateTax = (index: number, field: string, value: any) => {
    const newTaxes = [...taxes];
    (newTaxes[index] as any)[field] = value;
    setTaxes(newTaxes);
  };

  const { subtotal, discountAmount, taxableAmount, taxTotal, grandTotal } = calculateTotals();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentData, setPaymentData] = useState({
  remark: '',
  amount: 0,
  payment_method: 'Cash',
  payment_date: format(new Date(), 'yyyy-MM-dd'),
  id: '', 
});
const paymentMethods = ['Cash', 'Bank Transfer', 'Card', 'UPI'];



const handleSavePayment = async () => {
  try {
    const token = localStorage.getItem('token');

    
    const res = await fetch(`${API_BASE_URL}/api/invoices/${id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!res.ok) throw new Error('Failed to save payment');

    toast({ title: 'Success', description: 'Payment added successfully' });
    setShowPaymentModal(false);

  
    fetchInvoice();

  } catch (err: any) {
    toast({ title: 'Error', description: err.message || 'Failed to save payment', variant: 'destructive' });
  }
};


const handleDeletePayment = async (paymentId: string) => {
  try {
    const confirmDelete = window.confirm('Are you sure you want to delete this payment?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    await fetch(`${API_BASE_URL}/api/invoices/${id}/payments/${paymentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    toast({ title: 'Payment Deleted', description: 'Payment removed successfully' });
    setShowPaymentModal(false);
    fetchInvoice();
  } catch (err: any) {
    toast({ title: 'Error', description: err.message || 'Failed to delete payment', variant: 'destructive' });
  }
};




  return (
<>
<Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>{paymentData.id ? "Edit Payment" : "Add Payment"}</DialogTitle>
    </DialogHeader>

    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={paymentData.amount}
          onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
        />
      </div>

      <div>
        <Label htmlFor="payment_method">Payment Method</Label>
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
        <Label htmlFor="payment_date">Payment Date</Label>
        <Input
          id="payment_date"
          type="date"
          value={paymentData.payment_date}
          onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="remark">Remark</Label>
        <Textarea
          id="remark"
          value={paymentData.remark}
          onChange={(e) => setPaymentData({ ...paymentData, remark: e.target.value })}
        />
      </div>
    </div>

    <DialogFooter className="flex space-x-2">
      {paymentData.id && (
        <Button variant="destructive" onClick={() => handleDeletePayment(paymentData.id)}>
          Delete Payment
        </Button>
      )}
      <Button onClick={handleSavePayment}>
        {paymentData.id ? "Update Payment" : "Add Payment"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


{showAddClientModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
   
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowAddClientModal(false)}
    ></div>

   

    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 z-10">
  <h2 className="text-xl font-bold mb-4">Add New Client</h2>

  <form
    onSubmit={async (e) => {
      e.preventDefault();
      setCreatingClient(true);
      try {
        const token = localStorage.getItem('token');

        const payload = {
          name: newClientData.name,
          email: newClientData.email,
          phoneNumber: newClientData.phoneNumber || '',
          currencyPreference: newClientData.currencyPreference || 'INR',
          gstNumber: newClientData.gstNumber || '',
          
          address: {
            street: newClientData.street || '',
            city: newClientData.city,
            state: newClientData.state || '',
            country: newClientData.country,
            postalCode: newClientData.postalCode || ''
          }
        };

        const res = await fetch(`${API_BASE_URL}/api/clients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Failed to create client');

        const createdClient = await res.json();
        // setClients((prev) => [...prev, createdClient.client]);
        setClients((prev) => [createdClient.client, ...prev]);

        toast({ title: 'Success', description: 'Client created successfully' });

        setShowAddClientModal(false);
        setNewClientData({
          name: '',
          email: '',
          phoneNumber: '',
          currencyPreference: 'INR',
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          gstNumber: '',
         
        });
      } catch (err: any) {
        toast({ title: 'Error', description: err.message || 'Failed to create client', variant: 'destructive' });
      } finally {
        setCreatingClient(false);
      }
    }}
    className="space-y-4"
  >

   
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div>
        <Label>Name *</Label>
        <Input
          value={newClientData.name}
          onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
          required
        />
      </div>

     
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={newClientData.email}
          onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
        />
      </div>

      
      <div>
        <Label>Phone</Label>
        <Input
          value={newClientData.phoneNumber}
          onChange={(e) => setNewClientData({ ...newClientData, phoneNumber: e.target.value })}
        />
      </div>

     
      <div>
        <Label>Currency Preference</Label>
        <Select
          value={newClientData.currencyPreference}
          onValueChange={(value) => setNewClientData({ ...newClientData, currencyPreference: value })}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {currencies.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Street</Label>
        <Input
          value={newClientData.street || ''}
          onChange={(e) => setNewClientData({ ...newClientData, street: e.target.value })}
        />
      </div>

    
      <div>
        <Label>City *</Label>
        <Input
          value={newClientData.city || ''}
          onChange={(e) => setNewClientData({ ...newClientData, city: e.target.value })}
          required
        />
      </div>

  
      <div>
        <Label>State</Label>
        <Input
          value={newClientData.state || ''}
          onChange={(e) => setNewClientData({ ...newClientData, state: e.target.value })}
        />
      </div>

   
      <div>
        <Label>Country *</Label>
        <Input
          value={newClientData.country || ''}
          onChange={(e) => setNewClientData({ ...newClientData, country: e.target.value })}
          required
        />
      </div>

     
      <div>
        <Label>Postal Code</Label>
        <Input
          value={newClientData.postalCode || ''}
          onChange={(e) => setNewClientData({ ...newClientData, postalCode: e.target.value })}
        />
      </div>

      <div>
        <Label>GST Number</Label>
        <Input
          value={newClientData.gstNumber || ''}
          onChange={(e) => setNewClientData({ ...newClientData, gstNumber: e.target.value })}
        />
      </div>

    

    </div>

    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={() => setShowAddClientModal(false)}>Cancel</Button>
      <Button type="submit" disabled={creatingClient}>
        {creatingClient ? 'Creating...' : 'Create Client'}
      </Button>
    </div>

  </form>
</div>

  </div>
)}


    
    <div className="space-y-6">

      
     <div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    <Button variant="ghost" size="sm" onClick={() => navigate('/invoices')}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {isEdit ? "Edit Invoice" : "Create New Invoice"}
      </h1>
      <p className="text-muted-foreground">Fill in the invoice details</p>
      
    </div>
  </div>

<div className="flex space-x-2">
   {isEdit && (
  <div
    className={`px-3 py-1 rounded-lg font-semibold text-lg text-red-600 bg-destructive/10 text-destructive
    }`}
  >
    Due Amount: {formData.due_amount ? formData.due_amount.toLocaleString() : 0}
  </div>
)}

  {isEdit && (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" /> Download PDF
    </Button>
  )}
  {isEdit && (
    <Button variant="secondary" onClick={() => setShowPaymentModal(true)}>
      <Plus className="h-4 w-4 mr-2" /> Make Payment
    </Button>
  )}
</div>

</div>


      <form onSubmit={handleSubmit} className="space-y-6">
        
        <Card>
          <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
        
<div className="space-y-2">
  <Label>Brand *</Label>

  <Select 
  value={formData.brand_id} 
  onValueChange={(value) => {
    setFormData(prev => ({
      ...prev, 
      brand_id: value,
         invoice_number: prev.invoice_number || (!isEdit ? generateInvoiceNumber(value) : prev.invoice_number)
    }));
  }}
>

    <SelectTrigger>
      <SelectValue placeholder="Select brand" />
    </SelectTrigger>

    <SelectContent>
      {brands.map((b, i) => (
        <SelectItem 
          key={`brand-${b.id}-${i}`} 
          value={b.id}
        >
          {b.brandName}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>



<div className="space-y-2">
  <Label>Client *</Label>

  <Popover open={openClientPopover} onOpenChange={setOpenClientPopover}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        className="w-full justify-between"
      >
        {formData.client_id
          ? clients.find((c) => c._id === formData.client_id)?.name
          : "Select client"}
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-full p-0">
      <Command>
        <CommandInput placeholder="Search clients..." />
        <CommandEmpty>No client found.</CommandEmpty>
        {/* Add Client Button */}
        <div className="p-2 border-t">
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              setShowAddClientModal(true);
              setOpenClientPopover(false);
            }}
            className="flex items-center gap-1 w-full justify-center"
          >
            <Plus className="h-4 w-auto" /> Add Client
          </Button>
        </div>
        <CommandGroup>
          {clients.map((client) => (
            <CommandItem
              key={client._id}
              value={client.name}
              onSelect={() => {
                setFormData((prev) => ({
                  ...prev,
                  client_id: client._id,
                  currency: client.currency_preference || "INR",
                }));
                setOpenClientPopover(false);
              }}
            >
              {client.name}
              <Check
                className={cn(
                  "ml-auto h-4 w-4",
                  client._id === formData.client_id ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>


      </Command>
    </PopoverContent>
  </Popover>
</div>


 <div className="space-y-2">
                <Label htmlFor="invoice_number">Invoice Number *</Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Invoice Date *</Label>
                <Input type="date" value={formData.invoice_date} onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })} required />
              </div>
           
              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} required />
              </div>
          
              <div className="space-y-2">
                <Label>Currency *</Label>
        <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>
    {currencies.map((c, i) => (
      <SelectItem key={`currency-${c}-${i}`} value={c}>
        {c}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
              </div>


            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Add Items</CardTitle>
            
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-1 grid gap-4 md:grid-cols-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Description *</Label>
                    <Input value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} required placeholder="Item description" />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input type="number" min="0" step="0.01" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', parseFloat(e.target.value) )} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price *</Label>
                    <Input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateItem(i, 'unit_price', parseFloat(e.target.value) )} required />
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)} disabled={items.length === 1} className="mt-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="pt-4 border-t flex items-center justify-between">
  
  <Button 
    type="button"
    variant="outline"
    size="sm"
    onClick={addItem}
  >
    <Plus className="h-4 w-4 mr-2" /> Add Item
  </Button>

  <div className="text-right">
    <p className="text-sm text-muted-foreground">Subtotal</p>
    <p className="text-lg font-semibold">
      {formData.currency} {subtotal.toFixed(2)}
    </p>
  </div>
</div>

          </CardContent>
        </Card>

       
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Discounts</CardTitle>
            
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select value={formData.discount_type} onValueChange={(value: 'flat' | 'percentage') => setFormData({ ...formData, discount_type: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input type="number" min="0" step="0.01" value={formData.discount_amount} onChange={(e) => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Discount Amount</Label>
                <Input value={`${formData.currency} ${discountAmount.toFixed(2)}`} disabled />
              </div>
            </div>

           
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-end gap-9"><span className="text-muted-foreground">Subtotal</span><span className="font-sm">{formData.currency} {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-end gap-6"><span className="text-muted-foreground">Discount</span><span className="font-sm">- {formData.currency} {discountAmount.toFixed(2)}</span></div>
              <div className="flex justify-end gap-6 text-lg"><span className="text-black font-medium ">Amount</span><span className="font-medium">{formData.currency} {taxableAmount.toFixed(2)}</span></div>
     
            </div>
          </CardContent>
        </Card>

        <Card>
  <CardHeader>
    <CardTitle>Additional Information</CardTitle>
  </CardHeader>

  <CardContent>
    <div className="flex gap-4">
      
      <div className="flex-1 space-y-2">
        <Label>Notes</Label>
        <Textarea 
          rows={3}
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
        />
      </div>

      <div className="flex-1 space-y-2">
        <Label>Terms and Conditions</Label>
        <Textarea 
          rows={3}
          value={formData.terms_and_conditions}
          onChange={(e) =>
            setFormData({ ...formData, terms_and_conditions: e.target.value })
          }
        />
      </div>
    </div>
  </CardContent>
</Card>


        <div className="flex justify-end gap-2">
           <Button
    type="button"
    variant="outline"
    onClick={() => navigate("/invoices")}
  >
    Cancel
  </Button>
  {isEdit && (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
    >
      Delete
    </Button>
  )}

  <Button type="submit" disabled={loading}>
    {isEdit ? "Update Invoice" : "Create Invoice"}
  </Button>

 
</div>


      </form>
    </div>
    </>
  );
}








