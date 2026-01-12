// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { FileText, DollarSign, AlertCircle, Plus } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
// import { Badge } from '@/components/ui/badge';
// import { format } from 'date-fns';
// import axios from 'axios';

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const { userRole } = useAuth();
//   const [stats, setStats] = useState({
//     totalInvoices: 0,
//     totalRevenue: 0,
//     pendingAmount: 0,
//     pendingCount: 0,
//   });
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const recentRes = await axios.get(
//         "http://localhost:5000/api/invoices/recent",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const recentInvoices = recentRes.data.invoices || [];

//       const allRes = await axios.get(
//         "http://localhost:5000/api/invoices",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const allInvoices = allRes.data || [];

//       const totalInvoices = allInvoices.length;
//       const totalRevenue = allInvoices
//         .filter((inv) => inv.status === "paid")
//         .reduce((sum, inv) => sum + Number(inv.grand_total), 0);

//       const pendingAmount = allInvoices
//         .filter((inv) => inv.status === "pending")
//         .reduce((sum, inv) => sum + Number(inv.grand_total), 0);

//       const pendingCount = allInvoices.filter((inv) => inv.status === "pending").length;

//       setStats({ totalInvoices, totalRevenue, pendingAmount, pendingCount });
//       setRecentInvoices(recentInvoices);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'paid': return 'bg-green-500/10 text-green-500';
//       case 'partially-paid': return 'bg-blue-500/10 text-blue-500';
//       case 'pending': return 'bg-destructive/10 text-destructive';
//       case 'cancelled': return 'bg-muted text-muted-foreground';
//       default: return '';
//     }
//   };

//   const canCreateInvoice = userRole === 'superadmin' || userRole === 'admin';

//   if (loading) {
//     return <div className="flex items-center justify-center h-96">Loading...</div>;
//   }

//   return (
//     <div className="space-y-6">
    
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here's an overview of your invoices.</p>
//         </div>
//         {canCreateInvoice && (
//           <Button onClick={() => navigate('/invoices/new')}>
//             <Plus className="h-4 w-4 mr-2" />
//             New Invoice
//           </Button>
//         )}
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
//             <FileText className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalInvoices}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹{stats.pendingAmount.toFixed(2)}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
//             <AlertCircle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-destructive">{stats.pendingCount}</div>
//           </CardContent>
//         </Card>
//       </div>

     
// <Card className="w-full">
//   <CardHeader className="pb-2">
//     <div className="flex items-center justify-between gap-2">
//       <CardTitle className="text-lg">Recent Invoices</CardTitle>
//       <Button 
//         variant="outline" 
//         size="sm" 
//         className="h-8 px-3 text-sm"
//         onClick={() => navigate('/invoices')}
//       >
//         View All
//       </Button>
//     </div>
//   </CardHeader>
//   <CardContent className="p-2">
//     {recentInvoices.length === 0 ? (
//       <p className="text-center text-muted-foreground py-4">No invoices yet. Create your first one!</p>
//     ) : (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
//         {recentInvoices.slice(0, 6).map((invoice) => (
//           <div
//             key={invoice._id}
//             className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors flex flex-col justify-between"
//             onClick={() => navigate(`/invoices/${invoice._id}`)}
//           >
//             <div>
//               <div className="flex items-center gap-1">
//                 <p className="font-medium text-sm">{invoice.invoice_number}</p>
//                 <Badge className={getStatusColor(invoice.status)}>
//                   {invoice.status}
//                 </Badge>
//               </div>
//               <p className="text-xs text-muted-foreground">{invoice.client_id?.name || 'Unknown Client'}</p>
//               <p className="text-xs text-muted-foreground">{format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}</p>
//             </div>
//             <div className="text-right mt-1">
//               <p className="font-semibold text-sm">{invoice.currency} {Number(invoice.grand_total).toFixed(2)}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </CardContent>
// </Card>

//     </div>
//   );
// }





















// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { FileText, DollarSign, AlertCircle, Plus } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
// import { Badge } from '@/components/ui/badge';
// import { format } from 'date-fns';
// import axios from 'axios';

// import API_BASE_URL from '../Apiconfig/ApiConfig.ts'

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const { userRole } = useAuth();
//   const [stats, setStats] = useState({
//     totalInvoices: 0,
//     totalRevenue: 0,
//     pendingAmount: 0,
//     pendingCount: 0,
//   });
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // const fetchDashboardData = async () => {
//   //   try {
//   //     const token = localStorage.getItem("token");

//   //     const recentRes = await axios.get(
//   //       "http://localhost:5000/api/invoices/recent",
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );

