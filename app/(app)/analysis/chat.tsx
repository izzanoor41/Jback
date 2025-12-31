"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTeam } from "@/lib/store";
import { useChat } from "ai/react";
import { 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  Zap,
  Globe2,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  BarChart3,
  Languages
} from "lucide-react";
import { Session } from "next-auth";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

const quickActions = [
  { icon: BarChart3, label: "Summarize", prompt: "Give me a comprehensive summary of all feedback with key insights", color: "emerald" },
  { icon: TrendingUp, label: "Trends", prompt: "What are the main trends and patterns in customer feedback?", color: "blue" },
  { icon: Globe2, label: "Cultural", prompt: "Provide cultural insights from feedback across different regions and languages", color: "purple" },
  { icon: AlertCircle, label: "Problems", prompt: "Show me all negative feedback and complaints that need attention", color: "red" },
  { icon: ThumbsUp, label: "Positive", prompt: "What are customers loving? Show positive feedback highlights", color: "green" },
  { icon: Languages, label: "Languages", prompt: "Break down feedback by language and compare sentiment across regions", color: "orange" },
];

export default function Chat({ session }: { session: Session | null }) {
  const team = useTeam((state) => state.team);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [streamStatus, setStreamStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    body: {
      team: team,
      session: session,
    },
  });

  // Check Confluent stream health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/confluent-data');
        const data = await res.json();
        setStreamStatus(data.status === 'connected' ? 'connected' : 'disconnected');
      } catch {
        setStreamStatus('disconnected');
      }
    };
    checkHealth();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for quick prompt events from parent
  useEffect(() => {
    const handleQuickPrompt = (e: CustomEvent) => {
      setInput(e.detail);
      setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 100);
    };

    window.addEventListener('quickPrompt', handleQuickPrompt as EventListener);
    return () => window.removeEventListener('quickPrompt', handleQuickPrompt as EventListener);
  }, [setInput]);

  // Check for summarize all trigger from feedback page
  useEffect(() => {
    const shouldSummarize = sessionStorage.getItem('jback_summarize_all');
    if (shouldSummarize && messages.length === 0) {
      sessionStorage.removeItem('jback_summarize_all');
      setInput("Give me a comprehensive summary of all feedback with cultural insights, sentiment analysis, and actionable recommendations");
      setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 500);
    }
  }, [setInput, messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 100);
  };

  return (
    <div className="flex flex-col h-[650px]">
      {/* Stream Status Bar */}
      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            streamStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
            streamStatus === 'checking' ? 'bg-yellow-500 animate-pulse' :
            'bg-gray-400'
          }`} />
          <span className="text-xs text-gray-500">
            {streamStatus === 'connected' ? 'Confluent Stream Active' :
             streamStatus === 'checking' ? 'Connecting...' :
             'Offline Mode'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Zap className="w-3 h-3" />
          <span>Real-time AI</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            {/* Welcome Message */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Jback AI Agent
            </h3>
            <p className="text-gray-500 text-sm text-center max-w-md mb-6">
              I have access to your real-time feedback data from Confluent Cloud. 
              Ask me anything about customer sentiment, cultural patterns, or trends.
            </p>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.prompt)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left group hover:shadow-md ${
                    action.color === 'emerald' ? 'border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300' :
                    action.color === 'blue' ? 'border-blue-200 hover:bg-blue-50 hover:border-blue-300' :
                    action.color === 'purple' ? 'border-purple-200 hover:bg-purple-50 hover:border-purple-300' :
                    action.color === 'red' ? 'border-red-200 hover:bg-red-50 hover:border-red-300' :
                    action.color === 'green' ? 'border-green-200 hover:bg-green-50 hover:border-green-300' :
                    'border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                  }`}
                >
                  <action.icon className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                    action.color === 'emerald' ? 'text-emerald-500' :
                    action.color === 'blue' ? 'text-blue-500' :
                    action.color === 'purple' ? 'text-purple-500' :
                    action.color === 'red' ? 'text-red-500' :
                    action.color === 'green' ? 'text-green-500' :
                    'text-orange-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Capabilities */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">
                100+ Languages
              </span>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                Cultural Intelligence
              </span>
              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                Real-time Streaming
              </span>
              <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs">
                Sentiment Analysis
              </span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <div
                    className={`prose prose-sm max-w-none ${
                      m.role === "user" 
                        ? "prose-invert" 
                        : "prose-emerald prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-table:text-sm"
                    }`}
                    dangerouslySetInnerHTML={{ __html: marked(m.content) }}
                  />
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing feedback data...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form ref={formRef} onSubmit={handleSubmit} className="relative">
          <Label htmlFor="message" className="sr-only">
            Message
          </Label>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            id="message"
            placeholder="Ask about your feedback data... (Enter to send, Shift+Enter for new line)"
            className="min-h-[56px] max-h-[120px] resize-none pr-28 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-200 bg-gray-50"
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg gap-1.5 shadow-md shadow-emerald-500/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
