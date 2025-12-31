"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTeam } from "@/lib/store";
import { 
  Globe, 
  Link2, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink,
  Code,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";

export default function IntegrationsPage() {
  const [link, setLink] = useState("");
  const [snippet, setSnippet] = useState("");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const team = useTeam((state) => state.team);

  useEffect(() => {
    if (team) {
      setLink(`${process.env.NEXT_PUBLIC_BASE_URL}/collect/${team?.id}`);
      setSnippet(`<script src="${process.env.NEXT_PUBLIC_BASE_URL}/widgets.js" jback-id="${team?.id}"></script>`);
    }
  }, [team]);

  const copyToClipboard = (text: string, type: 'snippet' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'snippet') {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    toast.success('Copied to clipboard!');
  };

  const integrations = [
    {
      id: 'website',
      icon: Globe,
      title: 'Website Embed',
      description: 'Add a feedback widget to your website with a simple script tag',
      color: 'emerald',
      badge: 'Popular',
    },
    {
      id: 'link',
      icon: Link2,
      title: 'Share Link',
      description: 'Get a direct link to share with customers via email or social media',
      color: 'blue',
      badge: null,
    },
    {
      id: 'qr',
      icon: QrCode,
      title: 'QR Code',
      description: 'Generate a QR code for physical locations or print materials',
      color: 'purple',
      badge: null,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
            <p className="text-sm text-gray-500">Connect Jback to collect feedback from anywhere</p>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Website Embed */}
        <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
          {/* Badge */}
          <div className="absolute -top-2.5 right-4">
            <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              Popular
            </span>
          </div>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Globe className="w-7 h-7 text-emerald-600" />
          </div>

          {/* Content */}
          <h3 className="font-semibold text-gray-900 mb-1">Website Embed</h3>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Add a feedback widget to your website with a simple script tag
          </p>

          {/* Action */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl shadow-md shadow-emerald-500/20">
                <Code className="w-4 h-4" />
                Get Code
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[95vw] sm:max-w-lg mx-4">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  Embed to Your Website
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-gray-600">
                      Add this script before <code className="px-1.5 py-0.5 bg-gray-100 rounded text-emerald-600 font-mono text-xs">&lt;/body&gt;</code> on your site:
                    </p>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-xl text-[10px] sm:text-xs overflow-x-auto font-mono whitespace-pre-wrap break-all">
                        {snippet}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-800 hover:bg-gray-700 text-gray-300"
                        onClick={() => copyToClipboard(snippet, 'snippet')}
                      >
                        {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <Zap className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-emerald-700">
                        The widget will automatically appear on your site.
                      </p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Share Link */}
        <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Link2 className="w-7 h-7 text-blue-600" />
          </div>

          {/* Content */}
          <h3 className="font-semibold text-gray-900 mb-1">Share Link</h3>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Get a direct link to share with customers via email or social
          </p>

          {/* Action */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2 rounded-xl border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                <ExternalLink className="w-4 h-4" />
                Get Link
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-blue-500" />
                  Share Feedback Link
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-gray-600">
                      Share this link with your customers to collect feedback:
                    </p>
                    <div className="flex gap-2">
                      <Input 
                        value={link} 
                        readOnly 
                        className="rounded-xl bg-gray-50 border-gray-200 font-mono text-sm"
                        onFocus={(e) => e.target.select()} 
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="shrink-0 rounded-xl border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                        onClick={() => copyToClipboard(link, 'link')}
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2 rounded-xl"
                      onClick={() => window.open(link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </Button>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* QR Code */}
        <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <QrCode className="w-7 h-7 text-purple-600" />
          </div>

          {/* Content */}
          <h3 className="font-semibold text-gray-900 mb-1">QR Code</h3>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Generate a QR code for physical locations or print materials
          </p>

          {/* Action */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2 rounded-xl border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700">
                <QrCode className="w-4 h-4" />
                Generate QR
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-purple-500" />
                  QR Code
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-gray-600 text-center">
                      Scan this QR code to open the feedback form
                    </p>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-inner">
                      <QRCode 
                        size={256} 
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                        value={link} 
                        viewBox={`0 0 256 256`}
                        fgColor="#10B981"
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      Right-click to save the QR code image
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

    </div>
  );
}
