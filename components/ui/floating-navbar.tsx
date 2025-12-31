"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./button";
import { Brain, LogIn } from "lucide-react";
import Image from "next/image";

interface FloatingNavProps {
  className?: string;
  isLoggedIn?: boolean;
}

export function FloatingNavbar({ className, isLoggedIn }: FloatingNavProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-6 inset-x-0 z-50 px-4",
          className
        )}
      >
        <div className="max-w-2xl mx-auto">
          <div className="w-full h-14 glass rounded-full flex items-center justify-between px-4 shadow-lg shadow-emerald-500/5 border border-emerald-500/10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/Jback.webp"
                alt="Jback"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold tracking-tight hidden sm:block">
                Jback
              </span>
            </Link>

            {/* Auth Button */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25"
                  >
                    <Brain className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    size="sm"
                    className="gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
