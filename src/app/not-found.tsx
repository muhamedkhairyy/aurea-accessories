"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ArrowRight, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F5F2] text-[#111111] px-4 text-center">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#C9A227]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#C9A227]/5 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 z-10">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <Logo className="h-16 w-auto" />
        </div>

        {/* 404 text and illustration */}
        <div className="space-y-3 pt-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight">404 - Page Not Found</h1>
          <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed max-w-xs mx-auto">
            The jewelry piece or collection page you are looking for does not exist or has been moved.
          </p>
        </div>

        {/* Return Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#111111] hover:bg-[#C9A227] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <span>Return to Collection</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
