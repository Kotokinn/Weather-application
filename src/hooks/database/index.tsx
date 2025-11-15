"use client";

import Database from "@tauri-apps/plugin-sql";
import { createContext, type ReactNode, useContext, useEffect, useState, } from "react";
import { createTable, del, insert, select } from "./db"
import { data } from "./data";
import type { Event } from "./models/event";

interface DataJSON {
  tableName: string;
  columns: {
    column: string;
    type: string;
    unique?: string;
  }[];
  data?: any[];
}

interface DataBaseContextType {
  insertData: (table: string, values: any[]) => void
  delDataById: (table: string, id: number) => void
  delDataByDate: (table: string, date: string) => void
  getDataByDate: (table: string, date: string) => Promise<Event>
  getData: (table: string) => Promise<any>
}

const DataBaseContext = createContext<DataBaseContextType | null>(null);

interface DataBaseProviderProps {
  children: ReactNode;
}

// Provider
export const DataBaseProvider = ({ children }: DataBaseProviderProps) => {
  const path = "sqlite:app.db";
  useEffect(() => {
    async function initDB() {
      const db = await Database.load(path);

      try {
        const initTable = async (item: DataJSON) => {
          await createTable(db, item.tableName, item.columns);
        };
        data.forEach((element: DataJSON) => {
          initTable(element);
        });

      } catch (error) { }
    }
    initDB();
  }, []);

  const insertData = async (table, values) => {
    const db = await Database.load(path);
    return await insert(db, table, values);
  };

  const delDataById = async (table, id) => {
    let condition = "id=?";
    const db = await Database.load(path);
    return await del(db, table, condition, [id]);
  };
  const delDataByDate = async (table, date) => {
    let condition = "date = ?";
    const db = await Database.load(path);
    return await del(db, table, condition, [date]);
  };

  const getDataByDate = async (table, date) => {
    let condition = "date = ?"
    const db = await Database.load(path);
    return await select(db, table, [], condition, [date]);
  };

  const getData = async (table) => {
    const db = await Database.load(path)
    return await select(db, table, [])
  }

  return (
    <DataBaseContext.Provider
      value={{
        insertData,
        delDataById,
        delDataByDate,
        getDataByDate,
        getData
      }}
    >
      {children}
    </DataBaseContext.Provider>
  );
};

export const useDataBase = () => {
  const context = useContext(DataBaseContext);
  if (!context) {
    throw new Error("useDataBase must be used inside DataBaseProvider");
  }
  return context;
};
