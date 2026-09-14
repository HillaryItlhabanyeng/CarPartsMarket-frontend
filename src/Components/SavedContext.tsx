import { createContext, useState, type ReactNode } from "react";
import type { SavedItem } from "./SavedContext.types";

type SavedContextType = {
  savedItems: SavedItem[];
  toggleSaved: (item: SavedItem) => void;
  removeSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export { SavedContext };

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

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