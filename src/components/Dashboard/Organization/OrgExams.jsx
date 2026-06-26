import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Plus, FileText, Calendar, Clock, Award } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgExams = () => {
  const { orgId } = useParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', examDate: '', startTime: '', endTime: '', totalMarks: 100, passingMarks: 40, examType: 'other' });
  const [submitting, setSubmitting] = useState(false);

  const fetchExams = async () => {
    try {
      const res = await api.get(`/api/v1/organizations/${orgId}/exams`);
      setExams(res.data.data);
    } catch {
      toast.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, [orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/api/v1/organizations/${orgId}/exams`, form);
      toast.success("Exam created");
      setShowCreate(false);
      setForm({ title: '', description: '', examDate: '', startTime: '', endTime: '', totalMarks: 100, passingMarks: 40, examType: 'other' });
      fetchExams();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create exam");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (s) => ({ scheduled: 'bg-blue-100 text-blue-700', in_progress: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-700');
  const getTypeColor = (t) => ({ midterm: 'bg-orange-100 text-orange-700', final: 'bg-red-100 text-red-700', quiz: 'bg-green-100 text-green-700', unit_test: 'bg-blue-100 text-blue-700' }[t] || 'bg-gray-100 text-gray-700');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exams</h2>
          <p className="text-muted-foreground mt-1">Schedule exams and track examination results.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Create Exam
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : exams.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Exams</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Schedule your first exam to assess student performance.</p>
            <Button onClick={() => setShowCreate(true)}><Plus className="mr-2 h-4 w-4" /> Create First Exam</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <Card key={exam._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription className="mt-1">{exam.description || 'No description'}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(exam.examType)}`}>{exam.examType}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(exam.status)}`}>{exam.status}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{new Date(exam.examDate).toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-1"><Clock className="h-4 w-4" /><span>{exam.startTime} - {exam.endTime}</span></div>
                  <div className="flex items-center gap-1"><Award className="h-4 w-4" /><span>{exam.totalMarks} marks</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Create Exam</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="title">Exam Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="examType">Type</Label>
                <select id="examType" value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm">
                  <option value="quiz">Quiz</option>
                  <option value="unit_test">Unit Test</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="practical">Practical</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="examDate">Date *</Label>
                <Input id="examDate" type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input id="startTime" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input id="endTime" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input id="totalMarks" type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="passingMarks">Passing Marks</Label>
                <Input id="passingMarks" type="number" value={form.passingMarks} onChange={(e) => setForm({ ...form, passingMarks: Number(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Exam'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgExams;
