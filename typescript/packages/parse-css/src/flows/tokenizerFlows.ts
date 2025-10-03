import { TokenTypes } from "../constants";
import type { BaseToken, Callback } from "../types";
import { ampersandFlow } from "./ampersandFlow";
import { atFlow } from "./atFlow";
import { htmlTagFlow } from "./htmlTagFlow";
import { closeCurlyBracketFlow } from "./closeCurlyBracketFlow";
import { dotFlow } from "./dotFlow";
// import { endOfLineFlow } from "./endOfLineFlow";
import { numericValueFlow } from "./numericValueFlow";
import { openCurlyBracketFlow } from "./openCurlyBracketFlow";
import { propertyFlow } from "./propertyFlow";
import { templateLiteralExpressionFlow } from "./templateLiteralExpressionFlow";

// TODO: Add id flow, animation keyframes flows.

const callbacks: Record<string, (args: Callback) => { updatedIndex: number } | undefined> = {
  ".": dotFlow,
  "&": ampersandFlow,
  "@": atFlow,
  "0": numericValueFlow,
  "1": numericValueFlow,
  "2": numericValueFlow,
  "3": numericValueFlow,
  "4": numericValueFlow,
  "5": numericValueFlow,
  "6": numericValueFlow,
  "7": numericValueFlow,
  "8": numericValueFlow,
  "9": numericValueFlow,
  "{": openCurlyBracketFlow,
  "}": closeCurlyBracketFlow,
  $: templateLiteralExpressionFlow,
  // ";": endOfLineFlow,
  a: htmlTagFlow,
  abbr: htmlTagFlow,
  address: htmlTagFlow,
  area: htmlTagFlow,
  article: htmlTagFlow,
  aside: htmlTagFlow,
  audio: htmlTagFlow,
  b: htmlTagFlow,
  base: htmlTagFlow,
  bdi: htmlTagFlow,
  bdo: htmlTagFlow,
  blockquote: htmlTagFlow,
  body: htmlTagFlow,
  br: htmlTagFlow,
  button: htmlTagFlow,
  canvas: htmlTagFlow,
  caption: htmlTagFlow,
  cite: htmlTagFlow,
  code: htmlTagFlow,
  col: htmlTagFlow,
  colgroup: htmlTagFlow,
  data: htmlTagFlow,
  datalist: htmlTagFlow,
  dd: htmlTagFlow,
  del: htmlTagFlow,
  details: htmlTagFlow,
  dfn: htmlTagFlow,
  dialog: htmlTagFlow,
  div: htmlTagFlow,
  dl: htmlTagFlow,
  dt: htmlTagFlow,
  em: htmlTagFlow,
  embed: htmlTagFlow,
  fieldset: htmlTagFlow,
  figcaption: htmlTagFlow,
  figure: htmlTagFlow,
  footer: htmlTagFlow,
  form: htmlTagFlow,
  h1: htmlTagFlow,
  h2: htmlTagFlow,
  h3: htmlTagFlow,
  h4: htmlTagFlow,
  h5: htmlTagFlow,
  h6: htmlTagFlow,
  head: htmlTagFlow,
  header: htmlTagFlow,
  hgroup: htmlTagFlow,
  hr: htmlTagFlow,
  html: htmlTagFlow,
  i: htmlTagFlow,
  iframe: htmlTagFlow,
  img: htmlTagFlow,
  input: htmlTagFlow,
  ins: htmlTagFlow,
  kbd: htmlTagFlow,
  label: htmlTagFlow,
  legend: htmlTagFlow,
  li: htmlTagFlow,
  link: htmlTagFlow,
  main: htmlTagFlow,
  map: htmlTagFlow,
  mark: htmlTagFlow,
  meta: htmlTagFlow,
  meter: htmlTagFlow,
  nav: htmlTagFlow,
  noscript: htmlTagFlow,
  object: htmlTagFlow,
  ol: htmlTagFlow,
  optgroup: htmlTagFlow,
  option: htmlTagFlow,
  output: htmlTagFlow,
  p: htmlTagFlow,
  picture: htmlTagFlow,
  pre: htmlTagFlow,
  progress: htmlTagFlow,
  q: htmlTagFlow,
  rp: htmlTagFlow,
  rt: htmlTagFlow,
  ruby: htmlTagFlow,
  s: htmlTagFlow,
  samp: htmlTagFlow,
  script: htmlTagFlow,
  section: htmlTagFlow,
  select: htmlTagFlow,
  slot: htmlTagFlow,
  small: htmlTagFlow,
  source: htmlTagFlow,
  span: htmlTagFlow,
  strong: htmlTagFlow,
  style: htmlTagFlow,
  sub: htmlTagFlow,
  summary: htmlTagFlow,
  sup: htmlTagFlow,
  table: htmlTagFlow,
  tbody: htmlTagFlow,
  td: htmlTagFlow,
  template: htmlTagFlow,
  textarea: htmlTagFlow,
  tfoot: htmlTagFlow,
  th: htmlTagFlow,
  thead: htmlTagFlow,
  time: htmlTagFlow,
  title: htmlTagFlow,
  tr: htmlTagFlow,
  track: htmlTagFlow,
  u: htmlTagFlow,
  ul: htmlTagFlow,
  var: htmlTagFlow,
  video: htmlTagFlow,
  wbr: htmlTagFlow,
};

type TokenizerFlowsArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  cssInJS?: boolean;
  extensionParsing?: boolean;
};

export const tokenizerFlows = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  cssInJS,
  extensionParsing,
}: TokenizerFlowsArgs) => {
  const callback = callbacks[newTokenValue];
  const response = callback?.({
    tokens,
    newTokenValue,
    input,
    currentIndex,
    extensionParsing,
    cssInJS,
  });

  if (!response) {
    const property = propertyFlow({
      tokens,
      newTokenValue,
      input,
      currentIndex,
      extensionParsing,
      cssInJS,
    });

    if (property) {
      return property;
    }

    tokens.push({
      type: TokenTypes.UNKNOWN,
      value: newTokenValue,
      startIndex: currentIndex - newTokenValue.length,
      endIndex: currentIndex,
    });

    return { updatedIndex: currentIndex };
  }

  return response;
};
