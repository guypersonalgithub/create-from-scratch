import { getAllPublicTablesList, initializeClient } from "@packages/postgresql";

const columnTypeTranslations = {
  integer: "number",
  "character varying": "string",
};

type GeneratePostgresDBTypesArgs = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  packageName: string;
};

export const generatePostgresDBTypes = async ({
  host,
  port,
  user,
  password,
  database,
  packageName,
}: GeneratePostgresDBTypesArgs) => {
  const client = initializeClient({ host, port, user, password, database });
  try {
    const tableTypes = await getAllPublicTablesList({ client });
    const tableTypesMap: Record<string, Record<string, string>> = {};

    tableTypes.forEach((tableType) => {
      const { table_name, column_name, data_type } = tableType;
      if (!tableTypesMap[table_name]) {
        tableTypesMap[table_name] = {};
      }

      tableTypesMap[table_name][column_name] = data_type;
    });

    let types: string[] = [];
    for (const table in tableTypesMap) {
      const properties: string[] = [`export type ${table}Properties = {`];
      const tableProperties = tableTypesMap[table];
      for (const column in tableProperties) {
        const columnType = tableProperties[
          column
        ] as keyof typeof columnTypeTranslations;
        const columnTypeTranslation =
          columnTypeTranslations[columnType] ?? columnType;
        properties.push(`${column}: ${columnTypeTranslation};`);
      }
      let tableData = properties.join("\r\n\t");
      tableData += "\r\n};";
      types.push(tableData);
    }

    return types;
  } catch (error) {
    console.log(error);
    console.error(`It seemes like connecting to the postgresql container failed. 
Please ensure that the appropriate container is up and running, and that the used connection details are correct.
If not, use the "auto-generate --container postgresql" command`);
    return [];
  }
};
