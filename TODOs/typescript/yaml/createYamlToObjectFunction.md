- Create a yaml to object function, use this as a base:

type YamlValue = string | number | boolean | Record<string, any> | YamlValue[];

function parseYamlLine(line: string): [string, YamlValue] {
  const [key, value] = line.trim().split(/:\s*(.+)/);
  if (value === "undefined") return [key, undefined];
  if (value === "null") return [key, null];
  if (value === "true") return [key, true];
  if (value === "false") return [key, false];
  if (!isNaN(Number(value))) return [key, Number(value)];
  if (value?.startsWith("[") && value.endsWith("]")) {
    return [
      key,
      value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim()),
    ];
  }
  return [key, value || ""];
}

function parseYamlBlock(lines: string[], indentLevel: number = 0): Record<string, any> {
  const obj: Record<string, any> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const currentIndent = line.match(/^(\s*)/)?.[0]?.length || 0;

    if (currentIndent < indentLevel) {
      break;
    }

    if (line.trim() === "" || currentIndent > indentLevel) {
      i++;
      continue;
    }

    const [key, value] = parseYamlLine(line);
    const linesLength = lines[i + 1]?.match(/^(\s*)/)?.[0]?.length;
    if (linesLength && linesLength > currentIndent) {
      const nestedBlock = parseYamlBlock(lines.slice(i + 1), currentIndent + 2);
      obj[key] = nestedBlock;
      i += Object.keys(nestedBlock).length + 1;
    } else {
      obj[key] = value;
      i++;
    }
  }

  return obj;
}

function parseYaml(yamlString: string): Record<string, any> {
  const lines = yamlString.split("\n");
  return parseYamlBlock(lines);
}

// Example usage:
const yamlString = `
services:
  angular:
    image: 'angular:latest'
    environment:
      - NODE_ENV=development
    build:
      dockerfile: ./docker/Dockerfile.angular
      context: ./
      target: development
    profiles:
      - angular
    restart: unless-stopped
    volumes:
      - type: bind
        source: ./apps/angular/
        target: /usr/src/app/
      - type: volume
        target: /usr/src/app/node_modules
      - type: bind
        source: ./packages/micro-frontends
        target: /usr/src/app/packages/micro-frontends
    networks:
      - frontend
    ports:
      - '3005:3005'
    depends_on: undefined
`;

const config = parseYaml(yamlString);
console.log(config);
