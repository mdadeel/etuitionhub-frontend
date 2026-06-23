import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const OrgAnnouncements = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">
            Broadcast messages to members, students, and tutors.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Announcements interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgAnnouncements;
