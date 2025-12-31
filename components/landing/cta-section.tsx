"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-3xl blur-3xl" />

          {/* Card */}
          <div className="relative p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 text-white text-center overflow-hidden">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }} />
            </div>

            {/* Content */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Ready to Understand Your Global Customers?
              </h2>
              <p className="text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                Start collecting culturally-intelligent feedback today. 
                No credit card required. Free tier available.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-white text-emerald-600 hover:bg-white/90 shadow-lg rounded-full"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-white/20 text-white hover:bg-white/30 rounded-full border-0"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/20 grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <div className="text-xl sm:text-3xl font-bold">100+</div>
                  <div className="text-xs sm:text-sm text-white/70">Languages</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-bold">&lt;1s</div>
                  <div className="text-xs sm:text-sm text-white/70">Processing</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-bold">24/7</div>
                  <div className="text-xs sm:text-sm text-white/70">Real-time</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
