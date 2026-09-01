import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { hasAnonBookmark, addAnonBookmark, removeAnonBookmark } from '../../lib/anonBookmarks';
import { cn } from '@/lib/utils';

const SaveButton = ({ type, id, isAuthenticated, size = 'md', className }) => {
  const { t } = useTranslation();
  const checkPath = type === 'tutor'
    ? `/api/bookmarks/check/${id}`
    : `/api/bookmarks/tuitions/check/${id}`;
  const mutationPath = type === 'tutor'
    ? `/api/bookmarks/${id}`
    : `/api/bookmarks/tuitions/${id}`;

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated || !id) {
      setSaved(hasAnonBookmark(type, id));
      return;
    }
    api.get(checkPath)
      .then(res => { if (!cancelled) setSaved(!!res.data?.isSaved); })
      .catch(() => { if (!cancelled) setSaved(false); });
    return () => { cancelled = true; };
  }, [id, isAuthenticated, checkPath, type]);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      if (saved) { removeAnonBookmark(type, id); setSaved(false); }
      else { addAnonBookmark(type, id); setSaved(true); }
      toast.success(saved ? t('save.removed_anon') : t('save.added_anon'));
      return;
    }
    try {
      if (saved) { await api.delete(mutationPath); setSaved(false); toast.success(t('save.removed')); }
      else { await api.post(mutationPath); setSaved(true); toast.success(t('save.added')); }
    } catch (err) {
      toast.error(err.response?.data?.error || t('save.failed'));
    }
  };

  const iconCls = size === 'sm' ? 'size-4' : size === 'lg' ? 'size-6' : 'size-5';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? t('save.unsave') : t('save.save')}
      title={saved ? t('save.unsave') : t('save.save')}
      className={cn(
        'inline-flex items-center justify-center rounded-full p-2 transition-colors',
        'hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className
      )}
    >
      <Bookmark className={cn(iconCls, saved ? 'fill-primary text-primary' : 'text-muted-foreground')} />
    </button>
  );
};

export default SaveButton;
