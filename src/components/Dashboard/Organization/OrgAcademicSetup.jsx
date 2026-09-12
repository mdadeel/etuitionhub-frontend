import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen, Calendar, CheckCircle2, Hash, Layers } from "lucide-react";
import { useOrgAcademicTabQuery } from "@/hooks/queries/useOrgQuery";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { cn } from "@/lib/utils";

/**
 * Unified Academic Setup Workspace
 * Consolidates Classes, Subjects, Batches, and Academic Years into a single cohesive tabbed interface.
 */
const OrgAcademicSetup = () => {
  const { orgId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "classes";
  const [activeTab, setActiveTab] = useState(initialTab);

  const { hasPermission } = useAuth();
  const canManage = hasPermission('class:manage');

  // Lazy tab data query — background tabs DO NOT fetch until selected
  const { data: tabData = [], isLoading: tabLoading } = useOrgAcademicTabQuery(orgId, activeTab);

  const classes = activeTab === 'classes' ? tabData : [];
  const subjects = activeTab === 'subjects' ? tabData : [];
  const years = activeTab === 'years' ? tabData : [];
  const batches = activeTab === 'batches' ? tabData : [];

  const classesLoading = activeTab === 'classes' && tabLoading;
  const subjectsLoading = activeTab === 'subjects' && tabLoading;
  const yearsLoading = activeTab === 'years' && tabLoading;
  const batchesLoading = activeTab === 'batches' && tabLoading;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const getStatusBadge = (status) => {
    const map = {
      active: 'bg-success/10 text-success border-success/20',
      upcoming: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-muted text-muted-foreground border-border',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return map[status] || 'bg-muted text-muted-foreground border-border';
  };

  const tabs = [
    { id: 'classes', label: 'Classes', icon: Users, count: classes.length },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, count: subjects.length },
    { id: 'batches', label: 'Batches', icon: Layers, count: batches.length },
    { id: 'years', label: 'Academic Years', icon: Calendar, count: years.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
            Academic Structure
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your organization's academic calendar, class sections, batches, and subject syllabus.
          </p>
        </div>

        {canManage && (
          <Button className="shadow-xs font-semibold gap-1.5 rounded-lg h-10 px-4">
            <Plus className="size-4" />
            <span>
              {activeTab === 'classes' && 'Create Class'}
              {activeTab === 'subjects' && 'Add Subject'}
              {activeTab === 'batches' && 'Add Batch'}
              {activeTab === 'years' && 'Add Academic Year'}
            </span>
          </Button>
        )}
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              )}
            >
              <Icon className={cn("size-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Classes */}
      {activeTab === 'classes' && (
        <div>
          {classesLoading ? (
            <div className="flex justify-center p-12">
              <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : classes.length === 0 ? (
            <Card className="border-dashed shadow-none bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <BookOpen className="size-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No Classes Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  {canManage
                    ? "You haven't created any classes yet. Create your first class to get started."
                    : "No classes are assigned to your profile."}
                </p>
                {canManage && (
                  <Button size="sm" className="rounded-lg">
                    <Plus className="size-4 mr-1.5" /> Create First Class
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <Card key={cls._id} className="hover:border-primary/30 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{cls.name}</span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {cls.batch || 'General'}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Section: {cls.section || 'A'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5 text-primary" />
                        <span>{cls.students?.length || 0} Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="size-3.5 text-primary" />
                        <span>{cls.subjects?.length || 0} Subjects</span>
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex justify-end pt-2 border-t border-border/60">
                        <Button variant="ghost" size="sm" className="text-xs h-8">Manage Class</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Subjects */}
      {activeTab === 'subjects' && (
        <div>
          {subjectsLoading ? (
            <div className="flex justify-center p-12">
              <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : subjects.length === 0 ? (
            <Card className="border-dashed shadow-none bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <BookOpen className="size-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No Subjects Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Add subjects to organize course curriculum and lesson offerings.
                </p>
                {canManage && (
                  <Button size="sm" className="rounded-lg">
                    <Plus className="size-4 mr-1.5" /> Add First Subject
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <Card key={subject._id} className="hover:border-primary/30 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{subject.name}</span>
                      {subject.code && (
                        <span className="text-xs font-mono px-2 py-0.5 bg-muted rounded-md flex items-center gap-1">
                          <Hash className="size-3 text-muted-foreground" /> {subject.code}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {subject.description || 'No syllabus description provided.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <span className="text-xs text-muted-foreground">{subject.creditHours || 1} Credit Hours</span>
                      {canManage && (
                        <Button variant="ghost" size="sm" className="text-xs h-8">Edit</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Batches */}
      {activeTab === 'batches' && (
        <div>
          {batchesLoading ? (
            <div className="flex justify-center p-12">
              <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : batches.length === 0 ? (
            <Card className="border-dashed shadow-none bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Layers className="size-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No Batches Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Create cohort batches to schedule groups of students together.
                </p>
                {canManage && (
                  <Button size="sm" className="rounded-lg">
                    <Plus className="size-4 mr-1.5" /> Add First Batch
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch) => (
                <Card key={batch._id} className="hover:border-primary/30 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{batch.name}</span>
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getStatusBadge(batch.status))}>
                        {batch.status}
                      </span>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{batch.courseId?.name || 'Academic Batch'}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5 text-primary" />
                        <span>{batch.currentEnrollment || 0} / {batch.maxStudents || '∞'} enrolled</span>
                      </div>
                      {batch.schedule?.days && (
                        <span className="truncate">{batch.schedule.days.join(', ')}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Academic Years */}
      {activeTab === 'years' && (
        <div>
          {yearsLoading ? (
            <div className="flex justify-center p-12">
              <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : years.length === 0 ? (
            <Card className="border-dashed shadow-none bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Calendar className="size-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No Academic Years</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Set up your academic sessions and semester date ranges.
                </p>
                {canManage && (
                  <Button size="sm" className="rounded-lg">
                    <Plus className="size-4 mr-1.5" /> Add Academic Year
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {years.map((year) => (
                <Card key={year._id} className="hover:border-primary/30 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base">
                          {year.isCurrent && <CheckCircle2 className="size-4 text-success" />}
                          <span>{year.name}</span>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(year.startDate).toLocaleDateString()} — {new Date(year.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getStatusBadge(year.status))}>
                        {year.status}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrgAcademicSetup;
