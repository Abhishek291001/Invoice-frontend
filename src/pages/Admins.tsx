import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Search, Edit, Eye, Trash } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import API_BASE_URL from '../Apiconfig/ApiConfig.ts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { toast } from 'sonner';

const getErrorMessage = (error: any, fallback: string) => {
  const msg = error?.response?.data?.message;

  if (typeof msg === "string") return msg;
  if (typeof msg === "object" && msg?.description) return msg.description;

  return fallback;
};


export default function Admins() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); 

  useEffect(() => {
    fetchAdmins();
  }, []);

const fetchAdmins = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API_BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Admins fetched:", res.data);

    const usersArray = Array.isArray(res.data) ? res.data : res.data.users || [];

    const onlyAdmins = usersArray.filter((user) => user.role === "admin");

    setAdmins(onlyAdmins);
  } catch (error: any) {
    console.error("Error fetching admins:", error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to fetch admins",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canCreateAdmin = userRole === 'superadmin' || userRole === 'admin';

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }


//   const handleDeleteAdmin = async (e, adminId) => {
//   e.stopPropagation();

//   const confirmDelete = window.confirm(
//     "Are you sure you want to delete this admin?"
//   );
//   if (!confirmDelete) return;

//   try {
//     await axios.delete(
//       `${API_BASE_URL}/api/users/${adminId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     // ✅ Remove admin from table immediately
//     setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));

//     toast({
//       title: "Admin Deleted",
//       description: "Admin deleted successfully",
//     });
//   } catch (error: any) {
//     toast({
//       title: "Error",
//       description:
//         error.response?.data?.message || "Failed to delete admin",
//       variant: "destructive",
//     });
//   }
// };


const handleDeleteAdmin = async (e, adminId) => {
  e.stopPropagation();

  if (!window.confirm("Are you sure you want to delete this admin?")) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/users/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));

    toast.success("Admin deleted successfully");
  } catch (error: any) {
    toast.error(getErrorMessage(error, "Failed to delete admin"));
  }
};




  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
          <p className="text-muted-foreground">Manage your admin information</p>
        </div>
        {canCreateAdmin && (
          <Button onClick={() => navigate('/admins/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admins by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAdmins.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No admins found.</p>
              {canCreateAdmin && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/admins/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Admin
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin._id || admin.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admins/${admin._id || admin.id}`)}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email || '-'}</TableCell>
                      <TableCell>{admin.phoneNumber || admin.phone || '-'}</TableCell>
                      <TableCell>{admin.role || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admins/${admin._id || admin.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button> */}
                          {canCreateAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                { 
                                  e.stopPropagation();
                                  navigate(`/admins/${admin._id || admin.id}/edit`)}}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
  variant="ghost"
  size="sm"
  onClick={(e) => handleDeleteAdmin(e, admin._id || admin.id)}
>
  <Trash className="h-4 w-4 text-red-500" />
</Button>


                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
