# Porua AI Assistant — ai-elements Redesign Plan

**Status:** ✅ Implemented + verified (static checks). Live-inspection checklist below is partially blocked by auth/backend availability.
**Date:** 2026-08-18
**Scope:** The 7 AI Assistant pages + their shared components, restyled with Vercel [AI Elements](https://elements.ai-sdk.dev/) components.
**Binding standards:** desgin-system.md (tokens → primitives → core → composite → pages), UI-UX Anti-Vibe prompt (no decorative gradients/emoji/glass, real data only, Loading/Empty/Error/Success on every async feature), Antigravity IA prompt (one canonical component per concept, consistent shell), Audit-Fix prompt (build/lint/test + live-app verification before done).

---

## 1. What was installed

Ran the ai-elements CLI (via shadcn CLI against the ai-elements registry, since the project already has `components.json` with `tsx: false`):

```bash
npx --yes shadcn@4.17.0 add \
  https://elements.ai-sdk.dev/api/registry/conversation.json \
  https://elements.ai-sdk.dev/api/registry/message.json \
  https://elements.ai-sdk.dev/api/registry/prompt-input.json \
  https://elements.ai-sdk.dev/api/registry/suggestion.json \
  https://elements.ai-sdk.dev/api/registry/attachments.json \
  https://elements.ai-sdk.dev/api/registry/shimmer.json \
  https://elements.ai-sdk.dev/api/registry/sources.json \
  https://elements.ai-sdk.dev/api/registry/reasoning.json --yes
```

### New components (editable source in `src/components/ai-elements/`)

| Component | Exports used by this plan | Purpose |
|---|---|---|
| `conversation.jsx` | `Conversation`, `ConversationContent`, `ConversationEmptyState`, `ConversationScrollButton` | Chat transcript scroll container with stick-to-bottom |
| `message.jsx` | `Message`, `MessageContent`, `MessageActions`, `MessageAction` | Message chrome + hover action bar (copy / thumbs / edit / regenerate) |
| `prompt-input.jsx` | `PromptInput`, `PromptInputBody`, `PromptInputTextarea`, `PromptInputFooter`, `PromptInputSubmit`, `PromptInputActionMenu*` | Composer (auto-grow, attachments, stop button) |
| `attachments.jsx` | `Attachments`, `Attachment`, `AttachmentPreview`, `AttachmentInfo`, `AttachmentRemove` | Staged attachment chips/previews |
| `suggestion.jsx` | `Suggestions`, `Suggestion` | Horizontal quick-action chips |
| `sources.jsx` | `Sources`, `SourcesTrigger`, `SourcesContent`, `Source` | Collapsible source list (tutor recommendations) |
| `reasoning.jsx` | `Reasoning`, `ReasoningTrigger`, `ReasoningContent`, `useReasoning` | Collapsible "thinking" block |
| `shimmer.jsx` | `Shimmer` | Loading skeleton primitive |

### New dependencies added (all passed `npm audit` — the 25 pre-existing vulnerabilities are unrelated: axios, react-router-dom, postcss, etc.)

`ai`, `streamdown`, `@streamdown/cjk`, `@streamdown/code`, `@streamdown/math`, `@streamdown/mermaid`, `use-stick-to-bottom`, `motion`, `nanoid`, `cmdk`, `@radix-ui/react-use-controllable-state`.

### Compatibility notes (verified)

- **Tailwind 3 OK.** All installed components use shadcn CSS-variable tokens already present in `tailwind.config.js`/`app.css` (`bg-background`, `text-muted-foreground`, `border-border`, …). Full `npm run build` passes with them installed but unused.
- **JSX conversion OK.** Registry TSX was converted to `.jsx` per `components.json` (`tsx: false`); type-only imports stripped.
- **Existing `ui/*` primitives were NOT overwritten.** The project's customized `button`, `input`, `textarea`, `select`, `dialog`, `tooltip`, `separator` were kept. Only missing primitives (`scroll-area`, `command`, etc.) were added.
- **`eslint` currently fails on the installed files (14 errors)** — mostly `react-hooks/static-components` and components-created-during-render in `shimmer.jsx`/`message.jsx`. Phase 0 below must fix these.
- **Not installed (deliberately):** `persona` (pulls `@rive-app/react-webgl2` — heavy animation, violates "Animation ≈ none"), `toolbar` (pulls `@xyflow/react` — React Flow, unused), `code-block`/`chain-of-thought`/`audio-player`/`speech-input`/`mic-selector`/`model-selector` (superseded by existing `shiki` markdown pipeline, `ThinkingBlock`, or no backend feature).

---

## 2. Design decisions for this redesign

1. **`message` chrome, not `streamdown` content.** The installed `message.jsx` renders content via `streamdown`. Our backend returns **structured template payloads** (concept/quiz/ielts/programming cards) already rendered by `AiResponseCard` + `react-markdown`/`shiki`/`katex`. We use `Message`/`MessageActions` as the *chrome* (avatar column, action bar) and keep `AiResponseCard` as the content body. If `streamdown` ends up unused after the chat page lands, remove it and its `@streamdown/*` deps (they were pulled in by the registry, not required by us).
2. **`ai` SDK is UI-only here.** The components import types/helpers from `ai`, but our streaming goes through `aiService.sendChatMessageStream` (SSE to our own backend), not `useChat`. Do not wire `useChat` — keep the existing store/service layer; ai-elements components are presentational.
3. **Drop the per-action gradients on the home page.** The current intent cards use `bg-gradient-to-br` with `from-blue-500/20`-style color stops, which violates the anti-vibe rule (decorative gradients). Replace with semantic tokens (`bg-card`, `border-border`, `text-muted-foreground`).
4. **One canonical transcript component.** `Conversation` + `Message` become the single chat-rendering path used by `AiAssistantChat`. `ChatMessage` is refactored (not duplicated) to render *inside* `MessageContent`.
5. **Loading / Empty / Error / Success everywhere.** `Shimmer` replaces hand-rolled skeleton/spinner states on all 7 pages; `ConversationEmptyState` for the empty transcript; keep the existing human-readable error banner.

---

## 3. Page-by-page mapping

### Phase 0 — Prerequisites (shared) ✅ DONE

- Fixed eslint in `src/components/ai-elements/*`:
  - `shimmer.jsx` — hoisted motion components to a module-level cache; switched to `createElement` (the static-components rule can't trace Map lookups); **patched Tailwind 4 → 3 CSS vars** (`var(--color-background)` → `hsl(var(--background))`, `hsl(var(--muted-foreground))`) — the unpatched version rendered invisible text.
  - `attachments.jsx` / `prompt-input.jsx` — fixed the two `no-unused-vars` errors.
  - Added a scoped `eslint.config.js` override for `src/components/ai-elements/**` + the registry-added ui primitives (`button-group`, `input-group`, `command`, `collapsible`, `hover-card`, `dropdown-menu`, `scroll-area`, `spinner`) disabling `react-refresh/only-export-components` (HMR-only rule; vendored files export hooks/contexts/variants by design).
- `src/lib/utils.js` already exports `cn`; aliases resolve.
- Full `npm run lint` now: **0 errors** (6 pre-existing warnings in untouched `src/components/Dashboard/Organization/*`).

### Phase 1 — Shared AI components ✅ DONE

| Current component | Change (implemented) |
|---|---|
| `ChatInput.jsx` | Rebuild as a thin wrapper around `PromptInput` (+ `PromptInputSubmit`, `PromptInputActionMenu` for attach/voice, `Attachments` row). **Keep:** slash-command subject menu, Web Speech voice button, usage-limit pill, 8000-char cap, Esc→stop, THINKING_LABELS rotation — all wired through the existing props (`value/onChange/onSend/onStop/loading`). |
| `ChatMessage.jsx` | Refactor to render inside ai-elements `Message`/`MessageContent`/`MessageActions`. **Keep** the four branches: ThinkingBlock→`Reasoning`, UserBubble (as `Message from="user"`), `AiResponseCard` (as assistant content body), ConversationalBubble, inline quiz cards, error banner, timestamps. Wire `MessageAction`s to the existing `onCopy/onFeedback/onRegenerate/onEditMessage`. |
| `ThinkingBlock.jsx` | Rebuild on `Reasoning`/`useReasoning` (collapsible, `prefers-reduced-motion` safe). |
| `TutorRecommendationCard.jsx` / `TuitionRecommendationCard.jsx` | Optionally wrap recommendation lists in `Sources`/`Source` for a collapsible source panel (keep the existing card design if the visual passes review — do not force it). |
| `SkeletonCard.jsx` | Rebuild on `Shimmer` (same layout footprint to avoid layout shift). |

### Phase 2 — Pages ✅ DONE

| Page | Changes (implemented) |
|---|---|
| **AiAssistantHome** | Hero: replace `animate-ping` glow ring with a restrained static treatment (anti-vibe: no pulsing decorations). Intent cards: rebuild on semantic tokens, drop gradients; on mobile show as a `Suggestions` horizontal row instead of a 2-col grid; keep 8 intents + `forceTemplate` wiring. Composer: new `ChatInput` (PromptInput-based). `Shimmer` while usage/sessions load. |
| **AiAssistantChat** | Transcript: replace the hand-rolled `scrollRef` div + scroll effect with `Conversation`/`ConversationContent` (`use-stick-to-bottom` owns scroll, `ConversationScrollButton` for jump-to-bottom). Empty state: `ConversationEmptyState` (title/description/icons). Loading: `Shimmer` rows instead of "Loading chat...". Keep all streaming/abort/regenerate/edit/quiz logic in `AiAssistantChat.jsx` untouched — this is a presentational swap only. |
| **AiAssistantHistory** | Loading rows → `Shimmer`; empty tabs → `ConversationEmptyState`-style empty states; keep the Chats/Quizzes tabs and Load-more. |
| **AiAssistantQuiz** | Loading → `Shimmer`; success/failure states stay as-is; no chat components needed. |
| **SavedNotes** | Loading → `Shimmer`; empty state text/tone aligned with `ConversationEmptyState` pattern; keep CRUD. |
| **AiAssistantSettings** | No chat components; align spacing to tokens, `Shimmer` for loaded settings. |
| **AiAssistantTutorTools** | Loading → `LessonPlanSkeleton`/`AssignmentSkeleton` rebuilt on `Shimmer`; forms stay; no chat components. |

### Phase 3 — Verification ✅ (static) / ⚠️ (live, partially blocked)

1. `npm run build` — ✅ passes (11.7s).
2. `npm run lint` — ✅ 0 errors.
3. `npm test` — ✅ 49/49. The 3 `test_render.test.jsx` failures are **fixed**: root cause was not an environment hang — commit `30ed2ad` flipped `SyntaxHighlighter`'s `wrap` default to `true`, which rendered the class `shiki-container-wrap`, while the tests (and base CSS contract) wait for `.shiki-container`. Fixed in `SyntaxHighlighter.jsx` by always rendering the base `.shiki-container` class plus the `shiki-container-wrap` modifier (base/modifier pattern, CSS `-wrap` overrides come later so wrap behavior is unchanged).
4. `npm audit` — new ai-elements deps clean (25 pre-existing vulns in axios/react-router-dom/postcss/etc. unchanged).
5. **Live inspection (320/768/1440px, keyboard, streaming abort/edit, reduced-motion) — NOT YET RUN:** every `/ai-assistant/*` route is behind `PrivateRoute` (Firebase + backend JWT), and no backend/Mongo instance is available in this environment. Re-run the checklist below against a running stack.
6. `streamdown` + `@streamdown/*` — still installed (pulled in by `message.jsx`/`reasoning.jsx` imports of `Streamdown`). They are **not** used for content rendering (react-markdown/shiki pipeline kept). If we strip the `MessageResponse`/`ReasoningContent` streamdown usage later, remove the 5 packages.

### Live-inspection checklist (requires backend + login)

1. Home: intent cards render without gradients; composer (PromptInput) focuses, slash menu (/math…), voice button, usage pill, attach chip.
2. Chat: transcript sticks to bottom; `ConversationScrollButton` appears when scrolled up; Stop button aborts mid-stream; edit/regenerate/copy/thumbs work; empty state shows on new chat.
3. Reasoning block collapses/expands; thinking shimmer shows while loading.
4. History/Quiz/SavedNotes/Settings show skeleton loaders, not spinners.
5. Settings: no emoji flags, no fabricated "API Status/Latency" card.
6. Keyboard focus + `prefers-reduced-motion` on the new components.

---

## 4. Risks / decisions — status

- **streamdown vs react-markdown**: kept react-markdown/shiki pipeline; `Message`/`MessageContent` used as chrome only. `streamdown` stays installed but unused in rendering — trim later if desired.
- **`motion` added by shimmer**: `motion@13` is used only by `Shimmer`. It animates a CSS background-position — could be replaced with a CSS keyframe to drop the dep; low priority.
- **`ai` dep**: UI-only (types/helpers); the app streams via its own SSE service, not `useChat`. Note in a future dep audit.
- **Backend contracts untouched** — streaming/quiz/tutor payload shapes identical; frontend presentation only.
- **Attachment behavior improved (intentional):** the old composer staged a raw `File` whose `data` was `undefined`, so attachments were silently dropped by the backend (which expects `{ type: 'image'|'pdf', data: <base64> }`). The new composer converts PromptInput files to that contract, so attachments now actually send. Verify against a running backend before relying on it.

### Files changed

- `eslint.config.js` — vendored-code override
- `src/components/ai-elements/{shimmer,attachments,prompt-input}.jsx` — lint/vars fixes, TW3 CSS vars
- `src/components/AiAssistant/{ChatInput,ChatMessage,ThinkingBlock,SkeletonCard}.jsx` — rebuilt on ai-elements
- `src/pages/AiAssistant/{AiAssistantHome,AiAssistantChat,AiAssistantHistory,AiAssistantQuiz,SavedNotes,AiAssistantSettings}.jsx`
- `package.json` / `package-lock.json` — ai-elements deps
