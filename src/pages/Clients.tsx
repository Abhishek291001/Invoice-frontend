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

export default function Clients() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchClients();
  }, []);
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clients`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log(response.data)
      setClients(response.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canCreateClient = userRole === 'superadmin' || userRole === 'admin';

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }


//   const handleDeleteClient = async (e, clientId) => {
//   e.stopPropagation();

//   const confirmed = window.confirm(
//     "Are you sure you want to delete this client? This action cannot be undone."
//   );
//   if (!confirmed) return;

//   try {
//     await axios.delete(
//       `http://localhost:5000/api/clients/${clientId}`,
//       {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : undefined,
//         },
//       }
//     );

//     toast({
//       title: "Client Deleted",
//       description: "Client deleted successfully",
//     });

//     // ✅ remove from UI immediately
//     setClients((prev) => prev.filter((c) => c._id !== clientId));
//   } catch (error: any) {
//     toast({
//       title: "Error",
//       description:
//         error.response?.data?.message || "Failed to delete client",
//       variant: "destructive",
//     });
//   }
// };


const handleDeleteClient = async (e, clientId) => {
  e.stopPropagation();

  const confirmed = window.confirm(
    "Are you sure you want to delete this client? This action cannot be undone."
  );
  if (!confirmed) return;

  try {
    await axios.delete(
      `${API_BASE_URL}/api/clients/${clientId}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    toast.success("Client deleted successfully");

    setClients((prev) => prev.filter((c) => c._id !== clientId));
  } catch (error: any) {
    const message =
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : error.response?.data?.message?.description ||
          "Failed to delete client";

    toast.error(message);
  }
};


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client information</p>
        </div>
        {canCreateClient && (
          <Button onClick={() => navigate('/clients/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No clients found.</p>
              {canCreateClient && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/clients/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Client
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
                    <TableHead>Country</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow
                      key={client._id}
                      onClick={() => navigate(`/clients/${client._id}`)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email || '-'}</TableCell>
                      <TableCell>{client.phoneNumber  || '-'}</TableCell>
                      <TableCell>{client.address?.country|| '-'}</TableCell>
                      <TableCell>{client.currencyPreference  || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/clients/${client._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button> */}

                          

                          {canCreateClient && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>{
                                e.stopPropagation();
                                   navigate(`/clients/${client._id}/edit`)
                              }
                               
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}

                           <Button
  variant="ghost"
  size="sm"
  onClick={(e) => handleDeleteClient(e, client._id)}
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
