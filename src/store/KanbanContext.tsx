"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type Card = {
  id: string;
  title: string;
  details: string;
  columnId: string;
};

export type Column = {
  id: string;
  title: string;
};

export type KanbanState = {
  columns: Column[];
  cards: Card[];
};

type KanbanAction =
  | { type: 'ADD_CARD'; payload: { columnId: string; title: string; details: string } }
  | { type: 'DELETE_CARD'; payload: { cardId: string } }
  | { type: 'MOVE_CARD'; payload: { cardId: string; targetColumnId: string } }
  | { type: 'RENAME_COLUMN'; payload: { columnId: string; title: string } };

const initialColumns: Column[] = [
  { id: 'col-1', title: 'To Do' },
  { id: 'col-2', title: 'In Progress' },
  { id: 'col-3', title: 'Review' },
  { id: 'col-4', title: 'Testing' },
  { id: 'col-5', title: 'Done' },
];

const initialCards: Card[] = [
  { id: 'card-1', title: 'Setup project', details: 'Initialize Next.js and styling.', columnId: 'col-5' },
  { id: 'card-2', title: 'Design system', details: 'Apply CSS variables and typography.', columnId: 'col-5' },
  { id: 'card-3', title: 'State management', details: 'Implement React Context and reducer.', columnId: 'col-2' },
  { id: 'card-4', title: 'Drag and Drop', details: 'Integrate @dnd-kit core.', columnId: 'col-1' },
  { id: 'card-5', title: 'Write tests', details: 'Unit and E2E testing for all features.', columnId: 'col-1' },
];

const initialState: KanbanState = {
  columns: initialColumns,
  cards: initialCards,
};

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case 'ADD_CARD': {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title: action.payload.title,
        details: action.payload.details,
        columnId: action.payload.columnId,
      };
      return { ...state, cards: [...state.cards, newCard] };
    }
    case 'DELETE_CARD': {
      return {
        ...state,
        cards: state.cards.filter((c) => c.id !== action.payload.cardId),
      };
    }
    case 'MOVE_CARD': {
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.payload.cardId
            ? { ...c, columnId: action.payload.targetColumnId }
            : c
        ),
      };
    }
    case 'RENAME_COLUMN': {
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.payload.columnId
            ? { ...col, title: action.payload.title }
            : col
        ),
      };
    }
    default:
      return state;
  }
}

type KanbanContextType = {
  state: KanbanState;
  dispatch: React.Dispatch<KanbanAction>;
};

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
