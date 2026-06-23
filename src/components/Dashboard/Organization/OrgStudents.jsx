import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const OrgStudents = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage your organization's students and bulk operations.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Student management interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgStudents;
