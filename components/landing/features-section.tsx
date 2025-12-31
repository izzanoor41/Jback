"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  Brain,
  Zap,
  BarChart3,
  MessageSquare,
  Shield,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: Globe2,
    title: "100+ Languages",
    description: "Auto-detect and translate feedback from any language with cultural context preservation.",
    color: "emerald",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: Brain,
    title: "Cultural AI Analysis",
    description: "Understand communication styles, sentiment patterns, and cultural sensitivities automatically.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    description: "Powered by Confluent Kafka for instant feedback processing and live dashboard updates.",
    color: "orange",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Sentiment trends, keyword extraction, and actionable recommendations for each market.",
    color: "purple",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: MessageSquare,
    title: "RAG-Powered Chat",
    description: 'Ask questions about your feedback in natural language.',
    color: "pink",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "Team collaboration, role-based access, and secure data handling for global businesses.",
    color: "teal",
    gradient: "from-teal-500 to-cyan-600",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
            Beyond Translation
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Cultural Intelligence,{" "}
            <span className="gradient-text">Not Just Words</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            A 5-star rating in the US might be a 3-star &quot;satisfactory&quot; in Japan.
            Jback helps you understand the true meaning behind global feedback.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-background border border-border/50 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
                {/* Icon */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
