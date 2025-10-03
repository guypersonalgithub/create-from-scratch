import * as vscode from "vscode";
import { namedColors } from "./namedColors";
import { selector } from "./selector";
import { cachedParsedFiles, parsingFlow } from "./parsingFlow";
import type { BaseToken } from "@packages/parse-css";

const availableFunctionColorOptions = [
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hwb", // TODO: Add support from hwb to oklch.
  "lab",
  "lch",
  "oklab",
  "oklch",
  // "color"
] as const;

type ColorTokenType = "named" | "hex" | (typeof availableFunctionColorOptions)[number];

type ColorToken = Omit<BaseToken, "type"> & {
  type: ColorTokenType;
};

type ParseColorStringArgs = {
  type: ColorTokenType;
  value: string;
};

const parseColorString = ({ type, value }: ParseColorStringArgs): vscode.Color | null => {
  const str = value.trim().toLowerCase();

  if (type === "named") {
    const color = namedColors[str as keyof typeof namedColors];
    if (!color) {
      return null;
    }

    const [r, g, b] = color;
    return new vscode.Color(r / 255, g / 255, b / 255, str === "transparent" ? 0 : 1);
  }

  if (type === "hex") {
    let hex = value.slice(1);

    if (hex.length === 3 || hex.length === 4) {
      // Expand shorthand (#rgb → #rrggbb, #rgba → #rrggbbaa)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 6 ? 255 : parseInt(hex.slice(6, 8), 16);

    return new vscode.Color(r / 255, g / 255, b / 255, a / 255);
  }

  if (type === "rgb" || type === "rgba") {
    const startIndex = type === "rgb" ? 3 : 4;
    const functionValue = value.slice(startIndex + 1, value.length - 1);
    const values = functionValue.split(",").map((part) => part.trim());

    const r = parseInt(values[0], 10);
    const g = parseInt(values[1], 10);
    const b = parseInt(values[2], 10);
    const a = values[3] !== undefined ? parseFloat(values[3]) : 1;
    return new vscode.Color(r / 255, g / 255, b / 255, a);
  }

  if (type === "hsl" || type === "hsla") {
    const startIndex = type === "hsl" ? 3 : 4;
    const functionValue = value.slice(startIndex + 1, value.length - 1);
    const values = functionValue.split(",").map((part) => part.trim());

    const h = parseFloat(values[0]);
    const s = parseFloat(values[1]) / 100;
    const l = parseFloat(values[2]) / 100;
    const a = values[3] !== undefined ? parseFloat(values[3]) : 1;

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    return new vscode.Color(r + m, g + m, b + m, a);
  }

  return null;
};

export const activateColorProvider = () => {
  const disposable = vscode.languages.registerColorProvider(selector, {
    provideDocumentColors(document: vscode.TextDocument) {
      const documentURI = document.uri.toString();
      const documentText = document.getText();

      let parsedFile = cachedParsedFiles.get(documentURI);
      if (!parsedFile) {
        parsingFlow({ documentURI, documentText });
        parsedFile = cachedParsedFiles.get(documentURI);
      }

      if (!parsedFile) {
        return;
      }

      const colors: vscode.ColorInformation[] = [];

      parsedFile.forEach(({ tokens }) => {
        const colorTokens: ColorToken[] = [];
        for (let i = 0; i < tokens.length; i++) {
          const current = tokens[i];
          if (current.type === "color") {
            const type = current.value.startsWith("#") ? "hex" : "named";
            colorTokens.push({ ...current, type });
          } else if (current.type === "function") {
            const colorFunctions = new Set([
              "rgb",
              "rgba",
              "hsl",
              "hsla",
              "hwb",
              "lab",
              "lch",
              "oklab",
              "oklch",
              // "color"
            ]);

            if (!colorFunctions.has(current.value)) {
              continue;
            }

            const startIndex = current.startIndex;
            let endIndex: number | undefined;
            let amountOfParenthesis = 0;

            for (let j = i + 1; j < tokens.length; j++) {
              const currentJ = tokens[j];

              if (currentJ.type === "open-parenthesis") {
                amountOfParenthesis++;
              } else if (currentJ.type === "close-parenthesis") {
                amountOfParenthesis--;
              }

              if (amountOfParenthesis === 0) {
                endIndex = currentJ.endIndex;
                i = j;
                break;
              }
            }

            if (endIndex) {
              colorTokens.push({
                type: current.value as ColorTokenType,
                value: documentText.slice(startIndex, endIndex),
                startIndex,
                endIndex,
              });
            }
          }
        }

        colorTokens.forEach((token) => {
          const { type, value, startIndex, endIndex } = token;
          const color = parseColorString({ type, value });
          if (!color) {
            return;
          }

          const start = document.positionAt(startIndex);
          const end = document.positionAt(endIndex);

          colors.push(new vscode.ColorInformation(new vscode.Range(start, end), color));
        });
      });

      return colors;
    },

    provideColorPresentations(color: vscode.Color) {
      console.log("color presentations");
      const r = Math.round(color.red * 255);
      const g = Math.round(color.green * 255);
      const b = Math.round(color.blue * 255);
      const a = color.alpha;

      const presentations: vscode.ColorPresentation[] = [];

      // hex
      presentations.push(
        new vscode.ColorPresentation(
          `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
        ),
      );

      // rgb / rgba
      presentations.push(
        new vscode.ColorPresentation(a === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`),
      );

      // hsl / hsla
      const hsl = rgbToHsl({ r, g, b });
      presentations.push(
        new vscode.ColorPresentation(
          a === 1
            ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
            : `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})`,
        ),
      );

      return presentations;
    },
  });

  return disposable;
};

type RgbToHslArgs = {
  r: number;
  g: number;
  b: number;
};

const rgbToHsl = ({ r, g, b }: RgbToHslArgs) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return {
    h: Math.round(h), // 0 - 360
    s: Math.round(s * 100), // 0 - 100%
    l: Math.round(l * 100), // 0 - 100%
  };
};
