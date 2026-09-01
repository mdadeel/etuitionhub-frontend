import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, Receipt } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgExpenses = () => {
  const { orgId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/expenses`);
        setExpenses(res.data.data);
      } catch {
        toast.error("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [orgId]);

  const getStatusColor = (s) => ({
    paid: 'bg-green-100 text-green-700', approved: 'bg-primary/10 text-primary',
    pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700'
  }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground mt-1">Track and manage organization expenses.</p>
        </div>
        <Button className="shadow-sm"><Plus className="mr-2 h-4 w-4" /> Add Expense</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : expenses.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Expenses</h3>
            <p className="text-muted-foreground max-w-sm">Record expenses to track spending.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {expenses.map((exp) => (
            <Card key={exp._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{exp.description}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Category: {exp.category}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(exp.status)}`}>{exp.status}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>৳{exp.amount?.toLocaleString()}</span>
                  <span>{new Date(exp.expenseDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgExpenses;
