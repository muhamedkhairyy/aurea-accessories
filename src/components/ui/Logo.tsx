import React from "react";

interface LogoProps {
  className?: string;
  light?: boolean; // If true, renders white logo text/mark for dark backgrounds
  showText?: boolean;
}

export default function Logo({ className = "h-16 w-auto", light = false, showText = true }: LogoProps) {
  const primaryColor = light ? "#FFFFFF" : "#111111";
  const secondaryColor = light ? "rgba(255,255,255,0.7)" : "#71717A";

  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Aurèa Accessories Logo"
    >
      {/* --- LOGO MARK --- */}
      <g id="logo-mark">
        {/* Cursive / Calligraphic 'A' */}
        <path
          d="M 102 46 
             C 98 42, 90 40, 84 46 
             C 74 56, 68 76, 68 88 
             C 68 98, 72 108, 80 108 
             C 92 108, 102 92, 104 74 
             C 105 66, 101 60, 96 60 
             C 88 60, 84 72, 86 80 
             C 87 86, 92 88, 95 82 
             C 96 80, 96 79, 97 78
             M 103 62 
             C 108 50, 114 44, 118 44
             C 122 44, 122 47, 120 54 
             L 110 88 
             C 106 100, 104 105, 106 107
             C 108 109, 113 109, 118 104
             C 122 100, 124 96, 126 96
             M 78 82
             C 72 88, 64 92, 58 92
             C 52 92, 48 88, 48 80
             C 48 68, 58 54, 70 42
             C 82 30, 95 24, 104 24
             C 108 24, 110 26, 108 30
             C 106 36, 94 48, 84 58
             C 76 66, 70 74, 72 82
             C 73 86, 78 88, 82 84"
          stroke={primaryColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Diamond Outer Frame */}
        <path
          d="M 128 66 L 140 66 L 145 72 L 134 85 L 123 72 Z"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Diamond Facets */}
        <path
          d="M 128 66 L 131 72 L 134 85 
             M 140 66 L 137 72 L 134 85
             M 123 72 L 131 72 L 137 72 L 145 72"
          stroke={primaryColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sparkles / Stars above diamond */}
        {/* Left Plus Sparkle */}
        <path
          d="M 122 55 H 126 M 124 53 V 57"
          stroke={primaryColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Right Plus Sparkle */}
        <path
          d="M 142 55 H 146 M 144 53 V 57"
          stroke={primaryColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Center Sparkle Ray */}
        <path
          d="M 134 50 V 58 M 131 54 L 137 54"
          stroke={primaryColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* --- BRAND NAME TEXT --- */}
      {showText && (
        <g id="brand-text">
          {/* AURÉA */}
          <text
            x="120"
            y="145"
            textAnchor="middle"
            fill={primaryColor}
            fontFamily="var(--font-playfair), Georgia, serif"
            fontSize="40"
            fontWeight="bold"
            letterSpacing="0.08em"
          >
            AURÉA
          </text>

          {/* ACCESSORIES */}
          <text
            x="120"
            y="170"
            textAnchor="middle"
            fill={secondaryColor}
            fontFamily="var(--font-inter), Arial, sans-serif"
            fontSize="20"
            fontWeight="600"
            letterSpacing="0.45em"
          >
            ACCESSORIES
          </text>
        </g>
      )}
    </svg>
  );
}
