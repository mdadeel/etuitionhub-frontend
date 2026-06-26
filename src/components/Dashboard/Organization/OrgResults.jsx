import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Plus, Award, TrendingUp, BarChart } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgResults = () => {
  const { orgId } = useParams();
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedExam, setSelectedExam] = useState('');
  const [marks, setMarks] = useState([{ studentId: '', marksObtained: '', totalMarks: '' }]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [resultsRes, examsRes] = await Promise.all([
        api.get(`/api/v1/organizations/${orgId}/results`),
        api.get(`/api/v1/organizations/${orgId}/exams`)
      ]);
      setResults(resultsRes.data.data);
      setExams(examsRes.data.data);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [orgId]);

  const addRow = () => setMarks([...marks, { studentId: '', marksObtained: '', totalMarks: '' }]);
  const removeRow = (i) => setMarks(marks.filter((_, idx) => idx !== i));
  const updateRow = (i, field, value) => {
    const updated = [...marks];
    updated[i][field] = value;
    setMarks(updated);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedExam) return toast.error("Select an exam");
    const validMarks = marks.filter((m) => m.studentId && m.marksObtained);
    if (validMarks.length === 0) return toast.error("Add at least one result");
    setSubmitting(true);
    try {
      await api.post(`/api/v1/organizations/${orgId}/results/exams/${selectedExam}`, {
        results: validMarks.map((m) => ({ studentId: m.studentId, marksObtained: Number(m.marksObtained), totalMarks: Number(m.totalMarks) || 100 }))
      });
      toast.success("Results entered");
      setShowCreate(false);
      setSelectedExam('');
      setMarks([{ studentId: '', marksObtained: '', totalMarks: '' }]);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to enter results");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (examId) => {
    try {
      await api.patch(`/api/v1/organizations/${orgId}/results/exams/${examId}/publish`);
      toast.success("Results published");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to publish");
    }
  };

  const getStatusColor = (s) => ({ published: 'bg-green-100 text-green-700', draft: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Results</h2>
          <p className="text-muted-foreground mt-1">Enter exam results and publish grades.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Enter Results
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : results.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Results</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Enter exam results to track student performance.</p>
            <Button onClick={() => setShowCreate(true)}><Plus className="mr-2 h-4 w-4" /> Enter First Results</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      {result.examId?.title || 'Exam'}
                    </CardTitle>
                    <CardDescription className="mt-1">{result.studentId?.userId?.displayName || 'Student'}</CardDescription>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(result.status)}`}>{result.status}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><BarChart className="h-4 w-4" /><span>{result.marksObtained}/{result.totalMarks}</span></div>
                  {result.isPassed !== undefined && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-4 w-4 ${result.isPassed ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={result.isPassed ? 'text-green-600' : 'text-red-600'}>{result.isPassed ? 'Passed' : 'Failed'}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Enter Results</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="exam">Exam *</Label>
              <select id="exam" value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm" required>
                <option value="">Select exam...</option>
                {exams.map((ex) => (
                  <option key={ex._id} value={ex._id}>{ex.title} ({new Date(ex.examDate).toLocaleDateString()})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Results</Label>
              {marks.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input placeholder="Student ID" value={m.studentId} onChange={(e) => updateRow(i, 'studentId', e.target.value)} className="flex-1" />
                  <Input placeholder="Marks" type="number" value={m.marksObtained} onChange={(e) => updateRow(i, 'marksObtained', e.target.value)} className="w-24" />
                  <Input placeholder="Total" type="number" value={m.totalMarks} onChange={(e) => updateRow(i, 'totalMarks', e.target.value)} className="w-24" />
                  {marks.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(i)}>✕</Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addRow}>+ Add Row</Button>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Entering...' : 'Enter Results'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgResults;
