"use client";

import { motion } from "framer-motion";
import { MessageSquarePlus, Radio, Sparkles, Target } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: MessageSquarePlus,
    title: "Collect",
    description: "Embed widget or use API to collect feedback in any language",
    color: "emerald",
  },
  {
    number: "2",
    icon: Radio,
    title: "Stream",
    description: "Confluent Kafka processes feedback in real-time",
    color: "blue",
  },
  {
    number: "3",
    icon: Sparkles,
    title: "Analyze",
    description: "AI extracts sentiment, cultural context, and insights",
    color: "purple",
  },
  {
    number: "4",
    icon: Target,
    title: "Act",
    description: "Get actionable recommendations for each market",
    color: "orange",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            How <span className="gradient-text">Jback</span> Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            From feedback collection to cultural insights in real-time
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector Line - desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent" />
              )}

              {/* Step Number */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg ${
                  step.color === "emerald"
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30"
                    : step.color === "blue"
                    ? "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/30"
                    : step.color === "purple"
                    ? "bg-gradient-to-br from-purple-500 to-violet-600 shadow-purple-500/30"
                    : "bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/30"
                }`}
              >
                {step.number}
              </motion.div>

              {/* Icon */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 rounded-lg bg-background border border-border flex items-center justify-center">
                <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">{step.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 sm:mt-16 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-background border border-border/50"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
              <span>📱</span> <span className="hidden xs:inline">Widget/</span>API
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 text-blue-600 font-medium">
              <span>⚡</span> Kafka
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 text-purple-600 font-medium">
              <span>🧠</span> AI
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-orange-500/10 text-orange-600 font-medium">
              <span>📊</span> Dashboard
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
