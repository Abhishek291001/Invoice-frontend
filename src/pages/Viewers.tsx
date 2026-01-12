import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Search, Edit, Eye, Trash } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import API_BASE_URL from '../Apiconfig/ApiConfig.ts'

export default function Viewers() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [viewers, setViewers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); 

  useEffect(() => {
    fetchViewers();
  }, []);

const fetchViewers = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API_BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Viewers fetched:", res.data);

    
    const usersArray = Array.isArray(res.data) ? res.data : res.data.users || [];

    
    const onlyViewers = usersArray.filter((user) => user.role === "viewer");

    setViewers(onlyViewers);
  } catch (error: any) {
    console.error("Error fetching viewers:", error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to fetch viewers",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const filteredViewers = viewers.filter(viewer =>
    viewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    viewer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canCreateViewer = userRole === 'superadmin' || userRole === 'admin';

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }


//   const handleDeleteViewer = async (e, viewerId) => {
//   e.stopPropagation();

//   const confirmDelete = window.confirm(
//     "Are you sure you want to delete this viewer?"
//   );
//   if (!confirmDelete) return;

//   try {
//     await axios.delete(
//       `http://localhost:5000/api/users/${viewerId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     // ✅ remove viewer from UI instantly
//     setViewers((prev) =>
//       prev.filter((viewer) => viewer._id !== viewerId)
//     );

//     toast({
//       title: "Viewer Deleted",
//       description: "Viewer deleted successfully",
//     });
//   } catch (error: any) {
//     toast({
//       title: "Error",
//       description:
//         error.response?.data?.message || "Failed to delete viewer",
//       variant: "destructive",
//     });
//   }
// };


const handleDeleteViewer = async (e, viewerId) => {
  e.stopPropagation();

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this viewer?"
  );
  if (!confirmDelete) return;

  try {
    await axios.delete(
      `${API_BASE_URL}/api/users/${viewerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // remove viewer instantly
    setViewers((prev) =>
      prev.filter((viewer) => viewer._id !== viewerId)
    );

    toast.success("Viewer deleted successfully");
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Failed to delete viewer"
    );
  }
};


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Viewers</h1>
          <p className="text-muted-foreground">Manage your viewer information</p>
        </div>
        {canCreateViewer && (
          <Button onClick={() => navigate('/viewers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Viewer
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search viewers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredViewers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No viewers found.</p>
              {canCreateViewer && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/viewers/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Viewer
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
                    <TableHead>Business Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredViewers.map((viewer) => (
                    <TableRow key={viewer._id || viewer.id} className="cursor-pointer hover:bg-muted/50" onClick={() =>navigate(`/viewers/${viewer._id || viewer.id}`)} >
                      <TableCell className="font-medium">{viewer.name}</TableCell>
                      <TableCell>{viewer.email || '-'}</TableCell>
                      <TableCell>{viewer.phoneNumber || viewer.phone || '-'}</TableCell>
                      <TableCell>{viewer.role || '-'}</TableCell>
                      <TableCell>{viewer.businessName || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/viewers/${viewer._id || viewer.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button> */}
                          {canCreateViewer && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
    e.stopPropagation();
                                navigate(`/viewers/${viewer._id || viewer.id}/edit`)}}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}


                         <Button
  variant="ghost"
  size="sm"
onClick={(e) => {
    e.stopPropagation();
  handleDeleteViewer(e, viewer._id || viewer.id)}}
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
