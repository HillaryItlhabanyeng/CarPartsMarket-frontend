import { createContext, useEffect, useState, type ReactNode } from "react";
import type { SavedItem } from "./SavedContext.types";

type SavedContextType = {
  savedItems: SavedItem[];
  toggleSaved: (item: SavedItem) => void;
  removeSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export { SavedContext };

const SAVED_STORAGE_KEY = "automarket_wishlist";


function getSavedStorageKey(): string {
  try {
    const raw = localStorage.getItem("marketplace_current_user");
    const user = raw ? JSON.parse(raw) : null;
    const email = String(user?.email ?? "").trim().toLowerCase();
    return email ? `${SAVED_STORAGE_KEY}:${email}` : `${SAVED_STORAGE_KEY}:guest`;
  } catch {
    return `${SAVED_STORAGE_KEY}:guest`;
  }
}

function loadSaved(): SavedItem[] {
  try {
    const raw = localStorage.getItem(getSavedStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(loadSaved);

  
  useEffect(() => {
    localStorage.setItem(getSavedStorageKey(), JSON.stringify(savedItems));
  }, [savedItems]);

  
  useEffect(() => {
    const refresh = () => setSavedItems(loadSaved());
    window.addEventListener("automarket-user-updated", refresh);
    return () => window.removeEventListener("automarket-user-updated", refresh);
  }, []);

  const toggleSaved = (item: SavedItem) => {
    setSavedItems((prev) => {
      const alreadySaved = prev.some((i) => i.id === item.id);
      if (alreadySaved) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const removeSaved = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isSaved = (id: string) => savedItems.some((i) => i.id === id);

  return (
    <SavedContext.Provider
      value={{ savedItems, toggleSaved, removeSaved, isSaved }}
    >
      {children}
    </SavedContext.Provider>
  );
}