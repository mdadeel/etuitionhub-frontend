import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const OrgSubjects = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subjects</h2>
          <p className="text-muted-foreground">
            Manage the curriculum and subjects offered.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subject List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Subject management interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgSubjects;
