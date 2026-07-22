import { renderHook, act } from '@testing-library/react';
import { useKanban, KanbanProvider } from '../KanbanContext';
import React from 'react';

describe('KanbanContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <KanbanProvider>{children}</KanbanProvider>
  );

  it('provides initial state', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    expect(result.current.state.columns).toHaveLength(5);
    expect(result.current.state.cards.length).toBeGreaterThan(0);
  });

  it('adds a card', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    const initialCardsLength = result.current.state.cards.length;

    act(() => {
      result.current.dispatch({
        type: 'ADD_CARD',
        payload: { columnId: 'col-1', title: 'New Card', details: 'Card details' },
      });
    });

    expect(result.current.state.cards).toHaveLength(initialCardsLength + 1);
    const addedCard = result.current.state.cards[result.current.state.cards.length - 1];
    expect(addedCard.title).toBe('New Card');
    expect(addedCard.details).toBe('Card details');
    expect(addedCard.columnId).toBe('col-1');
  });

  it('deletes a card', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    const cardToDelete = result.current.state.cards[0];

    act(() => {
      result.current.dispatch({
        type: 'DELETE_CARD',
        payload: { cardId: cardToDelete.id },
      });
    });

    const deletedCard = result.current.state.cards.find(c => c.id === cardToDelete.id);
    expect(deletedCard).toBeUndefined();
  });

  it('moves a card', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    const cardToMove = result.current.state.cards[0];
    
    expect(cardToMove.columnId).not.toBe('col-2');

    act(() => {
      result.current.dispatch({
        type: 'MOVE_CARD',
        payload: { cardId: cardToMove.id, targetColumnId: 'col-2' },
      });
    });

    const movedCard = result.current.state.cards.find(c => c.id === cardToMove.id);
    expect(movedCard?.columnId).toBe('col-2');
  });

  it('renames a column', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    
    act(() => {
      result.current.dispatch({
        type: 'RENAME_COLUMN',
        payload: { columnId: 'col-1', title: 'New Column Title' },
      });
    });

    const column = result.current.state.columns.find(c => c.id === 'col-1');
    expect(column?.title).toBe('New Column Title');
  });
});
