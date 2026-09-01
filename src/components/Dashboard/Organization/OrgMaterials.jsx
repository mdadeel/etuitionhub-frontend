import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, FileText, Upload, Download } from "lucide-react";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";

const OrgMaterials = () => {
  const { orgId } = useParams();
  const { hasPermission } = useAuth();
  const canUpload = hasPermission('material:upload');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/${orgId}/materials`);
        setMaterials(res.data.data);
      } catch {
        toast.error("Failed to fetch materials");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [orgId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Learning Materials</h2>
          <p className="text-muted-foreground mt-1">
            Upload and manage study materials for students.
          </p>
        </div>
        {canUpload && (
          <Button className="shadow-sm">
            <Upload className="mr-2 h-4 w-4" /> Upload Material
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : materials.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Materials</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Upload study materials like notes, PDFs, and videos for your students.
            </p>
            {canUpload && (
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Upload First Material
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {materials.map((material) => (
            <Card key={material._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  {material.title || material.name}
                </CardTitle>
                <CardDescription>
                  {material.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{material.fileType || 'File'}</span>
                  <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgMaterials;
