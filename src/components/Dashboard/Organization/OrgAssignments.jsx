import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, FileText, Calendar, Users } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";

const OrgAssignments = () => {
  const { orgId } = useParams();
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('assignment:create');
  const canGrade = hasPermission('assignment:grade');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/assignments`);
        setAssignments(res.data.data);
      } catch {
        toast.error("Failed to fetch assignments");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [orgId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          <p className="text-muted-foreground mt-1">
            Create assignments, track submissions, and grade student work.
          </p>
        </div>
        {canCreate && (
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Create Assignment
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : assignments.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Assignments</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Create your first assignment to get started.
            </p>
            {canCreate && (
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create First Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {assignment.description || 'No description'}
                    </CardDescription>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>Max Grade: {assignment.maxGrade}</span>
                  </div>
                  {assignment.classId && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Class: {assignment.classId.name || 'N/A'}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">Submissions</Button>
                  {canGrade && <Button variant="outline" size="sm">Grade</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgAssignments;
