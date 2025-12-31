"use client";

import { motion } from "framer-motion";

const techStack = [
  {
    name: "Confluent",
    description: "Real-time Streaming",
    icon: "⚡",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Google Cloud",
    description: "AI & Infrastructure",
    icon: "☁️",
    color: "from-red-500 to-yellow-500",
  },
  {
    name: "OpenAI",
    description: "Cultural Analysis",
    icon: "🧠",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Next.js",
    description: "React Framework",
    icon: "⚛️",
    color: "from-gray-700 to-gray-900",
  },
  {
    name: "TiDB",
    description: "Serverless Database",
    icon: "🗄️",
    color: "from-purple-500 to-pink-500",
  },
];

export function TechStackSection() {
  return (
    <section className="relative z-10 py-12 sm:py-16 bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Built with Modern Technology</h2>
          <p className="text-sm sm:text-base text-gray-400">Enterprise-grade infrastructure for global scale</p>
        </motion.div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6 md:gap-10 justify-items-center">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-2xl sm:text-3xl group-hover:bg-white/20 transition-all">
                {tech.icon}
              </div>
              <div className="font-semibold text-xs sm:text-base">{tech.name}</div>
              <div className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">{tech.description}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
