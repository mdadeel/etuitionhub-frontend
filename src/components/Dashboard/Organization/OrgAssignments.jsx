import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const OrgAssignments = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
          <p className="text-muted-foreground">
            Manage assignments across different classes and sections.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Assignments interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgAssignments;
