"use client";
import React, { ReactNode } from "react";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default GlobalProvider;
