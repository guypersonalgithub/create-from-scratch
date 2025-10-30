import {
  parseDynaticCSS,
  type NameslessStyleOrderedChunks,
} from "@packages/dynatic-css-typescript-parser";
import { parseCSS } from "./parseCSS";
import type { DynaticConfiguration } from "@packages/dynatic-css";
import { createClassName, hashString } from "@packages/dynatic-css-utils";
import { replaceSubstring } from "@packages/string-utils";

type ParseDynaticArgs = {
  input: string;
  from: number;
  identifier: string;
  updatedConfig?: DynaticConfiguration;
  inserted: Map<string, string>;
  pseudoClasses: Map<string, string>;
  mediaQueries: Map<string, Map<string, string>>;
};

export const parseDynatic = ({
  input,
  //   from,
  identifier,
  updatedConfig,
  inserted,
  pseudoClasses,
  mediaQueries,
}: ParseDynaticArgs) => {
  // TODO: consider making parseDynaticCSS avoid parsing imports/optionally parse them when provided from the outside, since they are already parsed to begin with in an earlier flow, no need to do that twice.
  const {
    // dynaticStyleChunks,
    dynaticStyleOrderedChunks,
    nameslessStyleOrderedChunks,
    // uniqueImports,
    // mappedImports,
    // importVariables,
    contexts,
    // classNames,
  } = parseDynaticCSS({ input, identifier });

  const ordered: (NameslessStyleOrderedChunks[number] & { name?: string })[] = [
    ...dynaticStyleOrderedChunks,
    ...nameslessStyleOrderedChunks,
  ].sort((chunkA, chunkB) => chunkB.endIndex - chunkA.endIndex);

  ordered.forEach((current) => {
    const { startIndex, endIndex, value, context, variables } = current;

    const start = value.indexOf("`");
    const css = value.slice(start);

    const output = parseCSS({
      css,
      context: context,
      variables: variables.map((variable) => {
        const { startIndex: variableStart, endIndex: variableEnd } = variable;

        const newStart = variableStart - startIndex - start;

        return {
          ...variable,
          startIndex: newStart,
          endIndex: variableEnd - variableStart + newStart,
        };
      }),
      contexts,
      updatedConfig,
    });

    const classNames: string[] = [];
    let dynamicRows = "";
    let currentMediaQuery: string | undefined;
    let currentPseudoClass: string | undefined;

    output.forEach((row, index) => {
      if (row.isRowStatic) {
        const { value, pseudoClass, mediaQuery } = row;

        const fullValue = createClassName({ value, pseudoClass, mediaQuery });
        const hash = hashString({ input: fullValue });
        const className = `css-${hash}`;

        if (mediaQuery) {
          if (!mediaQueries.has(mediaQuery)) {
            mediaQueries.set(mediaQuery, new Map<string, string>());
          }

          mediaQueries.get(mediaQuery)!.set(className, value);
        } else {
          if (!inserted.has(className)) {
            inserted.set(className, value);
          }
        }

        if (pseudoClass) {
          pseudoClasses.set(className, pseudoClass);
        }

        classNames.push(className);

        if (currentPseudoClass) {
          currentPseudoClass = undefined;
          dynamicRows += " }\n";
        }

        if (currentMediaQuery) {
          currentMediaQuery = undefined;
          dynamicRows += " }\n";
        }
      } else {
        const { value, pseudoClass, mediaQuery } = row;
        const mediaQueryChanged = currentMediaQuery !== mediaQuery;
        const pseudoClassChanged = currentPseudoClass !== pseudoClass;

        if (pseudoClassChanged && currentPseudoClass) {
          dynamicRows += " }\n ";
        }

        if (mediaQueryChanged && currentMediaQuery) {
          dynamicRows += " }\n ";
        }

        if (mediaQueryChanged) {
          currentMediaQuery = mediaQuery;

          if (mediaQuery) {
            dynamicRows += `${mediaQuery} {\n `;
          }
        }

        if (pseudoClassChanged) {
          currentPseudoClass = pseudoClass;

          if (pseudoClass) {
            dynamicRows += `&${pseudoClass} {\n `;
          }
        }

        dynamicRows += `${value};\n `;

        if (pseudoClass && index === output.length - 1) {
          dynamicRows += " }\n ";
        }

        if (mediaQuery && index === output.length - 1) {
          dynamicRows += " }\n ";
        }
      }
    });

    const mergedClassNames = classNames.join(" ");
    const complete: string[] = [];
    const initial = value.slice(0, start);
    const hasDynamicRows = dynamicRows.length > 0;

    if (hasDynamicRows) {
      complete.push(`${initial}\`\n${dynamicRows}\``);
    }

    if (mergedClassNames.length > 0) {
      if (hasDynamicRows) {
        complete.push(`+ " ${mergedClassNames}"`);
      } else {
        complete.push(mergedClassNames);
      }
    }

    const fullResult = complete.join(" ");

    // if (!parsedDynaticChunks[context]) {
    //   parsedDynaticChunks[context] = {};
    // }

    const isFullyStatic = dynamicRows.length === 0;

    // if (name) {
    //   parsedDynaticChunks[context][name] = {
    //     startIndex,
    //     endIndex,
    //     newValue: fullResult,
    //     isFullyStatic,
    //   };
    // }

    input = replaceSubstring({
      str: input,
      from: startIndex,
      to: endIndex,
      newStr: isFullyStatic ? `"${fullResult}"` : fullResult,
    });
  });

  return input;
};
