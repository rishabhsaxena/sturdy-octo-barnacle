import { useState, useCallback } from "react";

export function useHistory() {
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const record = useCallback((action) => {
    setPast((prevPast) => [...prevPast, action]);
    setFuture([]); // Clear future when a new action is performed
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const lastAction = past[past.length - 1];
    setPast((prevPast) => prevPast.slice(0, -1));

    // Execute the undo logic
    lastAction.undo();

    setFuture((prevFuture) => [lastAction, ...prevFuture]);
  }, [past]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const nextAction = future[0];
    setFuture((prevFuture) => prevFuture.slice(1));

    // Execute the redo logic
    nextAction.redo();

    setPast((prevPast) => [...prevPast, nextAction]);
  }, [future]);

  return {
    undo,
    redo,
    record,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
