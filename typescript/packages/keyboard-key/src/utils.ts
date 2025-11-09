import { type Variants } from "./types";
import { dynatic } from "@packages/dynatic-css";

type GetVariantclassNamesArgs = {
  variant: Variants;
};

export const getVariantclassNames = ({ variant }: GetVariantclassNamesArgs) => {
  if (variant === "basic") {
    return dynatic`
      display: inline-block;
      padding: 4px 10px;
      margin: 2px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #f9f9f9;
      box-shadow: 0 1px 0 #bbb;
      font-family: monospace;
      font-size: 14px;
      line-height: 1;
      user-select: none;
    `;
  }

  if (variant === "pronounced") {
    return dynatic`
      display: inline-block;
      padding: 6px 14px;
      margin: 4px;
      border: 2px solid #aaa;
      border-radius: 8px;
      background-color: #e0e0e0;
      box-shadow: inset 0 -2px 0 #bbb, 0 2px 5px rgba(0, 0, 0, 0.2);
      font-family: 'Courier New', Courier, monospace;
      font-weight: 600;
      font-size: 15px;
      line-height: 1;
      user-select: none;
      text-align: center;
      min-width: 32px;
      transition: transform 0.1s ease;
    `;
  }

  if (variant === "mac") {
    return dynatic`
      display: inline-block;
      padding: 6px 12px;
      border-radius: 8px;
      background-color: #f1f1f1;
      border: 1px solid #d1d1d1;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      font-family: monospace;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      user-select: none;
    `;
  }

  if (variant === "dark") {
    return dynatic`
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      background-color: #1e1e1e;
      border: 1px solid #555;
      color: #eee;
      font-family: monospace;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      user-select: none;
    `;
  }

  if (variant === "gaming") {
    return dynatic`
      display: inline-block;
      padding: 10px 16px;
      border-radius: 4px;
      background-color: #2a2a2a;
      border: 2px solid #0ff;
      font-family: 'Orbitron', sans-serif;
      font-size: 16px;
      color: #0ff;
      text-shadow: 0 0 4px #0ff;
      box-shadow: 0 4px 10px rgba(0, 255, 255, 0.4);
      user-select: none;
    `;
  }

  if (variant === "skeuomorphic") {
    return dynatic`
      display: inline-block;
      padding: 8px 14px;
      border-radius: 6px;
      background: linear-gradient(to bottom, #fff, #ccc);
      border: 1px solid #999;
      box-shadow: inset 0 1px 0 #fff, inset 0 -1px 2px #aaa, 0 3px 6px rgba(0,0,0,0.2);
      font-family: monospace;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      user-select: none;
    `;
  }

  if (variant === "glassmorphism") {
    return dynatic`
      display: inline-block;
      padding: 8px 16px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(6px);
      Webkit-backdrop-filter: blur(6px);
      color: #fff;
      font-family: monospace;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
      user-select: none;
    `;
  }

  if (variant === "outline") {
    return dynatic`
      display: inline-block;
      padding: 6px 14px;
      border-radius: 6px;
      border: 2px solid #aaa;
      background-color: transparent;
      color: #333;
      font-family: monospace;
      font-size: 14px;
      font-weight: 500;
      user-select: none;
    `;
  }

  if (variant === "retro") {
    return dynatic`
      display: inline-block;
      padding: 8px 16px;
      border-radius: 4px;
      background-color: #ff5ec2;
      color: #fff;
      font-family: 'Press Start 2P', cursive;
      font-size: 12px;
      text-shadow: 2px 2px 0 #000;
      border: 2px solid #000;
      box-shadow: 4px 4px 0 #000;
      user-select: none;
    `;
  }

  if (variant === "soft") {
    return dynatic`
      display: inline-block;
      padding: 6px 14px;
      border-radius: 8px;
      background-color: #f5f5f5;
      color: #444;
      font-family: monospace;
      font-size: 14px;
      border: 1px solid #eee;
      box-shadow: inset 1px 1px 2px #fff, inset -1px -1px 2px #ccc, 0 1px 2px rgba(0, 0, 0, 0.05);
      user-select: none;
    `;
  }

  if (variant === "scifi") {
    return dynatic`
      display: inline-block;
      padding: 6px 14px;
      border-radius: 4px;
      background-color: #0e0e0e;
      color: #00ffe1;
      font-family: 'Orbitron', sans-serif;
      font-size: 13px;
      letter-spacing: 1px;
      border: 1px solid #00ffe1;
      box-shadow: 0 0 8px #00ffe1;
      user-select: none;
      text-transform: uppercase;
    `;
  }

  if (variant === "wood") {
    return dynatic`
      display: inline-block;
      padding: 10px 18px;
      border-radius: 6px;
      background: url('https://www.transparenttextures.com/patterns/wood-pattern.png');
      background-color: #8b5e3c;
      color: #fff8e7;
      font-family: monospace;
      font-weight: 600;
      font-size: 14px;
      border: 1px solid #5c3b1e;
      box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      user-select: none;
    `;
  }

  if (variant === "metal") {
    return dynatic`
      display: inline-block;
      padding: 10px 18px;
      border-radius: 4px;
      background: linear-gradient(135deg, #d0d0d0 0%, #a5a5a5 100%);
      color: #222;
      font-family: monospace;
      font-size: 14px;
      border: 1px solid #666;
      box-shadow: inset 0 1px 2px #fff, 0 3px 6px rgba(0,0,0,0.3);
      user-select: none;
      text-transform: uppercase;
    `;
  }

  if (variant === "plastic") {
    return dynatic`
      display: inline-block;
      padding: 10px 20px;
      border-radius: 10px;
      background-color: #e0e0e0;
      border: 2px solid #c0c0c0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.05);
      font-family: monospace;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      user-select: none;
    `;
  }
};
