import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, Users, Mail, GraduationCap, Download, Upload, Loader2 } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgStudents = () => {
  const { orgId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/students`);
        setStudents(res.data.data);
      } catch {
        toast.error("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [orgId]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const res = await api.get(`/api/v1/organizations/${orgId}/students/export`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `students-${orgId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Students exported");
    } catch {
      toast.error("Failed to export students");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        setImporting(true);
        const text = await file.text();
        const lines = text.split('\n').filter(Boolean);
        if (lines.length < 2) {
          toast.error("CSV must have a header row and at least one student");
          return;
        }
        const students = lines.slice(1).map((line) => {
          const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          return { email: cols[1] || cols[0] };
        });
        const res = await api.post(`/api/v1/organizations/${orgId}/students/import`, { students });
        const { created, skipped, errors } = res.data.data;
        toast.success(`Imported: ${created} created, ${skipped} skipped${errors?.length ? `, ${errors.length} errors` : ''}`);
        window.location.reload();
      } catch {
        toast.error("Failed to import students");
      } finally {
        setImporting(false);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground mt-1">
            Manage student enrollment and track academic progress.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm" onClick={handleExport} disabled={exporting}>
            {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export
          </Button>
          <Button variant="outline" className="shadow-sm" onClick={handleImport} disabled={importing}>
            {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Import
          </Button>
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : students.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              No students are enrolled yet. Students will appear here once they join your organization.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{student.userId?.displayName || 'Student'}</span>
                  <span className="text-xs font-normal px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    Active
                  </span>
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {student.userId?.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{student.classIds?.length || 0} Classes</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">View Profile</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgStudents;
