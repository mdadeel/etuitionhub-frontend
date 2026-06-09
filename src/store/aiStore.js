// store/aiStore.js
// Lightweight Zustand store for the AI Assistant UI state. The bulk of
// server-state is managed by TanStack Query (per-route). This store
// holds the *cross-cutting* UI state: the currently selected subject,
// the active session id, the in-flight chat message, etc.
//
// We keep the store small on purpose — large derived state belongs in
// the component that needs it.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAiStore = create(
    persist(
        // eslint-disable-next-line no-unused-vars
        (set, get) => ({
            // Currently selected subject (chips on the left of the chat).
            subject: 'general',
            setSubject: (subject) => set({ subject }),

            // ID of the active chat session. null = "new chat".
            activeSessionId: null,
            setActiveSessionId: (id) => set({ activeSessionId: id }),

            // "Suggested actions" carousel — which quick action is active.
            // Used for highlighting the chip the user just clicked.
            lastQuickAction: null,
            setLastQuickAction: (action) => set({ lastQuickAction: action }),

            // History-drawer open state (the right-side drawer).
            isHistoryOpen: false,
            setHistoryOpen: (open) => set({ isHistoryOpen: open }),

            // ──────────────────────────────────────────────────────────
            //  AI_TUTOR_DESIGN.md §9.1 — extended state (2026 refresh)
            // ──────────────────────────────────────────────────────────

            // UI theme. Toggled via the Sun/Moon button in
            // AiAssistantLayout (§5.1). Mirrored on <html> via the
            // `ui-theme` localStorage key by the layout effect.
            theme: 'dark',
            setTheme: (theme) => set({ theme }),

            // ID of the user message currently being edited inline
            // (AI_TUTOR_DESIGN.md §5.13). null = no edit in progress.
            editingMessageId: null,
            setEditingMessageId: (id) => set({ editingMessageId: id }),

            // Currently staged attachment in ChatInput (§5.4, §5.5).
            // Cleared on send. Not persisted — files don't survive reload.
            attachmentFile: null,
            setAttachmentFile: (file) => set({ attachmentFile: file }),

            // Current index in the THINKING_LABELS rotation for the
            // Send button label (§6.3). Not persisted.
            thinkingLabelIndex: 0,
            setThinkingLabelIndex: (i) => set({ thinkingLabelIndex: i }),

            // Reset everything (used on logout).
            reset: () =>
                set({
                    subject: 'general',
                    activeSessionId: null,
                    lastQuickAction: null,
                    isHistoryOpen: false,
                    theme: 'dark',
                    editingMessageId: null,
                    attachmentFile: null,
                    thinkingLabelIndex: 0,
                }),
        }),
        {
            name: 'ai-assistant-prefs',
            storage: createJSONStorage(() => localStorage),
            // Only persist user-tunable preferences. Session state, edit
            // state, attachments, and label indices reset on reload.
            // `lastQuickAction` is operational (which chip was clicked),
            // not a preference — keep it in memory only.
            partialize: (state) => ({
                subject: state.subject,
                theme: state.theme,
            }),
        }
    )
);

export default useAiStore;
