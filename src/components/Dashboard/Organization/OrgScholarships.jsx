import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, Award } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgScholarships = () => {
  const { orgId } = useParams();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/scholarships`);
        setScholarships(res.data.data);
      } catch {
        toast.error("Failed to fetch scholarships");
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, [orgId]);

  const getStatusColor = (s) => ({
    active: 'bg-green-100 text-green-700', paused: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-100 text-red-700'
  }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scholarships</h2>
          <p className="text-muted-foreground mt-1">Manage scholarships and financial aid.</p>
        </div>
        <Button className="shadow-sm"><Plus className="mr-2 h-4 w-4" /> Create Scholarship</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : scholarships.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Scholarships</h3>
            <p className="text-muted-foreground max-w-sm">Create scholarships to support students.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((sch) => (
            <Card key={sch._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{sch.name}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(sch.status)}`}>{sch.status}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>Type:</span><span className="capitalize">{sch.type}</span></div>
                  <div className="flex justify-between"><span>Value:</span><span>{sch.type === 'percentage' ? `${sch.value}%` : `৳${sch.value}`}</span></div>
                  {sch.totalBudget && <div className="flex justify-between"><span>Budget:</span><span>৳{sch.totalBudget.toLocaleString()}</span></div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgScholarships;
