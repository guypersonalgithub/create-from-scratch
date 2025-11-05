import { useState } from "react";
import type { TreeNode } from "./types";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type TreeExplorerProps<T extends string> = {
  data: TreeNode<T>[];
  initialExpanded?: string[];
};

// TODO: use AnimationContainer for unmounts/mounts, instead of rerendering children and hiding them with CSS.

export const TreeExplorer = <T extends string>({
  data,
  initialExpanded = [],
}: TreeExplorerProps<T>) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(initialExpanded));

  const toggleNode = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const renderNode = (node: TreeNode<T>, depth = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div
        key={node.id}
        className={dynatic`
          margin-left: ${depth * 20}px;
          margin-top: 4px;
      `}
      >
        <div
          className={dynatic`
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
          `}
          onClick={() => {
            if (!hasChildren) {
              return;
            }

            toggleNode(node.id);
          }}
        >
          {hasChildren ? (
            <span
              className={combineStringsWithSpaces(
                dynatic`
                display: inline-block;
                transition: transform 0.2s;
              `,
                isExpanded
                  ? dynatic`
                      transform: rotate(90deg);
                    `
                  : dynatic`
                      transform: rotate(0deg);
                    `,
              )}
            >
              ▶
            </span>
          ) : null}
          <span>{node.label}</span>
        </div>
        {hasChildren ? (
          <div
            className={combineStringsWithSpaces(
              dynatic`
                overflow: hidden;
                transition: max-height 0.3s ease, opacity 0.3s ease;
              `,
              isExpanded
                ? dynatic`
                    max-height: 1000px;
                    opacity: 1;
                  `
                : dynatic`
                    max-height: 0px;
                    opacity: 0;
                  `,
            )}
          >
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  };

  return <div>{data.map((node) => renderNode(node))}</div>;
};
