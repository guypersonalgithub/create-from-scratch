import readline from "readline";
import { hideTerminalCursor, revealTerminalCursor } from "../utils";
import { clearTerminalLine } from "../ClearTerminalLines";
import { calculateLogLines } from "../calculateLogLines";
import { Option } from "./types";
import { displayOption } from "./displayOption";
import { keyInputs } from "../keyInputs";

type DisplayOptionsArgs = {
  previousIndex?: number;
};

type MultiOptionsArgs = {
  prefixText?: string;
  options: Option[];
  suffixText?: string;
  isMultiSelect?: boolean;
};

export const multiOptions = ({
  prefixText = "",
  options,
  suffixText = "",
  isMultiSelect,
}: MultiOptionsArgs): Promise<Option[]> => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const selectedOptions: Option[] = [];
    const rowsPerOption: number[] = [];
    let cursorIndex = 0;
    let amountOfLines = 0;
    let prefixLines = 0;
    let previousIndex: number;

    hideTerminalCursor();

    const displayOptions = ({ previousIndex }: DisplayOptionsArgs) => {
      if (previousIndex === undefined) {
        const prefixRows = calculateLogLines({
          text: prefixText,
        });
        prefixLines = prefixRows;
        amountOfLines += prefixRows;
        if (prefixRows > 0) {
          console.log(prefixText);
        }

        options.forEach((option, index) => {
          const optionText = displayOption({
            option,
            selectedOptions,
            cursorIndex,
            index,
            isMultiSelect,
          });

          const amountOfRows = calculateLogLines({
            text: optionText,
          });
          rowsPerOption.push(amountOfRows);
          amountOfLines += amountOfRows;
        });

        const suffixRows = calculateLogLines({
          text: suffixText,
        });
        amountOfLines += suffixRows;
        if (suffixRows > 0) {
          console.log(suffixText);
        }
        return;
      }

      const optionChanges = [previousIndex, cursorIndex];
      optionChanges.forEach((index) => {
        let sumOfRowsBeforeCurrent = 0;

        for (let i = index - 1; i >= 0; i--) {
          const optionRows = rowsPerOption[i];
          sumOfRowsBeforeCurrent += optionRows;
        }

        const amountOfLinesFromBottom = amountOfLines - prefixLines - sumOfRowsBeforeCurrent;
        clearTerminalLine({
          amountOfLinesFromBottom,
          amountOfLines: rowsPerOption[index],
        });
        const option = options[index];

        displayOption({
          option,
          selectedOptions,
          index,
          cursorIndex,
          isMultiSelect,
        });

        const moveCursorTo =
          process.stdout.rows - amountOfLinesFromBottom > 0
            ? amountOfLinesFromBottom - 1 // amountOfLinesFromBottom includes the current option as an additional line, as we substract the sum of rows before the current one.
            : // However, while moving the cursor, we want it to be exactly on the row of the option that was just changed, so we substract one that represents the current row.
              process.stdout.rows;
        readline.moveCursor(process.stdout, 0, moveCursorTo);
      });
    };

    displayOptions({});

    // process.stdin.setRawMode(true);
    // process.stdin.resume();

    process.stdin.on("data", (key) => {
      const keyCode = key.toString("hex");

      previousIndex = cursorIndex;
      if (keyCode === keyInputs.ARROW_UP) {
        if (cursorIndex === 0) {
          cursorIndex = options.length - 1;
        } else {
          cursorIndex--;
        }
      } else if (keyCode === keyInputs.ARROW_DOWN) {
        if (cursorIndex === options.length - 1) {
          cursorIndex = 0;
        } else {
          cursorIndex++;
        }
      } else if (keyCode === keyInputs.SPACE && options[cursorIndex] && isMultiSelect) {
        const option = options[cursorIndex];
        const isSelected = selectedOptions.includes(option);
        if (isSelected) {
          selectedOptions.splice(selectedOptions.indexOf(option), 1);
        } else {
          selectedOptions.push(option);
        }
      } else if (keyCode === keyInputs.ENTER) {
        if (!isMultiSelect) {
          const option = options[cursorIndex];
          selectedOptions.push(option);
        }

        process.stdout.write("\u001b[1A\u001b[K");
        rl.close();
        // process.stdin.setRawMode(false);
        revealTerminalCursor();
        resolve(selectedOptions);
        return;
      }

      displayOptions({ previousIndex });
    });
  });
};
