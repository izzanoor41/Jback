"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Chat from "./chat";
import { Brain, Zap } from "lucide-react";

export default function AnalysisPage() {
  const { data: session } = useSession();

  useEffect(() => {
    // Check if coming from "Summarize All" button - handled in chat component
    const shouldSummarize = sessionStorage.getItem('jback_summarize_all');
    if (shouldSummarize) {
      // Will be handled by chat component
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              AI Analysis Agent
              <span className="text-xs font-normal px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Confluent Powered
              </span>
            </h1>
            <p className="text-sm text-gray-500">Real-time feedback intelligence with cultural awareness</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <Chat session={session} />
      </div>
    </div>
  );
}
