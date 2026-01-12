import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import API_BASE_URL from '../../Apiconfig/ApiConfig.ts'

export default function BrandForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { userRole: rawRole } = useAuth();
  const userRole = rawRole?.toLowerCase();
  const isEditRoute = location.pathname.includes("/edit");
  const isViewOnly = !!id && !isEditRoute;
  
  const isReadOnly = userRole === "viewer";

  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<any>({
   brandName: "",
    businessName: "",
    accountNo: "",
    ifscCode: "",
    gstin: "",
    addressLine: "",
    prefix: "",
    country: "",
    state: "", 
    email: "",
    website: "",
     brandLogo: "",
     
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

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isEdit) loadBrand();
  }, [id]);

 
  useEffect(() => {
    if (isReadOnly && isEdit) {
      navigate(`/brands/${id}`);
    }
  }, [isReadOnly]);

  const loadBrand = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/brands/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
       setFormData({
        brandName: res.data.brandName || "",
        businessName: res.data.businessName || "",
        accountNo: res.data.accountNo || "",
        ifscCode: res.data.ifscCode || "",
        gstin: res.data.gstin || "",
        addressLine: res.data.addressLine || "",
        prefix: res.data.prefix || "",
        country: res.data.country || "",
  state: res.data.state || "",
        email: res.data.email || "",
        website: res.data.website || "",
        brandLogo: res.data.brandLogo || "",
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to load brand" });
    }
  };


  const saveBrand = async (e: any) => {
  e.preventDefault();
  if (isViewOnly) return;

  setLoading(true);

  try {
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key] ?? "");
    });

   
    if (logoFile) {
      form.append("brandLogo", logoFile);
    }

    const url = isEdit
      ? `${API_BASE_URL}/api/brands/${id}`
      : `${API_BASE_URL}/api/brands`;

    const method = isEdit ? "patch" : "post";

    await axios({
      method,
      url,
      data: form,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    toast({
      title: "Success",
      description: isEdit ? "Brand updated successfully" : "Brand created successfully",
    });

    navigate("/brands");
  } catch (err: any) {
  toast({
    title: "Error",
    description:
      err.response?.data?.message ||
      err.message ||
      "Failed to save brand",
  });
}
finally {
    setLoading(false);
  }
};


  const deleteBrand = async () => {
    if (!isEdit || isViewOnly) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this brand? This action cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/brands/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      toast({ title: "Success", description: "Brand deleted successfully" });
      navigate("/brands");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete brand" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/brands")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {id ? (isEditRoute ? "Edit Brand" : "View Brand") : "Create Brand"}
        </h1>
        <p className="text-muted-foreground">
  {id
    ? isEditRoute
      ? "Update brand details"
      : "Read-only brand details"
    : "Enter brand details"}
</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={saveBrand}>
            
            <div>
              <Label>Brand Logo</Label>

              {!isReadOnly && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
              )}

              {formData.logo_url && (
                <img
                  src={formData.logo_url}
                  alt="Logo"
                  className="h-20 mt-3 rounded border"
                />
              )}
            </div>

           
            {[
              ["Brand Name *", "brandName"],
              ["Business Name", "businessName"],
              ["Email", "email"],
              ["Website", "website"],
              ["GSTIN", "gstin"],
              ["Account No.", "accountNo"],
              ["IFSC Code", "ifscCode"],
            ].map(([label, key]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  value={(formData as any)[key] || ""}
                   disabled={isViewOnly}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  
                />
              </div>
            ))}
<div>
              <Label>Prefix *</Label>
              <Input
                 disabled={isViewOnly}
                value={formData.prefix}
                onChange={(e) =>
                  setFormData({ ...formData, prefix: e.target.value })
                }
              />
            </div>
           
            <div>
              <Label>Address Line </Label>
              <Textarea
                 disabled={isViewOnly}
                value={formData.addressLine || ''}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine: e.target.value })
                }
              />
            </div>


                          <div className="space-y-2">
  <Label htmlFor="state">State *</Label>
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


            <div>
              <Label>Country</Label>
              <Input
                 disabled={isViewOnly}
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>


            <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => navigate('/brands')}>
                            Cancel
                          </Button>
            
                          {!isViewOnly && (
                            <>
                              {id && (
                                <Button type="button" variant="destructive" onClick={deleteBrand }>
                                  Delete
                                </Button>
                              )}
                              <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : isEditRoute ? "Update Brand" : "Create Brand"}
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
