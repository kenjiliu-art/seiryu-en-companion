import {
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

interface UseSearchListNavigationOptions<T> {
  items: T[];
  onSelect: (item: T) => void;
  onEscape?: () => void;
}

interface UseSearchListNavigationResult {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  resetActiveIndex: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  getItemRef: (index: number) => RefObject<HTMLButtonElement | null>;
}

export function useSearchListNavigation<T>({
  items,
  onSelect,
  onEscape,
}: UseSearchListNavigationOptions<T>): UseSearchListNavigationResult {
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemRefs = useRef<
    Array<RefObject<HTMLButtonElement | null>>
  >([]);

  if (itemRefs.current.length !== items.length) {
    itemRefs.current = items.map(
      (_, index) =>
        itemRefs.current[index] ??
        ({ current: null } as RefObject<HTMLButtonElement | null>),
    );
  }

  const resetActiveIndex = () => {
    setActiveIndex(-1);
  };

  const getItemRef = (
    index: number,
  ): RefObject<HTMLButtonElement | null> => {
    return itemRefs.current[index];
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      resetActiveIndex();
      onEscape?.();
      return;
    }

    if (items.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) => {
        if (currentIndex < 0) {
          return 0;
        }

        return (currentIndex + 1) % items.length;
      });

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((currentIndex) => {
        if (currentIndex < 0) {
          return items.length - 1;
        }

        return (
          (currentIndex - 1 + items.length) %
          items.length
        );
      });

      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      const selectedItem = items[activeIndex];

      if (selectedItem) {
        onSelect(selectedItem);
      }
    }
  };

  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(items.length > 0 ? items.length - 1 : -1);
    }
  }, [activeIndex, items.length]);

  useEffect(() => {
    if (activeIndex < 0) {
      return;
    }

    itemRefs.current[activeIndex]?.current?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  return {
    activeIndex,
    setActiveIndex,
    resetActiveIndex,
    handleKeyDown,
    getItemRef,
  };
}