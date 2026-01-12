import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import API_BASE_URL from '../../Apiconfig/ApiConfig.ts'

export default function BrandDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userRole } = useAuth();

  const [brand, setBrand] = useState({
    brandName: "",
    businessName: "",
    accountNo: "",
    ifscCode: "",
    gstin: "",
    addressLine: "",
    prefix: "",
    country: "",
    email: "",
    website: "",
    brandLogo: "",
    id: "",
  });

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const canEdit = userRole === "superadmin" || userRole === "admin";

  useEffect(() => {
    if (id) loadBrand();
  }, [id]);

  const loadBrand = async () => {
    try {
      setLoading(true);

      
     const brandRes = await axios.get(`${API_BASE_URL}/api/brands`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // required if auth is enabled
  },
});
setBrand(brandRes.data);


      
      const invoicesRes = await axios.get(`${API_BASE_URL}/api/invoices?brandId=${id}`);
      setInvoices(invoicesRes.data || []);
    } catch (err: any) {
      console.error("Error fetching brand data:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const saveBrand = async () => {
    try {
      setSaving(true);
      await axios.patch(`${API_BASE_URL}/api/brands/${id}`, brand);
      setEditing(false);
    } catch (err: any) {
      console.error("Error updating brand:", err.message || err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500";
      case "sent":
        return "bg-blue-500/10 text-blue-500";
      case "overdue":
        return "bg-destructive/10 text-destructive";
      case "draft":
      case "cancelled":
        return "bg-muted text-muted-foreground";
      default:
        return "";
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (!brand) {
    return <div className="text-center py-12">Brand not found</div>;
  }

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/brands")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            {editing ? (
              <input
                className="text-3xl font-bold tracking-tight border-b border-gray-300"
                value={brand.brandName}
                onChange={(e) => setBrand({ ...brand, brandName: e.target.value })}
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">{brand.brandName}</h1>
            )}
            <p className="text-muted-foreground">Brand Details</p>
          </div>
        </div>

        {canEdit && (
          editing ? (
            <div className="flex gap-2">
              <Button onClick={saveBrand} disabled={saving}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Brand
            </Button>
          )
        )}
      </div>

      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <span className="text-sm font-medium text-muted-foreground">Business Name:</span>
              <br />
              {editing ? (
                <input
                  className="w-full border px-2 py-1 rounded"
                  value={brand.businessName}
                  onChange={(e) => setBrand({ ...brand, businessName: e.target.value })}
                />
              ) : (
                brand.businessName || "N/A"
              )}
            </p>

            <p>
              <span className="text-sm font-medium text-muted-foreground">Email:</span>
              <br />
              {editing ? (
                <input
                  className="w-full border px-2 py-1 rounded"
                  value={brand.email}
                  onChange={(e) => setBrand({ ...brand, email: e.target.value })}
                />
              ) : (
                brand.email || "N/A"
              )}
            </p>

            <p>
              <span className="text-sm font-medium text-muted-foreground">Website:</span>
              <br />
              {editing ? (
                <input
                  className="w-full border px-2 py-1 rounded"
                  value={brand.website}
                  onChange={(e) => setBrand({ ...brand, website: e.target.value })}
                />
              ) : (
                brand.website || "N/A"
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <span className="text-sm font-medium text-muted-foreground">Account No.</span>
              <br />
              {editing ? (
                <input
                  className="w-full border px-2 py-1 rounded"
                  value={brand.accountNo}
                  onChange={(e) => setBrand({ ...brand, accountNo: e.target.value })}
                />
              ) : (
                brand.accountNo || "N/A"
              )}
            </p>

            <p>
              <span className="text-sm font-medium text-muted-foreground">IFSC:</span>
              <br />
              {editing ? (
                <input
                  className="w-full border px-2 py-1 rounded"
                  value={brand.ifscCode}
                  onChange={(e) => setBrand({ ...brand, ifscCode: e.target.value })}
                />
              ) : (
                brand.ifscCode || "N/A"
              )}
            </p>

            <p>
              <span className="text-sm font-medium text-muted-foreground">GSTIN:</span>
              <br />
              {editing ? (
                <input
                  className="w-full border px-2 py-1 rounded"
                  value={brand.gstin}
                  onChange={(e) => setBrand({ ...brand, gstin: e.target.value })}
                />
              ) : (
                brand.gstin || "N/A"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {editing ? (
            <>
              <input
                className="w-full border px-2 py-1 rounded"
                value={brand.addressLine}
                onChange={(e) => setBrand({ ...brand, addressLine: e.target.value })}
              />
              <input
                className="w-full border px-2 py-1 rounded"
                value={brand.prefix}
                onChange={(e) => setBrand({ ...brand, prefix: e.target.value })}
              />
              <input
                className="w-full border px-2 py-1 rounded"
                value={brand.country}
                onChange={(e) => setBrand({ ...brand, country: e.target.value })}
              />
            </>
          ) : (
            <>
               <p>{brand.addressLine}</p>
               <p>{brand.prefix || "N/A"}</p> 
               <p>{brand.country}</p>
            </>
          )}
        </CardContent>
      </Card>

     
      <Card>
        <CardHeader>
          <CardTitle>Invoices ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No invoices generated for this brand yet.
            </p>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{invoice.invoice_number}</p>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(invoice.invoice_date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold">
                    {invoice.currency} {Number(invoice.grand_total).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
