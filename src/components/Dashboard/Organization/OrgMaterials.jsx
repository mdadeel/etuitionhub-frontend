import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const OrgMaterials = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Learning Materials</h2>
          <p className="text-muted-foreground">
            Upload and organize learning resources for classes.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Materials Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Learning materials interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgMaterials;
