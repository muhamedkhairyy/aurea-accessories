"use client";

import React, { useId, useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { MAX_PROOF_MB, PROOF_ACCEPT, preparePaymentProof, type PaymentProof } from "@/utils/checkout";

// Required payment screenshot: pick, preview, replace or remove. The parent owns the value.
export default function PaymentProofUpload({
  value,
  onChange,
  error,
  disabled,
  language,
}: {
  value: PaymentProof | null;
  onChange: (proof: PaymentProof | null) => void;
  error?: string;
  disabled?: boolean;
  language: "en" | "ar";
}) {
  const ar = language === "ar";
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [fileError, setFileError] = useState("");
  const shownError = fileError || error;

  const pick = () => inputRef.current?.click();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setFileError("");
    setProcessing(true);
    try {
      onChange(await preparePaymentProof(file, language));
    } catch (err) {
      setFileError((err as Error).message);
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = ""; // picking the same file again still fires change
    }
  };

  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#71717A]">
        {ar ? "صورة إيصال التحويل *" : "Payment Screenshot *"}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={PROOF_ACCEPT}
        className="sr-only"
        disabled={disabled || processing}
        onChange={(e) => handleFile(e.target.files?.[0])}
        aria-invalid={!!shownError}
        aria-describedby={`${inputId}-hint`}
      />

      {value ? (
        <div className="flex items-center gap-4 rounded-lg border border-[#E4E4E7] bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
          <img src={value.dataUrl} alt={ar ? "معاينة إيصال التحويل" : "Payment screenshot preview"} className="h-24 w-24 flex-shrink-0 rounded-md border border-[#F5F5F5] bg-[#F5F5F5] object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#111111]">{value.name}</p>
            <p className="text-[11px] text-[#71717A]">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={pick}
                disabled={disabled || processing}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] px-3 py-1.5 text-xs font-semibold hover:border-[#111111] disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${processing ? "animate-spin" : ""}`} />
                {ar ? "استبدال" : "Replace"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFileError("");
                  onChange(null);
                }}
                disabled={disabled || processing}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] px-3 py-1.5 text-xs font-semibold text-[#71717A] hover:border-[#EF4444] hover:text-[#EF4444] disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {ar ? "إزالة" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          disabled={disabled || processing}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors disabled:opacity-60 ${shownError ? "border-red-300 bg-red-50/40" : "border-[#E4E4E7] bg-white hover:border-[#C9A227]"}`}
        >
          {processing ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A227]/20 border-t-[#C9A227]" />
          ) : (
            <ImagePlus className="h-6 w-6 text-[#C9A227]" />
          )}
          <span className="text-sm font-semibold text-[#111111]">
            {processing ? (ar ? "جارٍ تجهيز الصورة..." : "Preparing image...") : ar ? "اضغطي لرفع صورة الإيصال" : "Click to upload your receipt screenshot"}
          </span>
        </button>
      )}

      <p id={`${inputId}-hint`} className="mt-1 text-[11px] text-[#71717A]">
        {ar ? `JPG أو JPEG أو PNG أو WEBP — حتى ${MAX_PROOF_MB} ميجابايت (الصور الأكبر يتم تصغيرها تلقائياً)` : `JPG, JPEG, PNG or WEBP — up to ${MAX_PROOF_MB} MB (larger photos are resized automatically)`}
      </p>
      {shownError && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
          {shownError}
        </p>
      )}
    </div>
  );
}
