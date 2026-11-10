"use client";

import React, { createContext, useContext } from "react";

export interface AdminSessionUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
}

interface AdminContextValue {
  user: AdminSessionUser;
  canEdit: boolean;
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({
  user,
  children,
}: {
  user: AdminSessionUser;
  children: React.ReactNode;
}) {
  const isAdmin = user.roles.includes("admin");
  const canEdit = isAdmin || user.roles.includes("editor");

  return (
    <AdminContext.Provider value={{ user, canEdit, isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminUser(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminUser must be used within AdminProvider.");
  }
  return ctx;
}

