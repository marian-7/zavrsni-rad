import { useCallback, useState } from "react";

export function useToggleState<T>(
  initialState: T,
  [on, off]: [T, T]
): [T, () => void, (value: T) => void] {
  const [state, setState] = useState<T>(initialState);

  const toggleState = useCallback(() => {
    setState((s) => (s === on ? off : on));
  }, [off, on]);

  return [state, toggleState, setState];
}
