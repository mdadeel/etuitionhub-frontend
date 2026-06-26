import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, FileText, Calendar } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgInvoices = () => {
  const { orgId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/invoices`);
        setInvoices(res.data.data);
      } catch {
        toast.error("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [orgId]);

  const getStatusColor = (s) => ({
    paid: 'bg-green-100 text-green-700', sent: 'bg-blue-100 text-blue-700',
    overdue: 'bg-red-100 text-red-700', draft: 'bg-gray-100 text-gray-700',
    partially_paid: 'bg-yellow-100 text-yellow-700'
  }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground mt-1">Manage student invoices and payments.</p>
        </div>
        <Button className="shadow-sm"><Plus className="mr-2 h-4 w-4" /> Create Invoice</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : invoices.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Invoices</h3>
            <p className="text-muted-foreground max-w-sm">Create invoices to track student payments.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <Card key={inv._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" /> {inv.invoiceNumber}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Student: {inv.studentId?.userId?.displayName || 'N/A'}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(inv.status)}`}>{inv.status}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>৳{inv.totalAmount?.toLocaleString()}</span>
                  <span>Paid: ৳{inv.paidAmount?.toLocaleString()}</span>
                  <span>Due: ৳{inv.dueAmount?.toLocaleString()}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgInvoices;
