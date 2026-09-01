import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, Calendar, CheckCircle } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgAcademicYears = () => {
  const { orgId } = useParams();
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/academic-years`);
        setYears(res.data.data);
      } catch {
        toast.error("Failed to fetch academic years");
      } finally {
        setLoading(false);
      }
    };
    fetchYears();
  }, [orgId]);

  const getStatusColor = (s) => ({
    active: 'bg-green-100 text-green-700', upcoming: 'bg-primary/10 text-primary',
    completed: 'bg-gray-100 text-gray-700'
  }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Academic Years</h2>
          <p className="text-muted-foreground mt-1">Manage academic years and terms.</p>
        </div>
        <Button className="shadow-sm"><Plus className="mr-2 h-4 w-4" /> Add Academic Year</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : years.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Academic Years</h3>
            <p className="text-muted-foreground max-w-sm">Create an academic year to organize your calendar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {years.map((year) => (
            <Card key={year._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {year.isCurrent && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {year.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(year.startDate).toLocaleDateString()} — {new Date(year.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(year.status)}`}>{year.status}</span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgAcademicYears;
