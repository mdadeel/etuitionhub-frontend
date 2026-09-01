import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StickyNote, Trash2, Plus, FileText, Loader2 } from 'lucide-react';
import AiAssistantLayout from '../../components/AiAssistant/AiAssistantLayout';
import { Card } from '@/components/ui/card';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NOTES_KEY = 'ai-tutor-saved-notes';

function loadNotesLocal() {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function SavedNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Load notes from backend, fallback to localStorage
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await api.get('/api/ai/notes');
        setNotes(res.data || []);
      } catch {
        // Fallback to localStorage
        setNotes(loadNotesLocal());
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, []);

  const deleteNote = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/api/ai/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
      toast.success('Note deleted');
    } catch {
      // Fallback: delete from localStorage
      setNotes(prev => prev.filter(n => n._id !== id && n.id !== id));
      toast.success('Note deleted locally');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <AiAssistantLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      </AiAssistantLayout>
    );
  }

  return (
    <AiAssistantLayout>
      <div className="w-full space-y-6 px-4 md:px-8 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
              <StickyNote size={18} className="text-primary" />
              Saved Notes
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your saved lesson plans and notes from the AI tutor
            </p>
          </div>
          <Link
            to="/ai-assistant/lesson-planner"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 h-9 text-xs font-semibold hover:bg-primary/90 transition-all"
          >
            <Plus size={13} />
            New Note
          </Link>
        </div>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <FileText size={32} className="mb-3 text-muted-foreground/30" strokeWidth={1.5} />
            <p className="text-sm">No saved notes yet</p>
            <p className="text-xs mt-1">
              Generate a lesson plan or assignment from{' '}
              <Link to="/ai-assistant/lesson-planner" className="text-primary hover:underline">
                Lesson Planner
              </Link>{' '}
              and save it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <Card key={note._id || note.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {note.title || 'Untitled Note'}
                    </h3>
                    {note.subject && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {note.subject} {note.grade ? `• ${note.grade}` : ''}
                      </p>
                    )}
                    {note.content && (
                      <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2">
                        {typeof note.content === 'string'
                          ? note.content
                          : JSON.stringify(note.content).slice(0, 200)}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground/50 mt-2">
                      {new Date(note.createdAt).toLocaleDateString('en-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNote(note._id || note.id)}
                    disabled={deleting === (note._id || note.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0 disabled:opacity-50"
                    title="Delete note"
                  >
                    {deleting === (note._id || note.id) ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AiAssistantLayout>
  );
}
