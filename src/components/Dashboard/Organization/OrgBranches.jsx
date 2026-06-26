import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Plus, MapPin, Building, Trash2 } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgBranches = () => {
  const { orgId } = useParams();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', district: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchBranches = async () => {
    try {
      const res = await api.get(`/api/v1/organizations/${orgId}/branches`);
      setBranches(res.data.data);
    } catch {
      toast.error("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBranches(); }, [orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/api/v1/organizations/${orgId}/branches`, form);
      toast.success("Branch created");
      setShowCreate(false);
      setForm({ name: '', address: '', district: '', phone: '', email: '' });
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create branch");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (branchId) => {
    if (!confirm("Delete this branch?")) return;
    try {
      await api.delete(`/api/v1/organizations/${orgId}/branches/${branchId}`);
      toast.success("Branch deleted");
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete branch");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Branches</h2>
          <p className="text-muted-foreground mt-1">Manage multiple branches and assign branch managers.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Branch
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : branches.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Branches</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Add branches to manage multiple locations.</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add First Branch
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card key={branch._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{branch.name}</span>
                  <span className={`text-xs font-normal px-2 py-1 rounded-full ${branch.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </span>
                </CardTitle>
                {branch.address && (
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {branch.address}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {branch.district && <span>{branch.district}</span>}
                  {branch.phone && <span>{branch.phone}</span>}
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleDelete(branch._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Branch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="name">Branch Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district">District</Label>
                <Input id="district" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Branch'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgBranches;
