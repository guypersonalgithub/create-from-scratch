import { Input } from "@packages/input";
import { Fragment, useState } from "react";

type Command = {
  command: string;
  description: string;
};

type SearchableCommandsProps = {
  commands: Command[];
};

export const SearchableCommands = ({ commands }: SearchableCommandsProps) => {
  const [displayedCommands, setDisplayedCommands] = useState(commands);

  return (
    <div>
      <Input
        value=""
        onChange={(e) => {
          const value = e.target.value.toLowerCase();
          const filteredCommands = commands.filter(
            (command) =>
              command.command.toLowerCase().includes(value) ||
              command.description.toLowerCase().includes(value),
          );
          setDisplayedCommands(filteredCommands);
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {displayedCommands.map((display) => {
          return (
            <Fragment key={display.command}>
              <div>{display.command}</div>
              <div>{display.description}</div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
