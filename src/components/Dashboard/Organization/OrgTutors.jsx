import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const OrgTutors = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tutors</h2>
          <p className="text-muted-foreground">
            Manage your organization's teachers and tutors.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tutors List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Tutor management interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgTutors;
