import { useState, useEffect, useCallback } from 'react';
import { Plus, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton, LineSkeleton } from '@/components/shared/skeletons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import EmptyState from '../shared/EmptyState';
import DashboardPageHeader from '../shared/DashboardPageHeader';

const AdminTestimonials = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    school: '',
    location: '',
    quote: '',
    photoURL: '',
    videoURL: '',
    rating: 5,
    featured: false,
  });

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/testimonials?limit=50');
      setTestimonials(res.data?.data || res.data || []);
    } catch {
      toast.error(t('admin.testimonials.load_failed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/api/testimonials', { ...form, approved: true });
      toast.success(t('admin.testimonials.created'));
      setShowModal(false);
      setForm({ name: '', role: '', school: '', location: '', quote: '', photoURL: '', videoURL: '', rating: 5, featured: false });
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.error || t('admin.testimonials.create_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-lg" />
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-3 w-60 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <LineSkeleton width="1/3" className="h-4" />
                <LineSkeleton width="1/4" className="h-3" />
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => <Skeleton key={j} className="size-3 rounded-sm" />)}
              </div>
            </div>
            <LineSkeleton width="full" className="h-3 mt-2" />
            <LineSkeleton width="2/3" className="h-3 mt-1" />
          </CardSkeleton>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <DashboardPageHeader
        title={t('admin.testimonials.title')}
        subtitle={t('admin.testimonials.subtitle')}
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus className="size-4 mr-2" />
            {t('admin.testimonials.add')}
          </Button>
        }
      />

      {testimonials.length === 0 ? (
        <EmptyState
          icon={Star}
          title={t('admin.testimonials.empty_title')}
          description={t('admin.testimonials.empty_desc')}
          action={t('admin.testimonials.add')}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {testimonials.map((item) => (
            <Card key={item._id} className="p-5">
              <div className="flex items-start gap-4">
                {item.photoURL ? (
                  <img
                    src={item.photoURL}
                    alt={item.name}
                    loading="lazy"
                    className="size-12 rounded-full object-cover shrink-0 border border-border"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                    <Star className="size-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-label px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">
                            <Star className="size-2.5 fill-amber-400 text-amber-400" />
                            Featured
                          </span>
                        )}
                      </div>
                      {(item.role || item.school) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {[item.role, item.school].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${i < (item.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  {item.location && (
                    <p className="text-xs text-muted-foreground/60 mt-2">{item.location}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground/40 mt-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('admin.testimonials.add')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{t('admin.testimonials.name')} *</label>
                <input
                  className="w-full p-2.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t('admin.testimonials.name')}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{t('admin.testimonials.role')}</label>
                <input
                  className="w-full p-2.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t('admin.testimonials.role')}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{t('admin.testimonials.school')}</label>
                <input
                  className="w-full p-2.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t('admin.testimonials.school')}
                  value={form.school}
                  onChange={(e) => setForm({ ...form, school: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{t('admin.testimonials.location')}</label>
                <input
                  className="w-full p-2.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t('admin.testimonials.location')}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{t('admin.testimonials.quote')} *</label>
              <textarea
                className="w-full p-2.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                rows={3}
                placeholder={t('admin.testimonials.quote')}
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{t('admin.testimonials.rating')}</label>
                <div className="flex items-center gap-1 p-2.5 border border-border rounded-lg">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm({ ...form, rating: val })}
                      aria-label={`${val} star${val > 1 ? 's' : ''}`}
                      aria-pressed={val <= form.rating}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      <Star
                        className={`size-4 transition-colors ${val <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{form.rating}/5</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{t('admin.testimonials.photo_url')}</label>
                <input
                  className="w-full p-2.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="https://..."
                  value={form.photoURL}
                  onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-primary"
              />
              <label htmlFor="featured" className="text-sm text-foreground">{t('admin.testimonials.featured')}</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} disabled={submitting}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? '...' : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestimonials;
