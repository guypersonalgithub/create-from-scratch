import { CSSProperties } from "react";
import { Variants } from "./types";

type GetVariantStylesArgs = {
  variant: Variants;
};

export const getVariantStyles = ({ variant }: GetVariantStylesArgs): CSSProperties => {
  if (variant === "basic") {
    return {
      display: "inline-block",
      padding: "4px 10px",
      margin: "2px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 1px 0 #bbb",
      fontFamily: "monospace",
      fontSize: "14px",
      lineHeight: 1,
      userSelect: "none",
    };
  }

  if (variant === "pronounced") {
    return {
      display: "inline-block",
      padding: "6px 14px",
      margin: "4px",
      border: "2px solid #aaa",
      borderRadius: "8px",
      backgroundColor: "#e0e0e0",
      boxShadow: "inset 0 -2px 0 #bbb, 0 2px 5px rgba(0, 0, 0, 0.2)",
      fontFamily: "'Courier New', Courier, monospace",
      fontWeight: 600,
      fontSize: "15px",
      lineHeight: 1,
      userSelect: "none",
      textAlign: "center",
      minWidth: "32px",
      transition: "transform 0.1s ease",
    };
  }

  if (variant === "mac") {
    return {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "8px",
      backgroundColor: "#f1f1f1",
      border: "1px solid #d1d1d1",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      fontFamily: "monospace",
      fontSize: "14px",
      fontWeight: 500,
      color: "#333",
      userSelect: "none",
    };
  }

  if (variant === "dark") {
    return {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "6px",
      backgroundColor: "#1e1e1e",
      border: "1px solid #555",
      color: "#eee",
      fontFamily: "monospace",
      fontSize: "14px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
      userSelect: "none",
    };
  }

  if (variant === "gaming") {
    return {
      display: "inline-block",
      padding: "10px 16px",
      borderRadius: "4px",
      backgroundColor: "#2a2a2a",
      border: "2px solid #0ff",
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "16px",
      color: "#0ff",
      textShadow: "0 0 4px #0ff",
      boxShadow: "0 4px 10px rgba(0, 255, 255, 0.4)",
      userSelect: "none",
    };
  }

  if (variant === "skeuomorphic") {
    return {
      display: "inline-block",
      padding: "8px 14px",
      borderRadius: "6px",
      background: "linear-gradient(to bottom, #fff, #ccc)",
      border: "1px solid #999",
      boxShadow: "inset 0 1px 0 #fff, inset 0 -1px 2px #aaa, 0 3px 6px rgba(0,0,0,0.2)",
      fontFamily: "monospace",
      fontSize: "14px",
      fontWeight: 600,
      color: "#333",
      userSelect: "none",
    };
  }

  if (variant === "glassmorphism") {
    return {
      display: "inline-block",
      padding: "8px 16px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      color: "#fff",
      fontFamily: "monospace",
      fontSize: "14px",
      boxShadow: "0 4px 12px rgba(255, 255, 255, 0.2)",
      userSelect: "none",
    };
  }

  if (variant === "outline") {
    return {
      display: "inline-block",
      padding: "6px 14px",
      borderRadius: "6px",
      border: "2px solid #aaa",
      backgroundColor: "transparent",
      color: "#333",
      fontFamily: "monospace",
      fontSize: "14px",
      fontWeight: 500,
      userSelect: "none",
    };
  }

  if (variant === "retro") {
    return {
      display: "inline-block",
      padding: "8px 16px",
      borderRadius: "4px",
      backgroundColor: "#ff5ec2",
      color: "#fff",
      fontFamily: "'Press Start 2P', cursive",
      fontSize: "12px",
      textShadow: "2px 2px 0 #000",
      border: "2px solid #000",
      boxShadow: "4px 4px 0 #000",
      userSelect: "none",
    };
  }

  if (variant === "soft") {
    return {
      display: "inline-block",
      padding: "6px 14px",
      borderRadius: "8px",
      backgroundColor: "#f5f5f5",
      color: "#444",
      fontFamily: "monospace",
      fontSize: "14px",
      border: "1px solid #eee",
      boxShadow: "inset 1px 1px 2px #fff, inset -1px -1px 2px #ccc, 0 1px 2px rgba(0, 0, 0, 0.05)",
      userSelect: "none",
    };
  }

  if (variant === "scifi") {
    return {
      display: "inline-block",
      padding: "6px 14px",
      borderRadius: "4px",
      backgroundColor: "#0e0e0e",
      color: "#00ffe1",
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "13px",
      letterSpacing: "1px",
      border: "1px solid #00ffe1",
      boxShadow: "0 0 8px #00ffe1",
      userSelect: "none",
      textTransform: "uppercase",
    };
  }

  if (variant === "wood") {
    return {
      display: "inline-block",
      padding: "10px 18px",
      borderRadius: "6px",
      background: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
      backgroundColor: "#8b5e3c",
      color: "#fff8e7",
      fontFamily: "monospace",
      fontWeight: 600,
      fontSize: "14px",
      border: "1px solid #5c3b1e",
      boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
      userSelect: "none",
    };
  }

  if (variant === "metal") {
    return {
      display: "inline-block",
      padding: "10px 18px",
      borderRadius: "4px",
      background: "linear-gradient(135deg, #d0d0d0 0%, #a5a5a5 100%)",
      color: "#222",
      fontFamily: "monospace",
      fontSize: "14px",
      border: "1px solid #666",
      boxShadow: "inset 0 1px 2px #fff, 0 3px 6px rgba(0,0,0,0.3)",
      userSelect: "none",
      textTransform: "uppercase",
    };
  }

  if (variant === "plastic") {
    return {
      display: "inline-block",
      padding: "10px 20px",
      borderRadius: "10px",
      backgroundColor: "#e0e0e0",
      border: "2px solid #c0c0c0",
      boxShadow: "0 2px 4px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.05)",
      fontFamily: "monospace",
      fontSize: "14px",
      fontWeight: 600,
      color: "#333",
      userSelect: "none",
    };
  }

  return {};
};
