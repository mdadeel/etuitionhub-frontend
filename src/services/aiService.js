import api from './api';

/**
 * AI Assistant service.
 *
 * Implements the contract from `AI_TUTOR_DESIGN.md` §6.7 (streaming),
 * §5.13 (feedback), and §13.1 (schemas). `sendChatMessage` is the
 * non-streaming fallback; `sendChatMessageStream` opens an
 * `EventSource` against the new SSE endpoint.
 */
export const aiService = {
    /**
     * Non-streaming chat (fallback when the browser does not support
     * `EventSource` or the backend hasn't enabled the streaming
     * endpoint in this environment).
     */
    sendChatMessage: async ({ userMessage, subject, forceTemplate, sessionId, attachment }) => {
        const response = await api.post('/api/ai/chat', {
            userMessage,
            subject,
            forceTemplate,
            sessionId,
            attachment,
        });
        return response.data;
    },

    /**
     * Streaming chat (SSE). Returns a Promise<void> that resolves when
     * the stream closes cleanly. Errors propagate as a rejected promise
     * (AbortError is thrown on user-cancelled requests).
     *
     * @param {object}   opts
     * @param {string}   opts.userMessage
     * @param {string}   opts.subject
     * @param {string=}  opts.sessionId
     * @param {string=}  opts.forceTemplate
     * @param {object=}  opts.attachment   base64-encoded image/PDF
     * @param {AbortSignal} opts.signal   for cancellation via the Stop button
     * @param {(chunk: string) => void} opts.onChunk  optional progress callback
     */
    sendChatMessageStream: async ({ userMessage, subject, sessionId, forceTemplate, attachment, signal, onChunk }) => {
        if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
            throw new Error('Streaming is not supported in this environment.');
        }
        // The api helper already attaches the auth token. We bypass it
        // here because we need a streaming response body, not JSON.
        const token = localStorage.getItem('token') || '';
        const baseURL = api.defaults?.baseURL || '';
        const res = await fetch(`${baseURL}/api/ai/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ userMessage, subject, sessionId, forceTemplate, attachment }),
            signal,
        });
        if (!res.ok || !res.body) {
            if (res.status === 404) {
                // Backend doesn't support streaming yet; fallback to non-streaming
                const fallbackResponse = await aiService.sendChatMessage({ userMessage, subject, forceTemplate, sessionId, attachment });
                // We could simulate a chunk, but the caller will refetch the session anyway
                return fallbackResponse;
            }
            // Surface the server's error message if it returned JSON.
            let detail = `Stream request failed (${res.status})`;
            try {
                const data = await res.json();
                detail = data?.error || data?.message || detail;
            } catch {
                /* not JSON */
            }
            throw new Error(detail);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        // The backend sends SSE frames. We accumulate `data:` lines until
        // a blank line, then dispatch the payload. The progressive-render
        // strategy in AI_TUTOR_DESIGN.md §6.7 buffers the full JSON and
        // hands it to the dispatcher on stream close.
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let sep;
            // SSE frames are separated by a blank line.
            while ((sep = buffer.indexOf('\n\n')) !== -1) {
                const frame = buffer.slice(0, sep);
                buffer = buffer.slice(sep + 2);
                const line = frame.split('\n').find((l) => l.startsWith('data:'));
                if (!line) continue;
                const payload = line.slice(5).trim();
                if (payload && payload !== '[DONE]' && onChunk) {
                    onChunk(payload);
                }
            }
        }
    },

    getChatSession: async (sessionId) => {
        const response = await api.get(`/api/ai/sessions/${sessionId}`);
        return response.data;
    },

    listChatSessions: async (params) => {
        const response = await api.get('/api/ai/sessions', { params });
        return response.data;
    },

    updateChatSession: async (sessionId, data) => {
        const response = await api.patch(`/api/ai/sessions/${sessionId}`, data);
        return response.data;
    },

    deleteChatSession: async (sessionId) => {
        const response = await api.delete(`/api/ai/sessions/${sessionId}`);
        return response.data;
    },

    /**
     * AI_TUTOR_DESIGN.md §5.13 — silent feedback for an AI message.
     * @param {string} messageId
     * @param {'up' | 'down'} rating
     */
    sendFeedback: async (messageId, rating) => {
        const response = await api.post('/api/ai/feedback', { messageId, rating });
        return response.data;
    },

    generateQuiz: async ({ subject, topic, numQuestions }) => {
        const response = await api.post('/api/ai/quiz/generate', { subject, topic, numQuestions });
        return response.data;
    },

    getQuiz: async (quizId) => {
        const response = await api.get(`/api/ai/quiz/${quizId}`);
        return response.data;
    },

    submitQuiz: async ({ quizId, responses }) => {
        const response = await api.post('/api/ai/quiz/submit', { quizId, responses });
        return response.data;
    },

    getQuizHistory: async (params) => {
        const response = await api.get('/api/ai/quiz/history', { params });
        return response.data;
    },

    deleteQuiz: async (quizId) => {
        const response = await api.delete(`/api/ai/quiz/${quizId}`);
        return response.data;
    },

    generateLessonPlan: async ({ subject, topic, duration, grade }) => {
        const response = await api.post('/api/ai/tutor/lesson-plan', { subject, topic, duration, grade });
        return response.data;
    },

    generateAssignment: async ({ subject, topic, numQuestions, difficulty }) => {
        const response = await api.post('/api/ai/tutor/assignment', { subject, topic, numQuestions, difficulty });
        return response.data;
    },

    trackTutorRecommendationClick: async (tutorId, sessionId) => {
        const response = await api.post('/api/ai/tutor-recommendation-click', { tutorId, sessionId });
        return response.data;
    },
};

export default aiService;
