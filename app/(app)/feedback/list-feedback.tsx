"use client";

import { useTeam } from "@/lib/store";
import { 
  PackageOpen, 
  Star, 
  MoreHorizontal,
  Trash2,
  Globe,
  Brain,
  Zap,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Language flags mapping
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
  customerId?: string;
  type?: string;
  rate?: number;
  originalText?: string;
  translatedText?: string;
  detectedLanguage?: string;
  sentiment?: string;
  culturalNotes?: string;
  summary?: string;
  suggestions?: string;
  isResolved: boolean;
  streamSource?: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    email?: string;
    name?: string;
  };
}

export default function ListFeedback() {
  const team = useTeam((state) => state.team);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getFeedbacks = async (teamId: string) => {
      setLoading(true);
      fetch(`/api/team/${teamId}/feedbacks`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setFeedbacks(data.data);
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => setLoading(false));
    };

    if (team) {
      getFeedbacks(team.id);
    }
  }, [team]);

  const filterFeedback = (tab: string) => {
    return feedbacks.filter(f => {
      const matchesSearch = searchQuery === '' || 
        (f.translatedText?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.originalText?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      switch (tab) {
        case 'positive': return f.sentiment === 'positive';
        case 'neutral': return f.sentiment === 'neutral';
        case 'negative': return f.sentiment === 'negative';
        default: return true;
      }
    });
  };

  const FeedbackCard = ({ item, index }: { item: Feedback; index: number }) => {
    const lang = item.detectedLanguage || 'en';
    const isTranslated = item.translatedText && item.translatedText !== item.originalText;
    const displayText = item.originalText || item.translatedText || '';
    
    return (
      <div
        onClick={() => router.push(`/feedback/${item.id}`)}
        className="group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md rounded-2xl p-5 transition-all duration-300 cursor-pointer break-inside-avoid mb-5"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            {/* Language Flag */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gray-100 border border-gray-200">
              {languageFlags[lang] || '🌍'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900">
                  {item.customer?.email || 'Anonymous'}
                </span>
                <span className="text-xs text-gray-500">• {moment(item.createdAt).fromNow()}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {/* Sentiment Badge */}
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                  item.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                  item.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {item.sentiment || 'unknown'}
                </span>
                {/* Rating */}
                {item.rate && (
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-gray-900">{item.rate}.0</span>
                  </div>
                )}
                {/* Stream Source */}
                {item.streamSource === 'kafka' && (
                  <div className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                    <Zap className="w-2.5 h-2.5" />
                    <span>Streamed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content - Translation */}
        <div className="space-y-2 mb-3">
          {isTranslated ? (
            <>
              {/* Translated Text (Primary) */}
              <p className="text-sm text-gray-900 leading-relaxed">
                &ldquo;{item.translatedText}&rdquo;
              </p>
              {/* Original Text */}
              <div className="pl-3 border-l-2 border-emerald-200">
                <p className="text-xs text-gray-500 italic">
                  Original ({languageNames[lang] || lang}): &ldquo;{item.originalText}&rdquo;
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-900 leading-relaxed">
              &ldquo;{displayText}&rdquo;
            </p>
          )}
        </div>

        {/* Cultural Notes */}
        {item.culturalNotes && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 mb-3">
            <Brain className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-800">{item.culturalNotes}</p>
          </div>
        )}

        {/* Summary */}
        {item.summary && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100 mb-3">
            <Globe className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800">{item.summary}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            {languageNames[lang] || lang}
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
        <PackageOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No feedback found</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        Try adjusting your filters or share your widget link to collect more feedback.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/widgets">Setup Widget</Link>
        </Button>
        <Button variant="brand" size="sm" asChild>
          <Link href="/integrations">Get Link</Link>
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl border p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="space-y-6">
        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search in any language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 rounded-xl"
            />
          </div>
          
          <TabsList className="bg-gray-100 p-1.5 h-11 rounded-xl w-full md:w-auto flex justify-start overflow-x-auto">
            <TabsTrigger value="all" className="rounded-lg px-3.5 h-8 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              All ({feedbacks.length})
            </TabsTrigger>
            <TabsTrigger value="positive" className="rounded-lg px-3.5 h-8 text-xs font-medium data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              Positive
            </TabsTrigger>
            <TabsTrigger value="neutral" className="rounded-lg px-3.5 h-8 text-xs font-medium data-[state=active]:bg-gray-200 data-[state=active]:text-gray-700">
              Neutral
            </TabsTrigger>
            <TabsTrigger value="negative" className="rounded-lg px-3.5 h-8 text-xs font-medium data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
              Negative
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        {['all', 'positive', 'neutral', 'negative'].map((tab) => {
          const items = filterFeedback(tab);
          return (
            <TabsContent key={tab} value={tab} className="space-y-4 min-h-[300px] mt-0">
              {items.length > 0 ? (
                <div className="columns-1 md:columns-2 xl:columns-3 gap-5">
                  {items.map((item, index) => (
                    <FeedbackCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
