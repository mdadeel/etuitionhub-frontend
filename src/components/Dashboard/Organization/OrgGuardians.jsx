import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Plus, Users, Phone, Mail, Link, Trash2 } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgGuardians = () => {
  const { orgId } = useParams();
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', relationship: 'parent' });
  const [submitting, setSubmitting] = useState(false);

  const fetchGuardians = async () => {
    try {
      const res = await api.get(`/api/v1/organizations/${orgId}/guardians`);
      setGuardians(res.data.data);
    } catch {
      toast.error("Failed to fetch guardians");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuardians(); }, [orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/api/v1/organizations/${orgId}/guardians`, form);
      toast.success("Guardian added");
      setShowCreate(false);
      setForm({ name: '', phone: '', email: '', relationship: 'parent' });
      fetchGuardians();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add guardian");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (guardianId) => {
    if (!confirm("Remove this guardian?")) return;
    try {
      await api.delete(`/api/v1/organizations/${orgId}/guardians/${guardianId}`);
      toast.success("Guardian removed");
      fetchGuardians();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to remove guardian");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guardians</h2>
          <p className="text-muted-foreground mt-1">Manage parent/guardian accounts and student links.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Guardian
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : guardians.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Guardians</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Add guardians to enable parent monitoring.</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add First Guardian
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guardians.map((guardian) => (
            <Card key={guardian._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{guardian.name}</span>
                  <span className="text-xs font-normal px-2 py-1 bg-teal-100 text-teal-700 rounded-full capitalize">{guardian.relationship}</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {guardian.phone}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {guardian.email && (
                    <div className="flex items-center gap-1"><Mail className="h-4 w-4" /><span>{guardian.email}</span></div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleDelete(guardian._id)}>
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
          <DialogHeader><DialogTitle>Add Guardian</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="name">Guardian Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="relationship">Relationship</Label>
              <select id="relationship" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm">
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="spouse">Spouse</option>
                <option value="other">Other</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Guardian'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgGuardians;
