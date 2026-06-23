import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, Users, BookOpen } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrgClasses = () => {
  const { orgId } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/classes`);
        setClasses(res.data.data);
      } catch (err) {
        toast.error("Failed to fetch classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [orgId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classes & Batches</h2>
          <p className="text-muted-foreground mt-1">
            Manage your organization's class structure and assign subjects.
          </p>
        </div>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Create Class
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : classes.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Classes Found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't created any classes or batches yet. Create your first class to get started.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create First Class
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Card key={cls._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{cls.name}</span>
                  <span className="text-xs font-normal px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {cls.batch || 'General'}
                  </span>
                </CardTitle>
                <CardDescription>
                  Section: {cls.section || 'A'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{cls.students?.length || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{cls.subjects?.length || 0} Subjects</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Manage Class</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgClasses;
