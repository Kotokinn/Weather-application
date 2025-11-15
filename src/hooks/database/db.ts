type CreatTableTypes = {
  db: any;
  tableName: string;
  columns: any[];
};

export const createTable = async (db, tableName, columns) => {
  await db.execute(`CREATE TABLE IF NOT EXISTS ${tableName} (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      ${columns.map((col: any) => `${col.column} ${col.type} ${col?.unique}`).join(", ")}
                  )`);
};

export const select = async (db: any, tableName: string, columns: any[] = [], condition?: string, params: any[] = [],) => {
  const colStr =
    !columns
      ? columns
        .map((c: any) => (typeof c === "string" ? c : c.column))
        .join(", ")
      : "*";

  let sql = `SELECT ${colStr} FROM ${tableName}`;
  if (condition) sql += ` WHERE ${condition}`;

  return await db.select(sql, params);
};

export const insert = async (
  db: any,
  tableName: string,
  values: Record<string, any>[],
) => {
  try {
    if (!values) return;

    const columns = Object.keys(values[0]);

    const rowPlaceholder = `(${columns.map(() => "?").join(",")})`;

    const placeholders = values.map(() => rowPlaceholder).join(", ");

    const flatValues = values.flatMap(Object.values);

    const query = `INSERT OR IGNORE INTO ${tableName} (${columns.join(",")}) VALUES ${placeholders}`;

    return await db.execute(query, flatValues);
  } catch (error) {
    console.error("Insert error:", error);
    throw error;
  }
};


export const del = async (db: any, tableName: string, condition?: string, params: any[] = [],) => {
  try {
    let sql = `DELETE FROM ${tableName}`;
    if (condition) sql += ` WHERE ${condition}`;
    return await db.execute(sql, params);
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};