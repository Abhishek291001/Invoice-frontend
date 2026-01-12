import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Edit, Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import API_BASE_URL from '../../Apiconfig/ApiConfig.ts'

export default function Brands() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const canManage = userRole === "superadmin" || userRole === "admin";

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const brandRes = await axios.get(`${API_BASE_URL}/api/brands`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });

    
      const mappedBrands = brandRes.data.map((b: any) => ({
        id: b._id,
        brandName: b.brandName,
        businessName: b.businessName,
        accountNo: b.accountNo,
        ifscCode: b.ifscCode,
        gstin: b.gstin,
        addressLine: b.addressLine,
        prefix: b.prefix,
        country: b.country,
        email: b.email,
        website: b.website,
        brandLogo: b.brandLogo || "",
      }));

      setBrands(mappedBrands);
    } catch (err: any) {
      console.error("Error fetching brands:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = brands.filter((b) =>
    b.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }


  
// const handleDeleteBrand = async (e, brandId) => {
//   e.stopPropagation(); // 🔴 important if row becomes clickable later

//   const confirmed = window.confirm(
//     "Are you sure you want to delete this brand? This action cannot be undone."
//   );
//   if (!confirmed) return;

//   try {
//     await axios.delete(
//       `http://localhost:5000/api/brands/${brandId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     toast({
//       title: "Brand Deleted",
//       description: "The brand has been removed successfully.",
//     });

//     // ✅ remove from UI
//     setBrands((prev) => prev.filter((b) => b.id !== brandId));
//   } catch (err: any) {
//     toast({
//       title: "Error",
//       description: err.message || "Failed to delete brand",
//       variant: "destructive",
//     });
//   }
// };


const handleDeleteBrand = async (e, brandId) => {
  e.stopPropagation();

  const confirmed = window.confirm(
    "Are you sure you want to delete this brand? This action cannot be undone."
  );
  if (!confirmed) return;

  try {
    await axios.delete(
      `${API_BASE_URL}/api/brands/${brandId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // remove from UI
    setBrands((prev) => prev.filter((b) => b.id !== brandId));

    toast.success("Brand deleted successfully");
  } catch (err: any) {
    toast.error(err.message || "Failed to delete brand");
  }
};



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Brands</h1>
        {canManage && (
          <Button onClick={() => navigate("/brands/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input
                placeholder="Search by brand name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table className="cursor-pointer">
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id} onClick={() => navigate(`/brands/${b.id}`)}>
                  <TableCell>
                    {b.brandLogo ? (
                      <img
                        src={b.brandLogo}
                        alt={b.brandName}
                        className="h-10 w-10 rounded object-cover border"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        No Logo
                      </div>
                    )}
                  </TableCell>

                  <TableCell>{b.brandName}</TableCell>
                  <TableCell>{b.email}</TableCell>
                  <TableCell>{b.country}</TableCell>

                  <TableCell className="text-right">
                    {/* <Button variant="ghost" onClick={() => navigate(`/brands/${b.id}`)}>
                      <Eye />
                    </Button> */}

                    

                    {canManage && (
                      <Button
                        variant="ghost"
                        onClick={(e) =>{
                          e.stopPropagation();
navigate(`/brands/${b.id}/edit`)}
                        } >
                        <Edit />
                      </Button>



                    )}


                    {canManage && (
  <Button
    variant="ghost"
         onClick={(e) =>{
                          e.stopPropagation(); 
                          handleDeleteBrand(e, b.id)}}>
    <Trash className="text-red-500" />
  </Button>
)}


                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

