import { useEffect } from "react";

interface KeyBinding {
  key: string;
  modifiers?: {
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
  };
  callback: (event: KeyboardEvent) => void;
}

const useKeyBindings = (bindings: KeyBinding[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      bindings.forEach(({ key, modifiers = {}, callback }) => {
        const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
        const ctrlOrMetaPressed = isMac ? event.metaKey : event.ctrlKey;

        if (
          event.key === key &&
          (modifiers.ctrlKey === undefined ||
            modifiers.ctrlKey === ctrlOrMetaPressed) &&
          (modifiers.metaKey === undefined ||
            modifiers.metaKey === event.metaKey) &&
          (modifiers.shiftKey === undefined ||
            modifiers.shiftKey === event.shiftKey)
        ) {
          event.preventDefault();
          callback(event);
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [bindings]);
};

export default useKeyBindings;
