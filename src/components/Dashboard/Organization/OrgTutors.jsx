import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Plus, Users, Mail, BookOpen, Clock, BarChart } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgTutors = () => {
  const { orgId } = useParams();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWorkload, setShowWorkload] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [workloadData, setWorkloadData] = useState(null);
  const [workloadForm, setWorkloadForm] = useState({ weekStart: '', scheduledClasses: '', completedClasses: '', hoursWorked: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/tutors`);
        setTutors(res.data.data);
      } catch {
        toast.error("Failed to fetch tutors");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, [orgId]);

  const openWorkload = async (tutor) => {
    setSelectedTutor(tutor);
    setShowWorkload(true);
    try {
      const res = await api.get(`/api/v1/organizations/${orgId}/tutors/${tutor._id}/workload`);
      setWorkloadData(res.data.data);
    } catch {
      setWorkloadData([]);
    }
  };

  const handleUpdateWorkload = async (e) => {
    e.preventDefault();
    if (!selectedTutor) return;
    setSubmitting(true);
    try {
      await api.put(`/api/v1/organizations/${orgId}/tutors/${selectedTutor._id}/workload`, {
        weekStart: workloadForm.weekStart || new Date().toISOString().split('T')[0],
        scheduledClasses: Number(workloadForm.scheduledClasses) || 0,
        completedClasses: Number(workloadForm.completedClasses) || 0,
        hoursWorked: Number(workloadForm.hoursWorked) || 0
      });
      toast.success("Workload updated");
      setShowWorkload(false);
      setWorkloadForm({ weekStart: '', scheduledClasses: '', completedClasses: '', hoursWorked: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update workload");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tutors</h2>
          <p className="text-muted-foreground mt-1">Manage tutor assignments and track workload.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : tutors.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Tutors</h3>
            <p className="text-muted-foreground max-w-sm">No tutors are assigned yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <Card key={tutor._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{tutor.userId?.displayName || 'Tutor'}</span>
                  <span className="text-xs font-normal px-2 py-1 bg-primary/10 text-primary rounded-full">Teacher</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {tutor.userId?.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1"><BookOpen className="h-4 w-4" /><span>{tutor.classIds?.length || 0} Classes</span></div>
                  <div className="flex items-center gap-1"><Clock className="h-4 w-4" /><span>{tutor.subjectIds?.length || 0} Subjects</span></div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => openWorkload(tutor)}>
                    <BarChart className="mr-1 h-4 w-4" /> Workload
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showWorkload} onOpenChange={setShowWorkload}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Workload — {selectedTutor?.userId?.displayName}</DialogTitle>
          </DialogHeader>
          {workloadData && workloadData.length > 0 && (
            <div className="space-y-2 mb-4">
              {workloadData.slice(0, 4).map((w, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                  <span>{w.weekStart?.split('T')[0]}</span>
                  <span>{w.hoursWorked}h / {w.scheduledClasses} classes</span>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleUpdateWorkload} className="space-y-4">
            <div>
              <Label htmlFor="weekStart">Week Start</Label>
              <Input id="weekStart" type="date" value={workloadForm.weekStart} onChange={(e) => setWorkloadForm({ ...workloadForm, weekStart: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduledClasses">Scheduled</Label>
                <Input id="scheduledClasses" type="number" value={workloadForm.scheduledClasses} onChange={(e) => setWorkloadForm({ ...workloadForm, scheduledClasses: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="completedClasses">Completed</Label>
                <Input id="completedClasses" type="number" value={workloadForm.completedClasses} onChange={(e) => setWorkloadForm({ ...workloadForm, completedClasses: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input id="hoursWorked" type="number" value={workloadForm.hoursWorked} onChange={(e) => setWorkloadForm({ ...workloadForm, hoursWorked: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowWorkload(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Updating...' : 'Update Workload'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgTutors;
