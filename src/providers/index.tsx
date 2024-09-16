"use client";
import React, { ReactNode } from "react";
import ReactQueryProvider from "./ReactQuery";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

export default GlobalProvider;
