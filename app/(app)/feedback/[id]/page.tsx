"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Rating from "@/components/ui/rating";
import { 
  SmilePlus, 
  Globe, 
  Brain, 
  Zap, 
  ArrowLeft,
  CheckCircle,
  Clock,
  Languages,
  Lightbulb,
  MessageSquare
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Language mappings
const languageFlags: Record<string, string> = {
  en: '🇺🇸', ja: '🇯🇵', fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸',
  pt: '🇧🇷', zh: '🇨🇳', ko: '🇰🇷', it: '🇮🇹', ru: '🇷🇺',
  ar: '🇸🇦', hi: '🇮🇳', id: '🇮🇩', nl: '🇳🇱', th: '🇹🇭',
  vi: '🇻🇳', tr: '🇹🇷', pl: '🇵🇱', sv: '🇸🇪', da: '🇩🇰',
};

const languageNames: Record<string, string> = {
  en: 'English', ja: 'Japanese', fr: 'French', de: 'German',
  es: 'Spanish', pt: 'Portuguese', zh: 'Chinese', ko: 'Korean',
  it: 'Italian', ru: 'Russian', ar: 'Arabic', hi: 'Hindi', 
  id: 'Indonesian', nl: 'Dutch', th: 'Thai', vi: 'Vietnamese',
  tr: 'Turkish', pl: 'Polish', sv: 'Swedish', da: 'Danish',
};

interface Feedback {
  id: string;
  teamId: string;
  rate?: number;
  originalText?: string;
  translatedText?: string;
  detectedLanguage?: string;
  sentiment?: string;
  culturalNotes?: string;
  summary?: string;
  suggestions?: string;
  aiResponse?: string;
  streamSource?: string;
  isResolved: boolean;
  createdAt: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  relateds?: Array<{
    id: string;
    originalText?: string;
    translatedText?: string;
    sentiment?: string;
    detectedLanguage?: string;
  }>;
}

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      fetch(`/api/feedback/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFeedback(data.data);
          } else {
            toast.error(data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to load feedback");
        })
        .finally(() => setLoading(false));
    };

    fetchFeedback();
  }, [id]);

  const handleResolve = async (resolved: boolean) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isResolved: resolved }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(prev => prev ? { ...prev, isResolved: resolved } : null);
        toast.success(resolved ? "Marked as resolved" : "Reopened");
      }
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Feedback not found</h2>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const lang = feedback.detectedLanguage || 'en';
  const isTranslated = feedback.translatedText && feedback.translatedText !== feedback.originalText;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Feedback Detail</h1>
            <p className="text-sm text-muted-foreground">
              {moment(feedback.createdAt).format("MMMM D, YYYY [at] h:mm A")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {feedback.isResolved ? (
            <Button variant="outline" onClick={() => handleResolve(false)} className="gap-2">
              <Clock className="w-4 h-4" />
              Reopen
            </Button>
          ) : (
            <Button onClick={() => handleResolve(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="w-4 h-4" />
              Mark Resolved
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Original Feedback */}
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b py-3 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Customer Feedback
                </CardTitle>
                <div className="flex items-center gap-2">
                  {feedback.rate !== undefined && feedback.rate !== null && <Rating value={feedback.rate} />}
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    feedback.sentiment === "positive" ? "bg-emerald-100 text-emerald-700" :
                    feedback.sentiment === "negative" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    <SmilePlus className="w-3 h-3" />
                    {feedback.sentiment || 'neutral'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              {/* Translated Text (if different) */}
              {isTranslated && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <Languages className="w-4 h-4" />
                    Translated to English
                  </div>
                  <p className="text-base leading-relaxed">
                    &ldquo;{feedback.translatedText}&rdquo;
                  </p>
                </div>
              )}

              {/* Original Text */}
              <div className={isTranslated ? "pl-4 border-l-2 border-gray-200" : ""}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className="text-lg">{languageFlags[lang] || '🌍'}</span>
                  {isTranslated ? `Original (${languageNames[lang] || lang})` : languageNames[lang] || lang}
                </div>
                <p className={`leading-relaxed ${isTranslated ? "text-sm text-muted-foreground italic" : "text-base"}`}>
                  &ldquo;{feedback.originalText || feedback.translatedText || 'No content'}&rdquo;
                </p>
              </div>

              {/* Stream Source Badge */}
              {feedback.streamSource === 'kafka' && (
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full w-fit">
                  <Zap className="w-3 h-3" />
                  Processed via Confluent Kafka
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Cultural Intelligence */}
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b py-3 px-4 sm:px-6">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-600" />
                AI Cultural Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              {/* Cultural Notes */}
              {feedback.culturalNotes && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 mb-2">
                    <Globe className="w-4 h-4" />
                    Cultural Context
                  </div>
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    {feedback.culturalNotes}
                  </p>
                </div>
              )}

              {/* Summary */}
              {feedback.summary && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-700 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Summary
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {feedback.summary}
                  </p>
                </div>
              )}

              {/* Suggestions */}
              {feedback.suggestions && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-700 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    Recommended Action
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {feedback.suggestions}
                  </p>
                </div>
              )}

              {/* Fallback if no AI data */}
              {!feedback.culturalNotes && !feedback.summary && !feedback.suggestions && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No AI analysis available for this feedback</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer Info */}
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b py-3 px-4">
              <CardTitle className="text-sm font-semibold">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{feedback.customer?.name || 'Anonymous'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{feedback.customer?.email || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{feedback.customer?.phone || '-'}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {moment(feedback.createdAt).format("MMM D, YYYY")}
              </div>
            </CardFooter>
          </Card>

          {/* Status */}
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {feedback.isResolved ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Resolved
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    Open
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Feedback */}
          {feedback.relateds && feedback.relateds.length > 0 && (
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="bg-muted/30 border-b py-3 px-4">
                <CardTitle className="text-sm font-semibold">Related Feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {feedback.relateds.map((r) => (
                  <Link
                    href={`/feedback/${r.id}`}
                    key={r.id}
                    className={`block p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
                      r.sentiment === "positive" ? "border-l-4 border-l-emerald-500" :
                      r.sentiment === "negative" ? "border-l-4 border-l-red-500" :
                      "border-l-4 border-l-gray-400"
                    }`}
                  >
                    <p className="text-sm line-clamp-2">
                      {r.translatedText || r.originalText}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg">{languageFlags[r.detectedLanguage || 'en'] || '🌍'}</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        r.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                        r.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {r.sentiment}
                      </span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
