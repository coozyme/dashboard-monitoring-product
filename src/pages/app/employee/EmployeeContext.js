import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { userData } from "./UserData";

export const EmployeeContext = createContext();

export const EmployeeContextProvider = (props) => {
  const [data, setData] = useState(userData);

  return <EmployeeContext.Provider value={{ contextData: [data, setData] }}><Outlet /></EmployeeContext.Provider>;
};
