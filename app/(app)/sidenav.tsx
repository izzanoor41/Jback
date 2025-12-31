"use client";

import Link from "next/link";
import { 
  BotMessageSquare, 
  LayoutDashboard, 
  Link2, 
  MessageSquareDashed, 
  Palette, 
  Globe2, 
  Zap,
  Brain,
  Menu,
  X
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import SelectTeam from "./select-team";

export default function Sidenav({ session }: { session: any }) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Check streaming health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/stream/health');
        const data = await res.json();
        setStreamingStatus(data.status === 'healthy' ? 'connected' : 'disconnected');
      } catch {
        setStreamingStatus('disconnected');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setShowSidebar(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {showSidebar && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" 
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-50 top-0 left-0 bottom-0 w-64
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col bg-gradient-to-b from-emerald-900 to-emerald-950
          transition-transform duration-300 ease-in-out
          shadow-2xl lg:shadow-none
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setShowSidebar(false)}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        <Link
          href="/dashboard"
          className="shrink-0 p-3 border-b border-emerald-700/50 text-white font-bold flex items-center justify-center gap-2 h-16"
        >
          <Image
            src="/Jback.webp"
            alt="Jback"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="text-xl tracking-wide">Jback</span>
        </Link>

        <SelectTeam session={session} />

        {/* Streaming Status Indicator */}
        <div className="px-4 py-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
            streamingStatus === 'connected' 
              ? 'bg-emerald-500/20 text-emerald-300' 
              : streamingStatus === 'checking'
              ? 'bg-yellow-500/20 text-yellow-300'
              : 'bg-red-500/20 text-red-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              streamingStatus === 'connected' 
                ? 'bg-emerald-400 animate-pulse' 
                : streamingStatus === 'checking'
                ? 'bg-yellow-400 animate-pulse'
                : 'bg-red-400'
            }`} />
            <Zap className="w-3 h-3" />
            <span>
              {streamingStatus === 'connected' ? 'Real-time Active' : 
               streamingStatus === 'checking' ? 'Connecting...' : 'Offline Mode'}
            </span>
          </div>
        </div>

        <ul className="flex-1 p-4 space-y-2 font-semibold overflow-y-auto">
          <li>
            <Link
              href="/dashboard"
              className={`w-full text-sm text-white flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                pathname === "/dashboard" ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/feedback"
              className={`w-full text-sm text-white flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                pathname === "/feedback" || pathname.startsWith("/feedback/") ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <MessageSquareDashed className="w-4 h-4" />
              <span>Feedback</span>
            </Link>
          </li>
          <li>
            <Link
              href="/cultural-insights"
              className={`w-full text-sm text-white flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                pathname === "/cultural-insights" ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>Cultural Insights</span>
              <span className="ml-auto text-[10px] bg-emerald-400/30 px-1.5 py-0.5 rounded">AI</span>
            </Link>
          </li>
          <li>
            <Link
              href="/intelligence"
              className={`w-full text-sm text-white flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                pathname === "/intelligence" ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Intelligence</span>
              <span className="ml-auto text-[10px] bg-purple-400/30 px-1.5 py-0.5 rounded">LIVE</span>
            </Link>
          </li>
          
          <li className="pt-4">
            <div className="text-xs text-white/40 uppercase tracking-wider px-4 mb-2">Advanced</div>
          </li>
          <li>
            <Link
              href="/analysis"
              className={`w-full text-sm text-white flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                pathname === "/analysis" ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <BotMessageSquare className="w-4 h-4" />
              <span>AI Analysis</span>
            </Link>
          </li>
          
          <li className="pt-4">
            <div className="text-xs text-white/40 uppercase tracking-wider px-4 mb-2">Settings</div>
          </li>
          <li>
            <Link
              href="/widgets"
              className={`w-full text-sm text-white flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                pathname === "/widgets" ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Widget Style</span>
            </Link>
          </li>
          <li>
            <Link
              href="/integrations"
              className={`w-full text-sm text-white flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                pathname === "/integrations" ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Integration</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
