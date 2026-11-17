"use client";

import React, { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";

interface CopyPortalButtonProps {
  token: string;
  clientName?: string;
  variant?: "badge" | "button" | "icon";
  className?: string;
}

export const CopyPortalButton: React.FC<CopyPortalButtonProps> = ({
  token,
  clientName,
  variant = "button",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://solocrm.design";
    const portalUrl = `${origin}/portal/${token}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(portalUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleCopy}
        title={copied ? "Link Copied!" : `Copy Magic Portal Link for ${clientName || "Client"}`}
        aria-label="Copy Client Portal Link"
        className={`p-2 rounded-full border border-white/10 bg-white/[0.04] hover:border-[#E8B4F8]/40 hover:bg-[#E8B4F8]/10 text-[#A098A8] hover:text-[#E8B4F8] transition-all flex items-center justify-center ${className}`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[#E8B4F8] stroke-[2.5]" />
        ) : (
          <Share2 className="h-3.5 w-3.5 stroke-[2]" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      title={`Generate & Copy unguessable public read-only link for ${clientName || "Client"}`}
      className={`px-3 py-1.5 rounded-full border transition-all text-[11px] font-mono flex items-center gap-1.5 shrink-0 ${
        copied
          ? "border-[#E8B4F8]/40 bg-[#E8B4F8]/15 text-[#E8B4F8]"
          : "border-white/10 bg-white/[0.04] text-[#A098A8] hover:border-[#E8B4F8]/40 hover:bg-[#E8B4F8]/10 hover:text-white"
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-[#E8B4F8] stroke-[2.5]" />
          <span className="text-[#E8B4F8] font-medium">Copied!</span>
        </>
      ) : (
        <>
          <Link2 className="h-3 w-3 text-[#E8B4F8]" />
          <span>Client Portal</span>
        </>
      )}
    </button>
  );
};
