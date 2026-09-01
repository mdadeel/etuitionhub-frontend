import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, MessageSquareQuote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import SEO from '../shared/SEO';
import EmptyState from '../shared/EmptyState';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const avatarColors = [
  'bg-success/10 text-success border-success/20',
  'bg-primary/10 text-primary border-primary/20',
  'bg-warning/10 text-warning border-warning/20',
];

const AllTestimonials = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials', 'all', page],
    queryFn: async () => {
      const res = await api.get(`/api/testimonials?page=${page}&limit=${limit}`);
      return res.data || { data: [], pagination: { pages: 1 } };
    },
    staleTime: 120_000,
  });

  const items = data?.data || [];
  const pages = data?.pagination?.pages || 1;

  return (
    <div className="bg-background min-h-screen py-16">
      <SEO title={t('testimonials.page_seo_title')} description={t('testimonials.page_seo_desc')} />
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-sm font-medium text-primary">{t('testimonials.heading')}</span>
          <h1 className="text-3xl font-bold text-foreground mt-2">{t('testimonials.page_title')}</h1>
          <p className="text-muted-foreground mt-2">{t('testimonials.page_subtitle')}</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={MessageSquareQuote}
            title={t('testimonials.empty_title')}
            description={t('testimonials.empty_desc')}
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it, idx) => {
                const color = avatarColors[idx % avatarColors.length];
                const name = it.name || 'Anonymous';
                const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const rating = it.rating || 5;
                return (
                  <div key={it._id} className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star key={i} size={13} className="fill-warning text-warning" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{it.quote}&rdquo;</p>
                    </div>
                    <div className="border-t border-border/40 pt-4 flex items-center gap-3 mt-4">
                      <Avatar className={`size-10 rounded-full border ${color}`}>
                        <AvatarFallback className="font-bold text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight">{name}</p>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {it.role || 'Parent'}{it.school ? ` · ${it.school}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded border border-border disabled:opacity-50"
                >
                  {t('common.prev')}
                </button>
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  {t('common.page')} {page} / {pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-4 py-2 rounded border border-border disabled:opacity-50"
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllTestimonials;
