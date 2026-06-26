import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Plus, GraduationCap, Calendar, CheckCircle } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgEnrollments = () => {
  const { orgId } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ studentId: '', courseId: '', batchId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const fetchData = async () => {
    try {
      const [enrollRes, studentsRes, coursesRes] = await Promise.all([
        api.get(`/api/v1/organizations/${orgId}/enrollments`),
        api.get(`/api/v1/organizations/${orgId}/students`),
        api.get(`/api/v1/organizations/${orgId}/courses`)
      ]);
      setEnrollments(enrollRes.data.data);
      setStudents(studentsRes.data.data);
      setCourses(coursesRes.data.data);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/api/v1/organizations/${orgId}/enrollments`, form);
      toast.success("Enrollment created");
      setShowCreate(false);
      setForm({ studentId: '', courseId: '', batchId: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create enrollment");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (s) => ({ active: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', completed: 'bg-blue-100 text-blue-700', dropped: 'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Enrollments</h2>
          <p className="text-muted-foreground mt-1">Track student enrollments in courses and batches.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> New Enrollment
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : enrollments.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Enrollments</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Enroll students in courses to track their progress.</p>
            <Button onClick={() => setShowCreate(true)}><Plus className="mr-2 h-4 w-4" /> Create First Enrollment</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <Card key={enrollment._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      {enrollment.enrollmentNumber || 'Enrollment'}
                    </CardTitle>
                    <CardDescription className="mt-1">{enrollment.courseId?.name || 'Course'} — {enrollment.batchId?.name || 'Batch'}</CardDescription>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(enrollment.status)}`}>{enrollment.status}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</span></div>
                  {enrollment.enrollmentFeePaid && (
                    <div className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /><span>Fee Paid</span></div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>New Enrollment</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="studentId">Student *</Label>
              <select id="studentId" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm" required>
                <option value="">Select student...</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>{s.userId?.displayName || s.userId?.email}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="courseId">Course *</Label>
              <select id="courseId" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm" required>
                <option value="">Select course...</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Enrolling...' : 'Create Enrollment'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgEnrollments;
