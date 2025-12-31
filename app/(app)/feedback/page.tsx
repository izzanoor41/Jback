"use client";

import { Button } from "@/components/ui/button";
import { Zap, MessageSquare, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTeam } from "@/lib/store";
import toast from "react-hot-toast";
import ListFeedback from "./list-feedback";


export default function FeedbackPage() {
  const router = useRouter();
  const team = useTeam((state) => state.team);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSummarizeAll = () => {
    sessionStorage.setItem('jback_summarize_all', 'true');
    router.push('/analysis');
  };

  const handleReanalyzeAll = async () => {
    if (!team?.id) return;
    
    setAnalyzing(true);
    toast.loading("Analyzing feedback with AI...");
    
    try {
      const res = await fetch('/api/feedback/analyze-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team.id }),
      });
      
      const data = await res.json();
      toast.dismiss();
      
      if (data.success) {
        toast.success(`Analyzed ${data.analyzed} feedback items`);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(data.message || 'Analysis failed');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to analyze feedback');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-500" />
            Feedback Inbox
          </h1>
          <p className="text-gray-500">
            Review and manage customer feedback with cultural intelligence
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button 
            variant="outline"
            onClick={handleReanalyzeAll}
            disabled={analyzing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? 'Analyzing...' : 'Re-analyze All'}
          </Button>
      
          <Button 
            onClick={handleSummarizeAll}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/20"
          >
            <Zap className="w-4 h-4" />
            Summarize All
          </Button>
        </div>
      </div>

      {/* Feedback List */}
      <ListFeedback />
    </div>
  );
}
