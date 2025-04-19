import { useReducer, useCallback } from 'react';

/**
 * Provides a state with history tracking for undo/redo functionality
 * @param {*} initialState - Initial state value 
 * @param {number} maxHistory - Maximum number of history states to keep
 * @returns {Object} - State and history control methods
 */
const useHistoryState = (initialState, maxHistory = 30) => {
  // Define action types
  const ACTION_TYPES = {
    SET_STATE: 'SET_STATE',
    UNDO: 'UNDO',
    REDO: 'REDO',
    RESET: 'RESET'
  };

  // Initial history state
  const initialHistory = {
    past: [],
    present: initialState,
    future: []
  };

  // Reducer to handle state changes and history
  const historyReducer = (state, action) => {
    const { past, present, future } = state;

    switch (action.type) {
      case ACTION_TYPES.SET_STATE:
        // Only add to history if the state actually changed
        if (JSON.stringify(present) === JSON.stringify(action.payload)) {
          return state;
        }
        return {
          past: [...past.slice(-maxHistory + 1), present],
          present: action.payload,
          future: []
        };
      case ACTION_TYPES.UNDO:
        if (past.length === 0) return state;
        const previous = past[past.length - 1];
        return {
          past: past.slice(0, past.length - 1),
          present: previous,
          future: [present, ...future]
        };
      case ACTION_TYPES.REDO:
        if (future.length === 0) return state;
        const next = future[0];
        return {
          past: [...past, present],
          present: next,
          future: future.slice(1)
        };
      case ACTION_TYPES.RESET:
        return {
          past: [],
          present: action.payload || initialState,
          future: []
        };
      default:
        return state;
    }
  };

  // Create the reducer
  const [state, dispatch] = useReducer(historyReducer, initialHistory);
  
  // Set state and record in history
  const setState = useCallback((newState) => {
    const value = typeof newState === 'function'
      ? newState(state.present)
      : newState;
    
    dispatch({ type: ACTION_TYPES.SET_STATE, payload: value });
  }, [state.present]);

  // Undo the last change
  const undo = useCallback(() => {
    dispatch({ type: ACTION_TYPES.UNDO });
  }, []);

  // Redo a previously undone change
  const redo = useCallback(() => {
    dispatch({ type: ACTION_TYPES.REDO });
  }, []);

  // Reset to initial state or a new state
  const reset = useCallback((newState) => {
    dispatch({ type: ACTION_TYPES.RESET, payload: newState });
  }, []);

  // Check if undo/redo are available
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return {
    state: state.present,
    setState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    history: {
      past: state.past,
      present: state.present,
      future: state.future
    }
  };
};

export default useHistoryState;
