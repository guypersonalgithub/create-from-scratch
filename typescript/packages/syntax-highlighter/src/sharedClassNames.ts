import { dynatic } from "@packages/dynatic-css";

export const syntaxHighlighterClassName = dynatic`
    border: 3px solid rgb(20, 20, 20);
    background-color: rgb(20, 20, 20);
    border-radius: 1em;
    color: white;
    cursor: text;
    padding: 0.5rem;
`;

export const termainlCursorClassName = dynatic`
    animation: terminalCursorAnimation 2s infinite;
    animation-timing-function: steps(1);
`;

/* min-width: fit-content; */
/* overflow: auto; */
