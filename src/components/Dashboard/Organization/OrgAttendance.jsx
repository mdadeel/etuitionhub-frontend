import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";

const OrgAttendance = () => {
  const { orgId } = useParams();
  const { hasPermission } = useAuth();
  const canMark = hasPermission('attendance:mark');
  const [summary, setSummary] = useState(null);
  const [lowAttendance, setLowAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const [summaryRes, lowRes] = await Promise.all([
          api.get(`/api/v1/organizations/${orgId}/attendance/summary`, {
            params: { startDate: date, endDate: date }
          }),
          api.get(`/api/v1/organizations/${orgId}/attendance/low`).catch(() => ({ data: { data: [] } }))
        ]);
        setSummary(summaryRes.data.data);
        setLowAttendance(lowRes.data.data || []);
      } catch {
        toast.error("Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [orgId, date]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground mt-1">
            Track student attendance and view reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
            aria-label="Select Date"
          />
          {canMark && <Button>Mark Attendance</Button>}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Students</CardDescription>
              <CardTitle className="text-2xl">{summary.total || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" /> Present
              </CardDescription>
              <CardTitle className="text-2xl text-green-600">{summary.present || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" /> Absent
              </CardDescription>
              <CardTitle className="text-2xl text-red-600">{summary.absent || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-yellow-500" /> Attendance Rate
              </CardDescription>
              <CardTitle className="text-2xl">{summary.attendanceRate || 0}%</CardTitle>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Attendance Data</h3>
            <p className="text-muted-foreground max-w-sm">
              No attendance has been recorded for this date.
            </p>
          </CardContent>
        </Card>
      )}

      {lowAttendance.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" /> Low Attendance Alerts
            </CardTitle>
            <CardDescription className="text-yellow-600">
              Students below 75% attendance threshold
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowAttendance.slice(0, 10).map((student, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 bg-white rounded border">
                  <span>{student.studentId?.userId?.displayName || 'Student'}</span>
                  <span className="font-medium text-red-600">{student.attendanceRate}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrgAttendance;
