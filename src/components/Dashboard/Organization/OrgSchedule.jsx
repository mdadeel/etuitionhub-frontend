import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Plus, Clock } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const DAYS = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];

const OrgSchedule = () => {
  const { orgId } = useParams();
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ tutorId: '', dayOfWeek: 'sat', startTime: '', endTime: '', room: '', subjectId: '' });
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [scheduleRes, tutorsRes, subjectsRes] = await Promise.all([
        api.get(`/api/v1/organizations/${orgId}/schedules/timetable`),
        api.get(`/api/v1/organizations/${orgId}/tutors`),
        api.get(`/api/v1/organizations/${orgId}/subjects-list`)
      ]);
      setTimetable(scheduleRes.data.data);
      setTutors(tutorsRes.data.data);
      setSubjects(subjectsRes.data.data);
    } catch {
      toast.error("Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/api/v1/organizations/${orgId}/schedules`, form);
      toast.success("Schedule created");
      setShowCreate(false);
      setForm({ tutorId: '', dayOfWeek: 'sat', startTime: '', endTime: '', room: '', subjectId: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create schedule");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Schedule & Timetable</h2>
          <p className="text-muted-foreground mt-1">View and manage class schedules across the week.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {DAYS.map((day) => (
            <Card key={day} className="min-h-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(timetable[day] || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No classes</p>
                ) : (
                  timetable[day].map((schedule, idx) => (
                    <div key={idx} className="p-2 rounded-md bg-primary/5 border border-primary/10 text-xs">
                      <div className="font-medium">{schedule.subjectId?.name || 'Class'}</div>
                      <div className="text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />{schedule.startTime} - {schedule.endTime}
                      </div>
                      {schedule.room && <div className="text-muted-foreground">Room: {schedule.room}</div>}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Add Schedule</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="tutorId">Tutor *</Label>
              <select id="tutorId" value={form.tutorId} onChange={(e) => setForm({ ...form, tutorId: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm" required>
                <option value="">Select tutor...</option>
                {tutors.map((t) => (
                  <option key={t._id} value={t._id}>{t.userId?.displayName || 'Tutor'}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="subjectId">Subject</Label>
              <select id="subjectId" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm">
                <option value="">Select subject...</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="dayOfWeek">Day *</Label>
              <select id="dayOfWeek" value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm" required>
                {DAYS.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input id="startTime" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input id="endTime" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label htmlFor="room">Room</Label>
              <Input id="room" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Schedule'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Substitution Requests</CardTitle>
          <CardDescription>Request a substitute tutor for a scheduled class</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => toast.info("Substitution request feature coming soon")}>
            Request Substitute
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgSchedule;
