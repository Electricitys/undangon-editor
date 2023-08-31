import { useState, useEffect, ChangeEvent } from "react";

interface Item {
  id: number;
  name: string;
}

interface Options<Y = Item> {
  onListChange?: (items: Y[]) => void;
}

interface HookReturnType<Y> {
  items: Y[];
  addItem: (item: Y) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, updatedItem: Y) => void;
  getAllItems: () => Y[];
  clearAllItems: () => void;
  filterText: string;
  setFilterText: (text: string) => void;
  sortBy: string;
  setSortBy: (sortField: string) => void;
  handleFilterTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSortByChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const useList = function <Y = Item>(
  initialItems: Y[] = [],
  options: Options<Y> = {}
): HookReturnType<Y> {
  console.log(initialItems);
  const { onListChange } = options;

  // Use controlledItems state if initialItems prop is provided.
  const [controlledItems, setControlledItems] = useState<Y[] | undefined>(
    initialItems.length > 0 ? initialItems : undefined
  );
  const [filterText, setFilterText] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name"); // Default sorting by name

  const addItem = (item: Y) => {
    if (typeof controlledItems !== "undefined") {
      setControlledItems([...controlledItems, item]);
    }
  };

  const removeItem = (index: number) => {
    if (typeof controlledItems !== "undefined") {
      const updatedItems = [...controlledItems];
      updatedItems.splice(index, 1);
      setControlledItems(updatedItems);
    }
  };

  const updateItem = (index: number, updatedItem: Y) => {
    if (typeof controlledItems !== "undefined") {
      const updatedItems = [...controlledItems];
      updatedItems[index] = updatedItem;
      setControlledItems(updatedItems);
    }
  };

  const getAllItems = (): Y[] => {
    if (controlledItems) {
      return controlledItems;
    }
    return [];
  };

  const clearAllItems = () => {
    if (!controlledItems) {
      setControlledItems([]);
    }
  };

  const handleFilterTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleSortByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  useEffect(() => {
    if (onListChange) {
      if (controlledItems) {
        onListChange(controlledItems);
      }
    }
  }, [controlledItems, onListChange]);

  return {
    items: controlledItems || [],
    addItem,
    removeItem,
    updateItem,
    getAllItems,
    clearAllItems,
    filterText,
    setFilterText,
    sortBy,
    setSortBy,
    handleFilterTextChange,
    handleSortByChange,
  };
};

export default useList;
