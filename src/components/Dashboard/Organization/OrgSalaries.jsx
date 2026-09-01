import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, DollarSign, CheckCircle } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgSalaries = () => {
  const { orgId } = useParams();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/salaries`);
        setSalaries(res.data.data);
      } catch {
        toast.error("Failed to fetch salaries");
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, [orgId]);

  const getStatusColor = (s) => ({
    paid: 'bg-green-100 text-green-700', approved: 'bg-primary/10 text-primary',
    pending_approval: 'bg-yellow-100 text-yellow-700', draft: 'bg-gray-100 text-gray-700'
  }[s] || 'bg-gray-100 text-gray-700');

  const handleApprove = async (salaryId) => {
    try {
      await api.patch(`/api/v1/organizations/${orgId}/salaries/${salaryId}/approve`);
      toast.success("Salary approved");
      setSalaries(salaries.map(s => s._id === salaryId ? { ...s, status: 'approved' } : s));
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to approve");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Salaries</h2>
          <p className="text-muted-foreground mt-1">Manage tutor salary payments.</p>
        </div>
        <Button className="shadow-sm"><Plus className="mr-2 h-4 w-4" /> Create Salary</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : salaries.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Salaries</h3>
            <p className="text-muted-foreground max-w-sm">Salary records will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {salaries.map((sal) => (
            <Card key={sal._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{sal.tutorId?.userId?.displayName || 'Tutor'}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Month: {sal.month}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(sal.status)}`}>{sal.status}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-6 text-muted-foreground">
                    <span>Base: ৳{sal.baseSalary?.toLocaleString()}</span>
                    <span>Net: ৳{sal.netPay?.toLocaleString()}</span>
                  </div>
                  {sal.status === 'pending_approval' && (
                    <Button size="sm" onClick={() => handleApprove(sal._id)}>
                      <CheckCircle className="mr-1 h-4 w-4" /> Approve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgSalaries;
