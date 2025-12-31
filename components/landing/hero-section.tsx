"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TypeWriter } from "@/components/ui/typewriter";
import { ShineBorder } from "@/components/ui/shine-border";

export function HeroSection() {
  const typewriterStrings = [
    "Global Markets",
    "Cultural Nuances",
    "Customer Sentiment",
    "Real-time Insights",
    "100+ Languages",
  ];

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center pt-24 pb-12">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 sm:mb-8"
      >
        <ShineBorder
          borderRadius={50}
          borderWidth={1}
          duration={8}
          color={["#10B981", "#34D399", "#059669"]}
          className="inline-block"
        >
          <div className="flex items-center gap-2 px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium bg-background rounded-full">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
            <span className="text-muted-foreground">
              Confluent + Google Cloud AI
            </span>
            <span className="streaming-dot" />
          </div>
        </ShineBorder>
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 max-w-4xl leading-[1.1]"
      >
        <span className="block">Understand</span>
        <span className="gradient-text-animated">
          <TypeWriter strings={typewriterStrings} />
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-3 sm:mb-4 leading-relaxed px-2"
      >
        Jback doesn&apos;t just translate feedback — it explains{" "}
        <span className="text-foreground font-semibold">what customers mean</span> and{" "}
        <span className="text-foreground font-semibold">how to respond</span> based on cultural context.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xs sm:text-sm text-muted-foreground mb-8 sm:mb-10"
      >
        Real-time streaming • 100+ languages • AI-powered cultural analysis
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-16 justify-center w-full px-4 sm:px-0"
      >
        <Link href="/register" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-lg font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xl shadow-emerald-500/30 rounded-full transition-all duration-300 hover:scale-105"
          >
            <span className="hidden sm:inline">Start Your Cultural Intelligence Journey</span>
            <span className="sm:hidden">Get Started Free</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>

      {/* Feature Pills */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2"
      >
        {[
          { icon: "🌍", label: "100+ Languages" },
          { icon: "⚡", label: "Real-time" },
          { icon: "🧠", label: "Cultural AI" },
          { icon: "📊", label: "Analytics" },
        ].map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="feature-card-border rounded-full"
          >
            <div className="bg-background rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-lg">{feature.icon}</span>
              <span className="text-xs sm:text-sm font-medium">{feature.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
