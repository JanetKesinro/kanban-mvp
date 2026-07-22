"use client";

import { useKanban } from "@/store/KanbanContext";
import { Column } from "./Column";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import styles from "./Board.module.css";

export function Board() {
  const { state, dispatch } = useKanban();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    // Sortable items format their ID for dnd-kit. We just need the active item's original ID and the target column ID
    // If we dropped over a column
    const targetId = over.id.toString();
    const activeId = active.id.toString();
    
    // Check if target is a column or a card
    const targetColumn = state.columns.find(c => c.id === targetId);
    const targetCard = state.cards.find(c => c.id === targetId);
    
    let destinationColumnId = null;
    if (targetColumn) {
      destinationColumnId = targetColumn.id;
    } else if (targetCard) {
      destinationColumnId = targetCard.columnId;
    }

    if (destinationColumnId) {
       dispatch({
         type: 'MOVE_CARD',
         payload: { cardId: activeId, targetColumnId: destinationColumnId }
       });
    }
  };

  return (
    <div className={styles.boardContainer}>
      <header className={styles.header}>
        <h1>Kanban Board</h1>
      </header>
      <div className={styles.board}>
        <DndContext id="kanban-board" collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          {state.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