//   //     const recentInvoices = recentRes.data.invoices || [];

//   //     const allRes = await axios.get(
//   //       "http://localhost:5000/api/invoices",
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
//   //     // const allInvoices = allRes.data || [];
//   //     const allInvoices = allRes.data.invoices || [];

//   //     const totalInvoices = allInvoices.length;
//   //     const totalRevenue = allInvoices
//   //       .filter((inv) => inv.status === "paid")
//   //       .reduce((sum, inv) => sum + Number(inv.grand_total), 0);

//   //     const pendingAmount = allInvoices
//   //       .filter((inv) => inv.status === "pending")
//   //       .reduce((sum, inv) => sum + Number(inv.grand_total), 0);

//   //     const pendingCount = allInvoices.filter((inv) => inv.status === "pending").length;

//   //     setStats({ totalInvoices, totalRevenue, pendingAmount, pendingCount });
//   //     setRecentInvoices(recentInvoices);
//   //   } catch (error) {
//   //     console.error("Error fetching dashboard data:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };



//   const fetchDashboardData = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     // 1️⃣ Recent invoices (for cards list)
//     const recentRes = await axios.get(
//       `${API_BASE_URL}/api/invoices/recent`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setRecentInvoices(recentRes.data.invoices || []);

//     // 2️⃣ Dashboard stats (backend-calculated)
//     const statsRes = await axios.get(
//       `${API_BASE_URL}/api/invoices/stats`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setStats(statsRes.data);

//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//   } finally {
//     setLoading(false);
//   }
// };



//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'paid': return 'bg-green-500/10 text-green-500';
//       case 'partially-paid': return 'bg-blue-500/10 text-blue-500';
//       case 'pending': return 'bg-destructive/10 text-destructive';
//       case 'cancelled': return 'bg-muted text-muted-foreground';
//       default: return '';
//     }
//   };

//   const canCreateInvoice = userRole === 'superadmin' || userRole === 'admin';

//   if (loading) {
//     return <div className="flex items-center justify-center h-96">Loading...</div>;
//   }

//   return (
//     <div className="space-y-6">
    
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here's an overview of your invoices.</p>
//         </div>
//         {canCreateInvoice && (
//           <Button onClick={() => navigate('/invoices/new')}>
//             <Plus className="h-4 w-4 mr-2" />
//             New Invoice
//           </Button>
//         )}
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
//             <FileText className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalInvoices}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹{stats.pendingAmount.toFixed(2)}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
//             <AlertCircle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-destructive">{stats.pendingCount}</div>
//           </CardContent>
//         </Card>
//       </div>

     
// <Card className="w-full">
//   <CardHeader className="pb-2">
//     <div className="flex items-center justify-between gap-2">
//       <CardTitle className="text-lg">Recent Invoices</CardTitle>
//       <Button 
//         variant="outline" 
//         size="sm" 
//         className="h-8 px-3 text-sm"
//         onClick={() => navigate('/invoices')}
//       >
//         View All
//       </Button>
//     </div>
//   </CardHeader>
//   <CardContent className="p-2">
//     {recentInvoices.length === 0 ? (
//       <p className="text-center text-muted-foreground py-4">No invoices yet. Create your first one!</p>
//     ) : (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
//         {recentInvoices.slice(0, 6).map((invoice) => (
//           <div
//             key={invoice._id}
//             className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors flex flex-col justify-between"
//             onClick={() => navigate(`/invoices/${invoice._id}`)}
//           >
//             <div>
//               <div className="flex items-center gap-1">
//                 <p className="font-medium text-sm">{invoice.invoice_number}</p>
//                 <Badge className={getStatusColor(invoice.status)}>
//                   {invoice.status}
//                 </Badge>
//               </div>
//               <p className="text-xs text-muted-foreground">{invoice.client_id?.name || 'Unknown Client'}</p>
//               <p className="text-xs text-muted-foreground">{format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}</p>
//             </div>
//             <div className="text-right mt-1">
//               <p className="font-semibold text-sm">{invoice.currency} {Number(invoice.grand_total).toFixed(2)}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </CardContent>
// </Card>

//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, AlertCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import axios from "axios";
import API_BASE_URL from "../Apiconfig/ApiConfig.ts";
import MultiCurrencyStatCard from "@/components/ui/MultiCurrencyStatCard";




