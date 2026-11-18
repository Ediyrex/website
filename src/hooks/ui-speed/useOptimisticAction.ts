"use client";

import { useState, useCallback, useRef } from "react";

export interface OptimisticActionOptions<TState> {
  onSuccess?: (result: any, newState: TState) => void;
  onError?: (error: Error, previousState: TState) => void;
}

/**
 * Executes state changes optimistically, updating the local UI immediately
 * before sending network requests, and rolling back smoothly if an error occurs.
 */
export function useOptimisticAction<TState>(initialState: TState) {
  const [state, setState] = useState<TState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const previousStateRef = useRef<TState>(initialState);

  const executeOptimistic = useCallback(
    async <TResult>(
      optimisticUpdater: (prev: TState) => TState,
      asyncAction: () => Promise<TResult>,
      options?: OptimisticActionOptions<TState>
    ): Promise<TResult | null> => {
      // Snapshot state for potential rollback
      previousStateRef.current = state;
      const optimisticState = optimisticUpdater(state);
      setState(optimisticState);
      setIsPending(true);
      setError(null);

      try {
        const result = await asyncAction();
        options?.onSuccess?.(result, optimisticState);
        return result;
      } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        // Rollback state on error
        setState(previousStateRef.current);
        setError(errorObj);
        options?.onError?.(errorObj, previousStateRef.current);
        return null;
      } finally {
        setIsPending(false);
      }
    },
    [state]
  );

  return {
    state,
    setState,
    executeOptimistic,
    isPending,
    error,
  };
}
