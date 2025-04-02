import { Fragment, useState } from "react";
import { StyledMainTitle } from "../../../styledComponents/StyledMainTitle";
import { Input } from "@packages/input";

export const Commands = () => {
  return (
    <div>
      <StyledMainTitle>Commands</StyledMainTitle>
      <div>
        <b>docker run</b> - each docker related command should start with docker run.
      </div>
      <SearchableCommands />
    </div>
  );
};

const commands: { command: string; description: string }[] = [];

const SearchableCommands = () => {
  const [displayedCommands, setDisplayedCommands] = useState(commands);

  return (
    <div>
      <Input
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
