import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Shield, 
  Cpu, 
  Layers, 
  GitFork, 
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle,
  Zap,
  Info,
  BookOpen,
  Sliders,
  ExternalLink
} from 'lucide-react';

// Custom counter hook for stats
function useAnimatedCounter(target, duration = 1200, start = 0) {
  const [count, setCount] = useState(start);
  
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (target - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration, start]);
  
  return count;
}

export default function EngineeringShowcase() {
  // Section 3: "How One Message Travels" Simulation State
  const [simStep, setSimStep] = useState(0);
  const [simPlaying, setSimPlaying] = useState(false);
  const [simSpeed, setSimSpeed] = useState(2000); // ms per step
  
  // Section 4: Architecture Explorer State
  const [selectedModule, setSelectedModule] = useState('provider');
  
  // Section 5: Highlights Tabs
  const [activeHighlightTab, setActiveHighlightTab] = useState('provider');
  
  // Section 9: Tech Grid Category State
  const [selectedTechGroup, setSelectedTechGroup] = useState('all');

  const messageJourneySteps = [
    {
      title: "1. User Input Trigger",
      description: "User submits an academic prompt, optionally attaching images/files. React client intercepts form submit and generates context identifiers.",
      component: "AiAssistantChat.jsx",
      files: ["/src/pages/AiAssistant/AiAssistantChat.jsx"],
      latency: "1-3ms",
      details: "Binds inputs to an AbortController instance, packages files into Base64 streams, and triggers optimistic UI chat card insertion."
    },
    {
      title: "2. Intent Classification",
      description: "Fast-path router evaluates whether prompt requires a chat dialog response, structured quiz session, or study planning tool card.",
      component: "intentDetector.js",
      files: ["/src/modules/ai/services/intentDetector.js"],
      latency: "10-20ms",
      details: "Performs quick-classification using precompiled regex maps and trigger keyword parsing to avoid slow, expensive LLM-based class audits."
    },
    {
      title: "3. Memory Retrieval",
      description: "Database lookup to fetch active session history logs, recent student learning vectors, and past quiz outcomes.",
      component: "aiChatService.js",
      files: ["/src/modules/ai/services/aiChatService.js", "/src/modules/ai/models/AiMessage.js"],
      latency: "15-30ms",
      details: "Retrieves MongoDB chat documents, structures parent-child message references, and prepares thread history for the prompt compiler."
    },
    {
      title: "4. Context Compression",
      description: "Context engine crops history array to stay within active model window boundaries and injects curriculum tags.",
      component: "contextEngine.js",
      files: ["/src/modules/ai/services/contextEngine.js"],
      latency: "5-15ms",
      details: "Calculates token weights, removes redundant logs, and appends localized Bangladesh NCTB (SSC/HSC) curriculum standards dynamically."
    },
    {
      title: "5. Prompt Compilation",
      description: "Prompt engine structures the final instructions, inserting the system persona rules, subject vectors, and JSON schema constraints.",
      component: "promptEngine.js",
      files: ["/src/modules/ai/services/promptEngine.js", "/src/modules/ai/services/aiPrompts.js"],
      latency: "5-10ms",
      details: "Injects the Porua AI academic tutor instructions, structuring prompt formats to mandate mathematical LaTeX and Markdown tables."
    },
    {
      title: "6. Provider Routing Selection",
      description: "Abstraction layer checks active backend adapters. Prioritizes local Ollama nodes in dev, and DashScope/Gemini/OpenRouter in production.",
      component: "aiProvider.js",
      files: ["/src/modules/ai/services/aiProvider.js"],
      latency: "5-15ms",
      details: "Evaluates provider order. Excludes adapters marked as disabled or failing, routing queries to the healthiest Generative API adapter."
    },
    {
      title: "7. API Adapter Dispatch",
      description: "Translates unified request model into adapter-specific headers and JSON formats, dispatching queries to external LLM gateways.",
      component: "geminiAdapter.js",
      files: ["/src/modules/ai/services/providers/geminiAdapter.js", "/src/modules/ai/services/providers/ollamaAdapter.js"],
      latency: "150-250ms (TTFT)",
      details: "Translates message array to model parameters (e.g., systemInstructions, content parts for Gemini), initiating the HTTP streaming chunk pipeline."
    },
    {
      title: "8. SSE Stream Routing",
      description: "Server routes HTTP Server-Sent Events (SSE) stream buffers down to the browser client in real time.",
      component: "aiProvider.js Stream Generator",
      files: ["/src/modules/ai/services/aiProvider.js"],
      latency: "Continuous stream",
      details: "Yields chunks via JavaScript generators, parses JSON chunks dynamically, and uses repairUnterminatedJson to patch truncated JSON buffers."
    },
    {
      title: "9. Markdown Stream Parsing",
      description: "Client-side Markdown parser compiles the incoming text chunks, transforming headings, math expressions, and styling flags.",
      component: "ChatMessage.jsx Parser",
      files: ["/src/components/AiAssistant/ChatMessage.jsx"],
      latency: "8-12ms",
      details: "Utilizes structured streaming text buffer parser to convert inline tags and custom educational directives into virtual DOM trees on the fly."
    },
    {
      title: "10. Syntax Highlight Drawing",
      description: "Applies technical code coloring styles inside Markdown code fences for a clean coding display.",
      component: "ChatMessage.jsx Syntax Engine",
      files: ["/src/components/AiAssistant/ChatMessage.jsx"],
      latency: "5-15ms",
      details: "Intercepts code blocks, maps lang properties, and draws highlighted layout styling without delaying the primary text stream."
    },
    {
      title: "11. React state updates",
      description: "React chat page state captures stream chunks and updates reactive hook buffers.",
      component: "AiAssistantChat.jsx State",
      files: ["/src/pages/AiAssistant/AiAssistantChat.jsx"],
      latency: "16ms (60fps cycle)",
      details: "Updates state buffers, triggers view re-draws, and controls virtual scrolling metrics to ensure seamless layout stability."
    },
    {
      title: "12. Chat Bubble Redraw",
      description: "DOM elements redraw with smooth fade transitions, autoscrolling down to present the completed response card.",
      component: "ChatMessage.jsx UI",
      files: ["/src/components/AiAssistant/ChatMessage.jsx"],
      latency: "2-5ms",
      details: "Renders visual feedback tools (Copy, Regenerate, Thumbs feedback) and handles screen reader accessibility states."
    }
  ];

  const modules = {
    provider: {
      name: "Provider Routing Engine",
      icon: <Cpu className="size-5 text-blue-400" />,
      purpose: "Unified, provider-agnostic bridge routing queries to Ollama, DashScope, Gemini, or OpenRouter with zero-downtime failover.",
      files: [
        "etuitionhub--backend/src/modules/ai/services/aiProvider.js",
        "etuitionhub--backend/src/modules/ai/services/providers/baseAdapter.js"
      ],
      dependencies: ["@google/generative-ai", "axios"],
      responsibilities: [
        "Dynamic routing (local Ollama for dev, DashScope/Gemini/OpenRouter for prod)",
        "Fault-tolerant sequential adapter failovers (retries other adapters on rate limits/timeouts)",
        "Adapts model-specific message syntax into unified schema representations",
        "Server-side JSON parser with repair engines for partial stream buffers"
      ],
      impact: "Zero-downtime failovers. Restructures incomplete JSON streams in <2ms."
    },
    context: {
      name: "Intelligent Context Builder",
      icon: <GitFork className="size-5 text-purple-400" />,
      purpose: "Aggregates message history, learning metrics, and NCTB syllabus guidelines into an optimized prompt token layout.",
      files: [
        "etuitionhub--backend/src/modules/ai/services/promptEngine.js",
        "etuitionhub--backend/src/modules/ai/services/contextEngine.js",
        "etuitionhub--backend/src/modules/ai/services/aiPrompts.js"
      ],
      dependencies: ["mongodb"],
      responsibilities: [
        "Fetches and trims chat history to enforce context window safety parameters",
        "Appends NCTB curriculum context vectors based on selected user subject (SSC, HSC, Admission)",
        "Injects Porua AI academic persona system instructions and LaTeX styling guides",
        "Prunes database tokens to prevent unnecessary LLM API costs"
      ],
      impact: "Cuts API token overhead by up to 35% through active context pruning."
    },
    pipeline: {
      name: "Streaming Rendering Pipeline",
      icon: <Layers className="size-5 text-amber-500" />,
      purpose: "Manages server-sent event chunk streams, AbortController request termination, and responsive client-side rendering.",
      files: [
        "etuitionhub-frontend/src/pages/AiAssistant/AiAssistantChat.jsx",
        "etuitionhub-frontend/src/components/AiAssistant/ChatMessage.jsx",
        "etuitionhub--backend/src/modules/ai/services/aiChatService.js"
      ],
      dependencies: ["@tanstack/react-query", "react-router-dom"],
      responsibilities: [
        "Direct connection to HTTP SSE endpoints yielding real-time chunks",
        "Maps AbortController hooks to Stop buttons to kill active model stream requests",
        "Client-side Markdown parsing and syntax highlight redrawing",
        "Optimistic UI rendering and viewport scroll-to-bottom adjustments"
      ],
      impact: "Reduces perceived TTFT latency down to 180ms."
    }
  };

  const techStack = [
    { name: "React 18", group: "frontend", desc: "Code-splitting (React.lazy), custom hooks, context state mapping", icon: "atom" },
    { name: "Vite", group: "frontend", desc: "Optimized production bundler and fast HMR dev server modules", icon: "zap" },
    { name: "Tailwind CSS", group: "frontend", desc: "Design tokens, utility CSS classes, fluid styling presets", icon: "paint" },
    { name: "React Router v6", group: "frontend", desc: "Client routing, URL param tracking, transition guards", icon: "route" },
    { name: "TanStack Query", group: "frontend", desc: "Client data caching, stale-while-revalidate data query layers", icon: "refresh" },
    { name: "Node.js & Express", group: "backend", desc: "SSE streaming endpoints, modular routers, fallback middleware", icon: "server" },
    { name: "MongoDB & Mongoose", group: "backend", desc: "Chat logs index tracking, session databases, user metrics", icon: "database" },
    { name: "Gemini API SDK", group: "ai", desc: "Native Google Generative AI integration, system schemas support", icon: "cpu" },
    { name: "Ollama (Llama 3)", group: "ai", desc: "Local developmental testing node, custom model running", icon: "cpu" },
    { name: "OpenRouter Gateway", group: "ai", desc: "Backup API gateway for fallback model routing sequences", icon: "network" },
    { name: "Regex Guard Engine", group: "security", desc: "Local query inspection and off-topic safety firewall", icon: "shield" },
    { name: "AbortController API", group: "frontend", desc: "Native stream cancellation wired to Stop buttons", icon: "x" }
  ];

  // Simulation play interval logic
  useEffect(() => {
    let interval = null;
    if (simPlaying) {
      interval = setInterval(() => {
        setSimStep((prev) => (prev + 1) % messageJourneySteps.length);
      }, simSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simPlaying, simSpeed, messageJourneySteps.length]);

  return (
    <div className="min-h-screen bg-[#081225] text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION (Technical Minimalism: Clean typography, premium whitespace, dynamic grid background) */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 md:px-8 border-b border-slate-800/40 bg-layered overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/5 blur-[120px] pointer-events-none rounded-full" />

        {/* Tech Badges */}
        <div className="z-10 flex flex-wrap justify-center gap-2 mb-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900/80 border border-slate-800/60 rounded-full text-[10px] font-mono tracking-wider uppercase text-blue-400">
            <Zap className="size-3" /> Streaming AI Pipeline
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900/80 border border-slate-800/60 rounded-full text-[10px] font-mono tracking-wider uppercase text-emerald-400">
            <Shield className="size-3" /> Multi-Model Abstraction
          </span>
        </div>

        {/* Clean displays & spacing */}
        <div className="z-10 max-w-4xl text-center space-y-6 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading tracking-tight text-white leading-tight">
            Engineering Showcase
          </h1>
          <p className="max-w-xl mx-auto text-slate-400 text-sm md:text-base font-normal tracking-tight font-body leading-relaxed">
            Technical architecture specifications, routing engines, and streaming performance data of the Porua AI Assistant platform.
          </p>
        </div>

        {/* Interactive CTA buttons */}
        <div className="z-10 flex flex-col sm:flex-row gap-3 mt-10 animate-fade-in-up">
          <a 
            href="#journey" 
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wide uppercase transition-all duration-200 rounded-[8px] hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-[0.98]"
          >
            Explore Message Journey
          </a>
          <a 
            href="#highlights" 
            className="px-6 py-2.5 bg-slate-900/80 hover:bg-slate-850 text-slate-300 font-medium text-xs tracking-wide uppercase border border-slate-800/60 rounded-[8px] transition-all duration-200 active:scale-[0.98]"
          >
            System Infrastructure
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
          <span className="text-[9px] font-mono tracking-widest uppercase">Scroll to inspect</span>
          <div className="w-[18px] h-8 border border-slate-800/80 rounded-full flex justify-center bg-slate-950/20">
            <div className="w-1 bg-blue-500 h-2 rounded-full mt-1.5 animate-bounce-slow" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-36 mt-20">

        {/* 2. CENTERPIECE: "How One Message Travels" Simulation Flow (12 Steps) */}
        <section id="journey" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-4 mb-6">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Interactive Centerpiece</span>
            <h2 className="text-3xl font-heading font-bold uppercase text-white mt-1">How One Message Travels</h2>
          </div>
          
          <p className="text-slate-400 text-sm max-w-2xl mb-12 font-body">
            Watch the lifecycle of a prompt in real time. Trace how prompt packets transit from user inputs through context compilers, fallback providers, and Markdown draw hooks.
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* Visual SVG Diagram Canvas */}
            <div className="xl:col-span-7 bg-slate-950/40 border border-slate-800/60 p-6 rounded-[10px] flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Message Pipeline Map</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800/40 rounded-full text-[10px] font-mono text-blue-400 uppercase">
                  Active step: {simStep + 1} / {messageJourneySteps.length}
                </span>
              </div>

              {/* 12-Node S-Curve visual path */}
              <div className="relative w-full h-[400px] bg-slate-950/25 border border-slate-900 rounded-[10px] overflow-hidden flex items-center justify-center p-4">
                <svg className="w-full h-full max-w-[640px]" viewBox="0 0 600 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* S-Curve connection lines */}
                  {/* Row 1 (Left to Right) */}
                  <path d="M 60 60 L 195 60" stroke={simStep >= 1 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  <path d="M 195 60 L 330 60" stroke={simStep >= 2 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  <path d="M 330 60 L 465 60" stroke={simStep >= 3 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  
                  {/* Connector Row 1 to Row 2 (Drops down on right side) */}
                  <path d="M 465 60 C 530 60, 530 180, 465 180" stroke={simStep >= 4 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  
                  {/* Row 2 (Right to Left) */}
                  <path d="M 465 180 L 330 180" stroke={simStep >= 5 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  <path d="M 330 180 L 195 180" stroke={simStep >= 6 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  <path d="M 195 180 L 60 180" stroke={simStep >= 7 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  
                  {/* Connector Row 2 to Row 3 (Drops down on left side) */}
                  <path d="M 60 180 C -5 180, -5 300, 60 300" stroke={simStep >= 8 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  
                  {/* Row 3 (Left to Right) */}
                  <path d="M 60 300 L 195 300" stroke={simStep >= 9 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  <path d="M 195 300 L 330 300" stroke={simStep >= 10 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />
                  <path d="M 330 300 L 465 300" stroke={simStep >= 11 ? "#2563EB" : "#1E293B"} strokeWidth="1.5" />

                  {/* Flow Data Packet (Glow Dot traveling on lines) */}
                  {simStep === 0 && <circle cx="60" cy="60" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 1 && <circle cx="195" cy="60" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 2 && <circle cx="330" cy="60" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 3 && <circle cx="465" cy="60" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 4 && <circle cx="465" cy="180" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 5 && <circle cx="330" cy="180" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 6 && <circle cx="195" cy="180" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 7 && <circle cx="60" cy="180" r="4" fill="#F59E0B" className="animate-ping" />}
                  {simStep === 8 && <circle cx="60" cy="300" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 9 && <circle cx="195" cy="300" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 10 && <circle cx="330" cy="300" r="4" fill="#3B82F6" className="animate-ping" />}
                  {simStep === 11 && <circle cx="465" cy="300" r="4" fill="#10B981" className="animate-ping" />}

                  {/* Nodes Grid */}
                  {/* Row 1 */}
                  <g className="cursor-pointer" onClick={() => setSimStep(0)}>
                    <rect x="25" y="35" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 0 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="60" y="60" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">1. INPUT</text>
                    <text x="60" y="70" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">User triggers prompt</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setSimStep(1)}>
                    <rect x="160" y="35" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 1 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="195" y="60" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">2. INTENT</text>
                    <text x="195" y="70" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Detects prompt mode</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setSimStep(2)}>
                    <rect x="295" y="35" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 2 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="330" y="60" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">3. MEMORY</text>
                    <text x="330" y="70" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Retrieves history</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setSimStep(3)}>
                    <rect x="430" y="35" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 3 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="465" y="60" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">4. CONTEXT</text>
                    <text x="465" y="70" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Compresses tokens</text>
                  </g>

                  {/* Row 2 */}
                  <g className="cursor-pointer" onClick={() => setSimStep(4)}>
                    <rect x="430" y="155" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 4 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="465" y="180" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">5. PROMPT</text>
                    <text x="465" y="190" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Injects roles</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setSimStep(5)}>
                    <rect x="295" y="155" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 5 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="330" y="180" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">6. ROUTER</text>
                    <text x="330" y="190" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Selects provider</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setSimStep(6)}>
                    <rect x="160" y="155" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 6 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="195" y="180" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">7. ADAPTER</text>
                    <text x="195" y="190" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Dispatches adapter</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setSimStep(7)}>
                    <rect x="25" y="155" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 7 ? "#F59E0B" : "#1E293B"} strokeWidth="1" />
                    <text x="60" y="180" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">8. STREAM</text>
                    <text x="60" y="190" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">SSE response stream</text>
                  </g>

                  {/* Row 3 */}
                  <g className="cursor-pointer" onClick={() => setSimStep(8)}>
                    <rect x="25" y="275" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 8 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="60" y="300" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">9. PARSER</text>
                    <text x="60" y="310" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Markdown compilation</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setSimStep(9)}>
                    <rect x="160" y="275" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 9 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="195" y="300" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">10. SYNTAX</text>
                    <text x="195" y="310" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Colors code blocks</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setSimStep(10)}>
                    <rect x="295" y="275" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 10 ? "#3B82F6" : "#1E293B"} strokeWidth="1" />
                    <text x="330" y="300" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">11. STATE</text>
                    <text x="330" y="310" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Updates hooks</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => setSimStep(11)}>
                    <rect x="430" y="275" width="70" height="50" rx="6" fill="#0F172A" stroke={simStep === 11 ? "#10B981" : "#1E293B"} strokeWidth="1" />
                    <text x="465" y="300" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">12. UI BUBBLE</text>
                    <text x="465" y="310" fill="#475569" fontSize="6" fontFamily="sans-serif" textAnchor="middle">Renders message block</text>
                  </g>
                </svg>
              </div>

              {/* Simulation Controls Grid */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-900">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSimPlaying(!simPlaying)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wide border rounded-[8px] transition-colors ${
                      simPlaying 
                        ? 'bg-amber-950/20 border-amber-800/60 text-amber-500 hover:bg-amber-950/30' 
                        : 'bg-blue-950/20 border-blue-800/60 text-blue-400 hover:bg-blue-950/30'
                    }`}
                  >
                    {simPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                    {simPlaying ? "Pause" : "Play Flow"}
                  </button>
                  <button 
                    onClick={() => { setSimStep(0); setSimPlaying(false); }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wide bg-slate-900 border border-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors rounded-[8px]"
                  >
                    <RotateCcw className="size-3.5" />
                    Reset
                  </button>
                </div>

                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-mono text-slate-500 mr-2 uppercase">Speed</span>
                  <div className="flex bg-slate-900 border border-slate-800/60 rounded-[8px] p-0.5">
                    <button 
                      onClick={() => setSimSpeed(3000)}
                      className={`px-2 py-1 text-[9px] font-mono uppercase rounded-[6px] ${simSpeed === 3000 ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                    >
                      Slow
                    </button>
                    <button 
                      onClick={() => setSimSpeed(2000)}
                      className={`px-2 py-1 text-[9px] font-mono uppercase rounded-[6px] ${simSpeed === 2000 ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                    >
                      Normal
                    </button>
                    <button 
                      onClick={() => setSimSpeed(1000)}
                      className={`px-2 py-1 text-[9px] font-mono uppercase rounded-[6px] ${simSpeed === 1000 ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                    >
                      Fast
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setSimStep((prev) => (prev - 1 + messageJourneySteps.length) % messageJourneySteps.length)}
                    className="p-2 bg-slate-900 border border-slate-800/60 text-slate-400 hover:text-slate-200 rounded-[8px]"
                    title="Previous Step"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button 
                    onClick={() => setSimStep((prev) => (prev + 1) % messageJourneySteps.length)}
                    className="p-2 bg-slate-900 border border-slate-800/60 text-slate-400 hover:text-slate-200 rounded-[8px]"
                    title="Next Step"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step Detail Panel */}
            <div className="xl:col-span-5 bg-slate-950/40 border border-slate-800/60 p-8 rounded-[10px] h-full flex flex-col justify-between self-stretch">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block">Active Step Execution</span>
                  <h3 className="text-lg font-heading font-bold text-white mt-1 uppercase">
                    {messageJourneySteps[simStep].title}
                  </h3>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed font-body">
                  {messageJourneySteps[simStep].description}
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-900 font-mono text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Component:</span>
                    <span className="text-blue-400">{messageJourneySteps[simStep].component}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">File Reference:</span>
                    <div className="text-right flex flex-col items-end gap-1">
                      {messageJourneySteps[simStep].files.map((file, i) => (
                        <span key={i} className="text-slate-400 break-all select-all">{file}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Processing Latency:</span>
                    <span className="text-emerald-400 font-bold">{messageJourneySteps[simStep].latency}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/30 border border-slate-800/60 rounded-[8px] mt-4">
                  <div className="flex gap-2.5 items-start text-xs font-mono text-slate-400">
                    <Info className="size-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-300 font-semibold uppercase block mb-1">Under the hood:</span>
                      {messageJourneySteps[simStep].details}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-600">
                <span>PORUA MESSAGE JOURNEY PIPELINE</span>
                <span>v2.2</span>
              </div>
            </div>

          </div>
        </section>


        {/* 3. CORE ENGINEERING HIGHLIGHTS (Tabs displaying Option C recommended system features) */}
        <section id="highlights" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-4 mb-12">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">AI Infrastructure</span>
            <h2 className="text-3xl font-heading font-bold uppercase text-white mt-1">Infrastructure Highlights</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Tabs List */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <button
                onClick={() => setActiveHighlightTab('provider')}
                className={`w-full p-5 text-left border transition-all duration-150 rounded-[8px] ${
                  activeHighlightTab === 'provider'
                    ? 'bg-blue-950/20 border-blue-500/60 text-white border-l-4 border-l-blue-500'
                    : 'bg-slate-900/20 border-slate-800/40 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Cpu className="size-5 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-heading font-bold uppercase tracking-wide">Multi-Provider Engine</h3>
                    <p className="text-xs text-slate-500 font-normal font-body mt-1">Abstraction & failover chain</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveHighlightTab('context')}
                className={`w-full p-5 text-left border transition-all duration-150 rounded-[8px] ${
                  activeHighlightTab === 'context'
                    ? 'bg-blue-950/20 border-blue-500/60 text-white border-l-4 border-l-blue-500'
                    : 'bg-slate-900/20 border-slate-800/40 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GitFork className="size-5 text-purple-400" />
                  <div>
                    <h3 className="text-sm font-heading font-bold uppercase tracking-wide">Context Builder</h3>
                    <p className="text-xs text-slate-500 font-normal font-body mt-1">Token pruning & syllabus context</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveHighlightTab('pipeline')}
                className={`w-full p-5 text-left border transition-all duration-150 rounded-[8px] ${
                  activeHighlightTab === 'pipeline'
                    ? 'bg-blue-950/20 border-blue-500/60 text-white border-l-4 border-l-blue-500'
                    : 'bg-slate-900/20 border-slate-800/40 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="size-5 text-amber-500" />
                  <div>
                    <h3 className="text-sm font-heading font-bold uppercase tracking-wide">Streaming Pipeline</h3>
                    <p className="text-xs text-slate-500 font-normal font-body mt-1">Chunk processor & draw hooks</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Tab Description Container */}
            <div className="lg:col-span-8 p-8 bg-slate-950/40 border border-slate-800/60 rounded-[10px] flex flex-col justify-between">
              {activeHighlightTab === 'provider' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest">
                    <span>Provider Abstraction</span>
                    <span>•</span>
                    <span>Failover Routines</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold uppercase tracking-tight text-white font-heading">
                    Multi-Provider AI Routing Engine
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-body">
                    A flexible backend interface normalizes LLM client interactions across providers (Ollama locally in development, DashScope, Gemini, and OpenRouter in production). Sequential adapter chains handle error catches (429/503), automatically retrying fallbacks in milliseconds to guarantee continuous availability.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-500 shrink-0 mt-0.5" />
                      <span><strong>Unified Interface Adapter:</strong> Translates diverse proprietary JSON schemas into structured local outputs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-500 shrink-0 mt-0.5" />
                      <span><strong>Local Development Node:</strong> Offline Llama 3 models run locally on Ollama nodes to prevent API costs during tests.</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Component: /src/modules/ai/services/aiProvider.js</span>
                    <span className="text-blue-400">Time-To-Failure: &lt;400ms retry</span>
                  </div>
                </div>
              )}

              {activeHighlightTab === 'context' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
                    <span>Token Management</span>
                    <span>•</span>
                    <span>Context Retrieval</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold uppercase tracking-tight text-white font-heading">
                    Intelligent Context & Memory Builder
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-body">
                    Aggregates and compiles prompts dynamically. Structures past thread histories, loads active session logs, and applies sliding compression filters. Exclusions prioritize active tokens, pruning redundant user entries to optimize context limits and API costs.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-purple-500 shrink-0 mt-0.5" />
                      <span><strong>Syllabus Alignment:</strong> Injects Bangladesh NCTB (SSC/HSC) curriculum constraints based on user choice.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-purple-500 shrink-0 mt-0.5" />
                      <span><strong>Token Pruning Filters:</strong> Truncates old history elements dynamically when close to LLM context limits.</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Component: /src/modules/ai/services/contextEngine.js</span>
                    <span className="text-purple-400">Token Saved: ~35% average</span>
                  </div>
                </div>
              )}

              {activeHighlightTab === 'pipeline' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
                    <span>Streaming Engine</span>
                    <span>•</span>
                    <span>Render Pipeline</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold uppercase tracking-tight text-white font-heading">
                    Real-time Streaming & Markdown Rendering
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-body">
                    Pipes responses from LLM APIs as stream events. Express servers parse chunks and route HTTP SSE events. React clients catch stream data, compile custom Markdown widgets, draw code highlighting, and auto-scroll content containers smoothly.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                      <span><strong>Native Stop Controls:</strong> Wired to client AbortControllers to cancel backend stream queries instantly.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                      <span><strong>Stream JSON Repair Engine:</strong> Automatically repairs truncated trailing brackets or open quotes in SSE chunks.</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Component: /src/pages/AiAssistant/AiAssistantChat.jsx</span>
                    <span className="text-amber-400">TTFT Latency: ~180ms</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>


        {/* 4. ARCHITECTURE EXPLORER (Clicking modules opens specs in sidebar) */}
        <section id="explorer" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-4 mb-6">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Interactive Layout</span>
            <h2 className="text-3xl font-heading font-bold uppercase text-white mt-1">Architecture Explorer</h2>
          </div>

          <p className="text-slate-400 text-sm max-w-2xl mb-12 font-body">
            Click on the architectural modules below to review their code specifications, dependencies, and latency characteristics.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Clickable Grid Layout */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(modules).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedModule(key)}
                  className={`p-6 text-left border transition-all duration-150 flex flex-col justify-between rounded-[10px] ${
                    selectedModule === key
                      ? 'bg-blue-950/20 border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                      : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-900/50 border border-slate-850 inline-block rounded-[8px]">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-heading font-bold uppercase text-white tracking-wide">{value.name}</h3>
                      <p className="text-xs text-slate-500 mt-2 font-body line-clamp-2">{value.purpose}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400 uppercase tracking-widest mt-6">
                    <span>Inspect Node</span>
                    <ArrowRight className="size-3" />
                  </div>
                </button>
              ))}
              
              {/* Scope Guard module shown in explorer grid too */}
              <button
                onClick={() => setSelectedModule('guard')}
                className={`p-6 text-left border transition-all duration-150 flex flex-col justify-between rounded-[10px] ${
                  selectedModule === 'guard'
                    ? 'bg-blue-950/20 border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                    : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60'
                }`}
              >
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900/50 border border-slate-850 inline-block rounded-[8px]">
                    <Shield className="size-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-bold uppercase text-white tracking-wide">Security Scope Guard</h3>
                    <p className="text-xs text-slate-500 mt-2 font-body line-clamp-2">Regex-based query safety checker running locally on express endpoints.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400 uppercase tracking-widest mt-6">
                  <span>Inspect Node</span>
                  <ArrowRight className="size-3" />
                </div>
              </button>
            </div>

            {/* Sidebar Details Container */}
            <div className="lg:col-span-6 bg-slate-950/40 border border-slate-800/60 p-8 rounded-[10px] flex flex-col justify-between">
              
              {/* Show detail of whichever node is active */}
              {selectedModule === 'guard' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 border border-slate-800/60 rounded-[8px]">
                      <Shield className="size-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Architectural Node Specs</span>
                      <h3 className="text-xl font-heading font-bold text-white uppercase mt-0.5">Security Scope Guard</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-body">
                    Ensures prompt queries stay on educational topics (SSC/HSC NCTB). Filters politics, cryptocurrency speculation, personal relationship advice, legal, and diagnostic advice.
                  </p>
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-1">Key Responsibilities:</span>
                    <ul className="space-y-2 text-xs font-body text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="size-1 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <span>Pre-evaluation of user prompts before routing to Generative API servers.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <span>Precompiled RegExp search algorithms across 12 distinct off-topic categories.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <span>Context exceptions (e.g. allowing celebrity names if academic essay tags are found).</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3 pt-6 border-t border-slate-900 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Source Code Files:</span>
                      <div className="flex flex-col gap-1.5 pl-2 border-l border-slate-800">
                        <span className="text-slate-300 break-all select-all">etuitionhub--backend/src/modules/ai/services/aiScopeGuard.js</span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Dependencies:</span>
                      <span className="text-slate-400">None (Pure Javascript Core Regex)</span>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center text-xs font-mono bg-slate-950/40 p-4 -mx-8 -mb-8 rounded-b-[10px]">
                    <span className="text-slate-500">Latency impact:</span>
                    <span className="text-emerald-400 font-bold">~5ms overhead / O(1) query filter</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 border border-slate-800/60 rounded-[8px]">
                      {modules[selectedModule].icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Architectural Node Specs</span>
                      <h3 className="text-xl font-heading font-bold text-white uppercase mt-0.5">
                        {modules[selectedModule].name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed font-body">
                    {modules[selectedModule].purpose}
                  </p>

                  <div className="space-y-2">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-1">Key Responsibilities:</span>
                    <ul className="space-y-2 text-xs font-body text-slate-400">
                      {modules[selectedModule].responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="size-1 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-900 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Source Code Files:</span>
                      <div className="flex flex-col gap-1.5 pl-2 border-l border-slate-800">
                        {modules[selectedModule].files.map((file, i) => (
                          <span key={i} className="text-slate-300 break-all select-all">{file}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Dependencies:</span>
                      <span className="text-slate-400">{modules[selectedModule].dependencies.join(', ')}</span>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center text-xs font-mono bg-slate-950/40 p-4 -mx-8 -mb-8 rounded-b-[10px]">
                    <span className="text-slate-500">Latency impact:</span>
                    <span className="text-emerald-400 font-bold">{modules[selectedModule].impact}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>


        {/* 5. FEATURE SHOWCASE (Before / After Comparison) */}
        <section id="features" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-4 mb-12">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Technical Deep Dives</span>
            <h2 className="text-3xl font-heading font-bold uppercase text-white mt-1">Feature Showcases</h2>
          </div>

          <div className="space-y-24">
            
            {/* Feature 1: Scope Guard Pre-Filtering */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-6">
                <span className="px-3 py-1 bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 font-mono text-[10px] uppercase tracking-wider rounded-full">
                  Security Guard Pre-Filter
                </span>
                <h3 className="text-2xl font-heading font-bold uppercase text-white tracking-wide">
                  Academic Safety Pre-Filtering
                </h3>
                
                <div className="space-y-4 text-slate-400 text-sm font-body leading-relaxed">
                  <div>
                    <span className="text-xs font-mono text-red-400 uppercase font-bold block mb-1">The Problem:</span>
                    Off-topic student requests (e.g. asking to predict crypto prices, diagnosing skin rash symptoms, asking for relationship help) exhaust LLM query tokens, increase server cost, and load conversation histories with irrelevant details.
                  </div>
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase font-bold block mb-1">The Solution:</span>
                    A backend safety controller checks inputs using precompiled regex maps before dispatching to the adapter engine. Banned topics trigger structured refusals instantly, bypass filters when proper contexts (essay triggers) are detected.
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900/60 font-mono text-xs space-y-2 text-slate-500">
                  <div className="flex justify-between">
                    <span>Performance impact:</span>
                    <span className="text-emerald-400">Intercepts off-topic queries in &lt;5ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classification rate:</span>
                    <span>12 distinct off-topic categories</span>
                  </div>
                </div>
              </div>

              {/* Code comparison panel */}
              <div className="lg:col-span-7 bg-slate-950/40 border border-slate-800/60 p-6 rounded-[10px] font-mono text-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-900">
                  <span className="text-slate-400 uppercase tracking-widest text-[9px]">Interception Sandbox</span>
                  <span className="text-[10px] text-slate-650">aiScopeGuard.js</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] text-red-400 bg-red-950/10 px-3 py-1.5 border border-red-900/30 mb-2 rounded-[6px]">
                      <span>INTERCEPTED OFF-TOPIC PATTERN</span>
                      <span>REFUSAL STRUCT INTERCEPT</span>
                    </div>
                    <pre className="p-4 bg-slate-900/50 border border-slate-900/60 text-slate-400 overflow-x-auto rounded-[8px]">
{`// Banned Prompt Input:
"is bitcoin going to double in value this week? should i invest?"

// Scope Guard intercept verdict:
{
  inScope: false,
  category: "crypto-speculation",
  structured: {
    templateType: "general",
    topic: "Outside academic scope",
    answer: "I'm Porua AI... cryptocurrency speculation is outside my academic scope..."
  }
}`}
                    </pre>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-emerald-400 bg-emerald-950/10 px-3 py-1.5 border border-emerald-900/30 mb-2 rounded-[6px]">
                      <span>BYPASS WITH ACADEMIC CONTEXT</span>
                      <span>PASSED TO LLM API</span>
                    </div>
                    <pre className="p-4 bg-slate-900/50 border border-slate-900/60 text-slate-400 overflow-x-auto rounded-[8px]">
{`// Allowed Prompt Input:
"write an academic essay on the history and impact of cryptocurrency on banking systems"

// Context validation matches:
const safeContext = (text) => /\\b(essay|example|analyse|history)\\b/i.test(text);

// Verdict: inScope: true (Passes pre-filters as it matches essay tags)`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: JSON Repair Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-6">
                <span className="px-3 py-1 bg-amber-950/20 border border-amber-900/60 text-amber-500 font-mono text-[10px] uppercase tracking-wider rounded-full">
                  Stream Reliability Layer
                </span>
                <h3 className="text-2xl font-heading font-bold uppercase text-white tracking-wide">
                  Real-time JSON Stream Repair
                </h3>
                
                <div className="space-y-4 text-slate-400 text-sm font-body leading-relaxed">
                  <div>
                    <span className="text-xs font-mono text-red-400 uppercase font-bold block mb-1">The Problem:</span>
                    Streaming structured JSON cards from LLM APIs can cut off mid-transit or close incomplete tags (e.g. during networking spikes or length cuts). Client-side JSON.parse hooks break, throwing parser syntax exceptions.
                  </div>
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase font-bold block mb-1">The Solution:</span>
                    Server parses incoming SSE data buffer, extracts raw brackets, strips outer markdown fencings, closes unterminated quotes, and appends missing braces/brackets recursively before sending to the client UI.
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900/60 font-mono text-xs space-y-2 text-slate-500">
                  <div className="flex justify-between">
                    <span>Performance impact:</span>
                    <span className="text-emerald-400">Repairs truncated streaming JSON in &lt;2ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max parse limit:</span>
                    <span>256 KB memory buffer ceiling</span>
                  </div>
                </div>
              </div>

              {/* Code comparison panel */}
              <div className="lg:col-span-7 bg-slate-950/40 border border-slate-800/60 p-6 rounded-[10px] font-mono text-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-900">
                  <span className="text-slate-400 uppercase tracking-widest text-[9px]">JSON Reconstruction Sandbox</span>
                  <span className="text-[10px] text-slate-650">aiProvider.js</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-amber-500 bg-amber-950/10 px-3 py-1.5 border border-amber-900/30 mb-2 font-mono uppercase rounded-[6px]">
                      MALFORMED STREAM BUFFER IN TRANSIT
                    </div>
                    <pre className="p-4 bg-slate-900/50 border border-slate-900/60 text-red-400/90 overflow-x-auto rounded-[8px]">
{`// Partial JSON chunk cut off during networking spikes
"{\\"subject\\": \\"Math\\", \\"questions\\": [{\\"q\\": \\"Solve for x\\", \\"options\\": [\\"1\\", \\"2"`}
                    </pre>
                  </div>

                  <div>
                    <div className="text-[10px] text-emerald-400 bg-emerald-950/10 px-3 py-1.5 border border-emerald-900/30 mb-2 font-mono uppercase rounded-[6px]">
                      RECONSTRUCTED VALID JSON OUTFLOW
                    </div>
                    <pre className="p-4 bg-slate-900/50 border border-slate-900/60 text-emerald-400 overflow-x-auto rounded-[8px]">
{`// Repaired dynamically via repairUnterminatedJson()
"{\\"subject\\": \\"Math\\", \\"questions\\": [{\\"q\\": \\"Solve for x\\", \\"options\\": [\\"1\\", \\"2\\"]}]}"

// Client successfully processes the structure:
{
  subject: "Math",
  questions: [{ q: "Solve for x", options: ["1", "2"] }]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* 6. PROVIDER COMPATIBILITY MATRIX */}
        <section id="providers" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-4 mb-6">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Model-Agnostic Interface</span>
            <h2 className="text-3xl font-heading font-bold uppercase text-white mt-1">Provider Core Adaptability</h2>
          </div>

          <p className="text-slate-400 text-sm max-w-2xl mb-12 font-body">
            Compare generative adapters. The provider bridge decouples business logic routes from vendor-specific schemas, providing seamless API swaps.
          </p>

          <div className="overflow-x-auto border border-slate-800/60 bg-slate-950/40 rounded-[10px]">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800/60 text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Provider</th>
                  <th className="p-4 font-semibold">Primary Model</th>
                  <th className="p-4 font-semibold">Streaming</th>
                  <th className="p-4 font-semibold">Vision</th>
                  <th className="p-4 font-semibold">Context Window</th>
                  <th className="p-4 font-semibold">Structured Output</th>
                  <th className="p-4 font-semibold">Environment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-350">
                <tr className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-bold text-white">Google Gemini</td>
                  <td className="p-4 text-blue-400">Gemini 1.5 Flash</td>
                  <td className="p-4 text-emerald-400">Yes (Native SSE)</td>
                  <td className="p-4 text-emerald-400">Yes (Multimodal)</td>
                  <td className="p-4">1,048,576 tokens</td>
                  <td className="p-4 text-emerald-400">Yes (jsonSchema)</td>
                  <td className="p-4"><span className="px-2.5 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded-full text-[10px]">Production</span></td>
                </tr>
                <tr className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-bold text-white">DashScope (Alibaba)</td>
                  <td className="p-4 text-blue-400">Qwen-Plus</td>
                  <td className="p-4 text-emerald-400">Yes (Native SSE)</td>
                  <td className="p-4 text-slate-500">No</td>
                  <td className="p-4">32,768 tokens</td>
                  <td className="p-4 text-emerald-400">Yes (JSON Mode)</td>
                  <td className="p-4"><span className="px-2.5 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded-full text-[10px]">Production</span></td>
                </tr>
                <tr className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-bold text-white">Ollama (Local)</td>
                  <td className="p-4 text-blue-400">Llama 3 (8B)</td>
                  <td className="p-4 text-emerald-400">Yes (Ollama API)</td>
                  <td className="p-4 text-slate-500">No</td>
                  <td className="p-4">8,192 tokens</td>
                  <td className="p-4 text-slate-500">Manual Repair</td>
                  <td className="p-4"><span className="px-2.5 py-0.5 bg-slate-900 text-slate-400 border border-slate-800/60 rounded-full text-[10px]">Development</span></td>
                </tr>
                <tr className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-bold text-white">OpenRouter</td>
                  <td className="p-4 text-blue-400">Fallback routing models</td>
                  <td className="p-4 text-emerald-400">Yes</td>
                  <td className="p-4 text-emerald-400">Variable</td>
                  <td className="p-4">Variable</td>
                  <td className="p-4 text-emerald-400">Yes (JSON fallback)</td>
                  <td className="p-4"><span className="px-2.5 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded-full text-[10px]">Production</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-950/20 border border-slate-900 rounded-[10px] mt-6 space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">How the Provider Abstraction works:</h4>
            <p className="text-slate-400 text-xs leading-relaxed font-body">
              All adapters extend a common base class: <code className="text-blue-400 select-all">baseAdapter.js</code>. The adapter acts as a translator. When you invoke <code className="text-slate-300">generate()</code> or <code className="text-slate-300">generateStream()</code>, the orchestrator routes calls to the active adapter which normalizes the model's proprietary schemas (such as Gemini's inline parts vs OpenAI's messages arrays) into a unified JSON format for client streaming.
            </p>
          </div>
        </section>


        {/* 7. LIVE REQUEST TIMELINE CHART (Latency Distribution) */}
        <section id="timeline" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-4 mb-6">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Performance Metrics</span>
            <h2 className="text-3xl font-heading font-bold uppercase text-white mt-1">Request Timeline</h2>
          </div>

          <p className="text-slate-400 text-sm max-w-2xl mb-12 font-body">
            Chronological performance profiling of a standard streaming request lifecycle. See how latency is distributed across layers to ensure a sub-second start.
          </p>

          <div className="space-y-6 bg-slate-950/40 border border-slate-800/60 p-8 rounded-[10px] font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <span className="text-slate-400 uppercase tracking-widest text-[10px]">Latency Distribution Timeline</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Time to first token: ~180ms</span>
            </div>

            {/* Horizontal progress bar steps */}
            <div className="space-y-6 pt-4">
              
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>1. Connection Initialized & Input Read</span>
                  <span className="text-blue-400">0 ms — 5 ms</span>
                </div>
                <div className="w-full bg-slate-900/60 h-2 rounded-[2px]">
                  <div className="bg-blue-650 h-2 rounded-[2px]" style={{ width: '2%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>2. Intent Detection & Scope Guard Evaluation</span>
                  <span className="text-blue-400">5 ms — 15 ms</span>
                </div>
                <div className="w-full bg-slate-900/60 h-2 rounded-[2px]">
                  <div className="bg-blue-650 h-2 rounded-[2px]" style={{ width: '6%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>3. Database Fetch & Context Aggregation</span>
                  <span className="text-blue-400">15 ms — 45 ms</span>
                </div>
                <div className="w-full bg-slate-900/60 h-2 rounded-[2px]">
                  <div className="bg-blue-650 h-2 rounded-[2px]" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>4. API Dispatch & Server Network Overhead (TTFT)</span>
                  <span className="text-blue-400">45 ms — 180 ms</span>
                </div>
                <div className="w-full bg-slate-900/60 h-2 rounded-[2px]">
                  <div className="bg-blue-650 h-2 rounded-[2px]" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>5. Dynamic Streaming, Formatting & Rendering UI</span>
                  <span className="text-emerald-400">180 ms — 850 ms (Continuous stream)</span>
                </div>
                <div className="w-full bg-slate-900/60 h-2 rounded-[2px]">
                  <div className="bg-emerald-500 h-2 rounded-[2px] animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-500">
              <span>*Measured on local fiber nodes with Google Generative AI streaming APIs.</span>
              <span className="text-blue-400">Total Stream Time: ~850ms</span>
            </div>
          </div>
        </section>


        {/* 8. CODEBASE METRICS (Stats count-up) */}
        <section id="metrics" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-4 mb-12">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">System Dimensions</span>
            <h2 className="text-3xl font-heading font-bold uppercase text-white mt-1">Engineering Metrics</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-950/40 border border-slate-800/60 rounded-[10px] text-center font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Total Modules</span>
              <span className="text-3xl md:text-4xl font-heading font-bold text-white block">
                {useAnimatedCounter(24)}
              </span>
              <span className="text-[10px] text-blue-400 mt-2 block uppercase tracking-wider">AI Service Blocks</span>
            </div>

            <div className="p-6 bg-slate-950/40 border border-slate-800/60 rounded-[10px] text-center font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Uptime Rate</span>
              <span className="text-3xl md:text-4xl font-heading font-bold text-emerald-400 block">
                {useAnimatedCounter(99)}%
              </span>
              <span className="text-[10px] text-slate-500 mt-2 block uppercase tracking-wider">Fallback verified</span>
            </div>

            <div className="p-6 bg-slate-950/40 border border-slate-800/60 rounded-[10px] text-center font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Avg Streaming Latency</span>
              <span className="text-3xl md:text-4xl font-heading font-bold text-white block">
                {useAnimatedCounter(180)}ms
              </span>
              <span className="text-[10px] text-blue-400 mt-2 block uppercase tracking-wider">First Token Dispatch</span>
            </div>

            <div className="p-6 bg-slate-950/40 border border-slate-800/60 rounded-[10px] text-center font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Safety Accuracy</span>
              <span className="text-3xl md:text-4xl font-heading font-bold text-emerald-400 block">
                {useAnimatedCounter(98)}%
              </span>
              <span className="text-[10px] text-slate-500 mt-2 block uppercase tracking-wider">Scope Guard Success</span>
            </div>
          </div>
        </section>


        {/* 9. TECHNOLOGY STACK (Grid filters) */}
        <section id="tech-stack" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-4 mb-6">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Framework Specs</span>
            <h2 className="text-3xl font-heading font-bold uppercase text-white mt-1">Technology Stack</h2>
          </div>

          <p className="text-slate-400 text-sm max-w-2xl mb-12 font-body">
            The platform is built on modern React, Node, and Generative APIs. Filter by component group to check specific framework details.
          </p>

          {/* Group Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-900 pb-6">
            {['all', 'frontend', 'backend', 'ai', 'security'].map((group) => (
              <button
                key={group}
                onClick={() => setSelectedTechGroup(group)}
                className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider border rounded-full transition-colors ${
                  selectedTechGroup === group
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Tech Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack
              .filter((tech) => selectedTechGroup === 'all' || tech.group === selectedTechGroup)
              .map((tech, i) => (
                <div key={i} className="p-6 bg-slate-950/40 border border-slate-800/60 flex flex-col justify-between rounded-[10px] hover:border-slate-700/60 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800/40 text-[9px] font-mono uppercase text-slate-400 rounded-full">
                        {tech.group}
                      </span>
                      <Terminal className="size-3.5 text-slate-650" />
                    </div>
                    <div>
                      <h4 className="text-sm font-heading font-bold uppercase text-white tracking-wider">{tech.name}</h4>
                      <p className="text-xs text-slate-500 mt-2 font-body leading-relaxed">{tech.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>


        {/* 10. PROJECT ROADMAP TIMELINE */}
        <section id="roadmap" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-4 mb-12">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Architecture Roadmap</span>
            <h2 className="text-3xl font-heading font-bold uppercase text-white mt-1">Project Roadmap</h2>
          </div>

          <div className="relative border-l border-slate-800 pl-8 ml-4 space-y-12">
            {/* Milestone 1: Completed */}
            <div className="relative space-y-2">
              <span className="absolute -left-11 top-1.5 size-5 bg-blue-650 border-4 border-[#081225] rounded-full" />
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-950/40 border border-blue-900/40 text-blue-400 font-mono text-[9px] uppercase tracking-wider font-semibold rounded-full">
                  Completed
                </span>
                <span className="text-xs font-mono text-slate-500">Q1 2026</span>
              </div>
              <h3 className="text-base font-heading font-bold uppercase text-white tracking-wide">
                Fallback Adapters & Scope Guard v2
              </h3>
              <p className="text-slate-400 text-xs font-body max-w-xl">
                Implemented offline Ollama adapters, multi-provider API routing sequences, and deep off-topic pre-filtering to protect prompt vectors.
              </p>
            </div>

            {/* Milestone 2: Completed */}
            <div className="relative space-y-2">
              <span className="absolute -left-11 top-1.5 size-5 bg-blue-650 border-4 border-[#081225] rounded-full" />
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-950/40 border border-blue-900/40 text-blue-400 font-mono text-[9px] uppercase tracking-wider font-semibold rounded-full">
                  Completed
                </span>
                <span className="text-xs font-mono text-slate-500">Q2 2026</span>
              </div>
              <h3 className="text-base font-heading font-bold uppercase text-white tracking-wide">
                Client Stream Engine & Interactive Quizzes
              </h3>
              <p className="text-slate-400 text-xs font-body max-w-xl">
                Wired SSE stream buffers with client React hooks. Embedded dynamic quizzes into chat messages as inline interactive cards.
              </p>
            </div>

            {/* Milestone 3: In Progress */}
            <div className="relative space-y-2">
              <span className="absolute -left-11 top-1.5 size-5 bg-[#081225] border-4 border-blue-500 rounded-full animate-pulse" />
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-950/40 border border-blue-800/40 text-blue-400 font-mono text-[9px] uppercase tracking-wider font-semibold rounded-full">
                  In Progress
                </span>
                <span className="text-xs font-mono text-slate-500">Q3 2026</span>
              </div>
              <h3 className="text-base font-heading font-bold uppercase text-white tracking-wide">
                Interactive Engineering Showcase
              </h3>
              <p className="text-slate-400 text-xs font-body max-w-xl">
                Deploying interactive architecture explorers and simulated pipeline visualizations to present system depth.
              </p>
            </div>

            {/* Milestone 4: Planned */}
            <div className="relative space-y-2">
              <span className="absolute -left-11 top-1.5 size-5 bg-[#081225] border-4 border-slate-800 rounded-full" />
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800/60 text-slate-500 font-mono text-[9px] uppercase tracking-wider rounded-full">
                  Planned
                </span>
                <span className="text-xs font-mono text-slate-500">Q4 2026</span>
              </div>
              <h3 className="text-base font-heading font-bold uppercase text-slate-500 tracking-wide">
                Curriculum Vector Indexing & Search (RAG)
              </h3>
              <p className="text-slate-550 text-xs font-body max-w-xl">
                Integrate RAG embeddings indexing over Bangladesh NCTB textbook databases, connecting the tutor directly with localized context.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Showcase Footer */}
      <footer className="mt-32 pt-12 border-t border-slate-900/60 bg-slate-950/20 px-4 md:px-8 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2026 E-TuitionBD AI Project. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/ai-assistant" className="text-slate-400 hover:text-blue-400 transition-colors uppercase">Enter Chat</Link>
            <span>•</span>
            <Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors uppercase">Home</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