import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const token = localStorage.getItem("token");

  // const [stats, setStats] = useState({
  //   totalInvoices: 0,
  //   totalRevenue: 0,
  //   pendingAmount: 0,
  //   pendingCount: 0,
  // });

  const [stats, setStats] = useState({
  totalInvoices: 0,
  totalRevenue: {},
  pendingAmount: {},
  pendingCount: 0,
});

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💳 Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [paymentData, setPaymentData] = useState({
    remark: "",
    amount: 0,
    payment_method: "Cash",
    payment_date: format(new Date(), "yyyy-MM-dd"),
  });

  const paymentMethods = ["Cash", "Bank Transfer", "Card", "UPI"];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const recentRes = await axios.get(
        `${API_BASE_URL}/api/invoices/recent`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const statsRes = await axios.get(
        `${API_BASE_URL}/api/invoices/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecentInvoices(recentRes.data.invoices || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentData({
      remark: "",
      amount: invoice.due_amount || 0,
      payment_method: "Cash",
      payment_date: format(new Date(), "yyyy-MM-dd"),
    });
    setShowPaymentModal(true);
  };

  const handleSavePayment = async () => {
    try {
      if (!selectedInvoice) return;

      const res = await fetch(
        `${API_BASE_URL}/api/invoices/${selectedInvoice._id}/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({
        title: "Success",
        description: "Payment added successfully",
      });

      setShowPaymentModal(false);
      fetchDashboardData();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to save payment",
        variant: "destructive",
      });
    }
  };

  const handleRazorpayPayment = async (invoice) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/invoices/${invoice._id}/pay-link`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      window.open(data.paymentLink, "_blank");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create payment link",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500";
      case "partially-paid":
        return "bg-blue-500/10 text-blue-500";
      case "pending":
        return "bg-destructive/10 text-destructive";
      case "cancelled":
        return "bg-muted text-muted-foreground";
      default:
        return "";
    }
  };

  const canCreateInvoice =
    userRole === "superadmin" || userRole === "admin";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your invoices.
          </p>
        </div>
        {canCreateInvoice && (
          <Button onClick={() => navigate("/invoices/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        )}
      </div>

      {/* Stats */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Invoices" value={stats.totalInvoices} icon={FileText} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Pending Amount" value={`₹${stats.pendingAmount.toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Pending Invoices" value={stats.pendingCount} icon={AlertCircle} danger />
      </div> */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <StatCard
    title="Total Invoices"
    value={stats.totalInvoices}
    icon={FileText}
  />

  <MultiCurrencyStatCard
    title="Total Revenue"
    data={stats.totalRevenue}
    icon={DollarSign}
  />

  <MultiCurrencyStatCard
    title="Pending Amount"
    data={stats.pendingAmount}
    icon={DollarSign}
  />

  <StatCard
    title="Pending Invoices"
    value={stats.pendingCount}
    icon={AlertCircle}
    danger
  />
</div>

      {/* Recent Invoices */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">Recent Invoices</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/invoices")}>
            View All
          </Button>
          </div>
        </CardHeader>

        <CardContent className="grid sm:grid-cols-2 gap-4">
          {recentInvoices.slice(0, 6).map((invoice) => (
            <div
              key={invoice._id}
              className="relative p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
              onClick={() => navigate(`/invoices/${invoice._id}`)}
            >
              {canCreateInvoice && invoice.due_amount > 0 && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPaymentModal(invoice);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}

              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {invoice.invoice_number}
                </span>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                {invoice.client_id?.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {format(new Date(invoice.invoice_date), "MMM dd, yyyy")}
              </p>

              <div className="text-right mt-2">
                <p className="font-semibold text-sm">
                  {invoice.currency}{" "}
                  {Number(invoice.grand_total).toFixed(2)}
                </p>
                {invoice.due_amount > 0 && (
                  <p className="text-xs text-red-500">
                    Due: {invoice.currency}{" "}
                    {Number(invoice.due_amount).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={paymentData.amount}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, amount: +e.target.value })
                }
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select
                value={paymentData.payment_method}
                onValueChange={(v) =>
                  setPaymentData({ ...paymentData, payment_method: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Payment Date</Label>
              <Input
                type="date"
                value={paymentData.payment_date}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    payment_date: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Remark</Label>
              <Textarea
                value={paymentData.remark}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, remark: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSavePayment}>Add Payment</Button>
            <Button
              disabled={!selectedInvoice || selectedInvoice.due_amount <= 0}
              onClick={() => handleRazorpayPayment(selectedInvoice)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Pay via Razorpay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* Small helper */
function StatCard({ title, value, icon: Icon, danger }) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${danger ? "text-destructive" : ""}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
