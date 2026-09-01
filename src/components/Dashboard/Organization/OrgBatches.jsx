import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, Layers, Users } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgBatches = () => {
  const { orgId } = useParams();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/batches`);
        setBatches(res.data.data);
      } catch {
        toast.error("Failed to fetch batches");
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, [orgId]);

  const getStatusColor = (s) => ({
    active: 'bg-green-100 text-green-700', upcoming: 'bg-primary/10 text-primary',
    completed: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-100 text-red-700'
  }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Batches</h2>
          <p className="text-muted-foreground mt-1">Manage course batches and schedules.</p>
        </div>
        <Button className="shadow-sm"><Plus className="mr-2 h-4 w-4" /> Add Batch</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : batches.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Layers className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Batches</h3>
            <p className="text-muted-foreground max-w-sm">Create batches to organize students into groups.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <Card key={batch._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{batch.name}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(batch.status)}`}>{batch.status}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{batch.courseId?.name || 'Course'}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span>{batch.currentEnrollment || 0}/{batch.maxStudents || '∞'}</span></div>
                  {batch.schedule?.days && <span>{batch.schedule.days.join(', ')}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgBatches;
