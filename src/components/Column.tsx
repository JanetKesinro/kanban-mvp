"use client";

import { useState } from "react";
import { useKanban, Column as ColumnType } from "@/store/KanbanContext";
import { Card } from "./Card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Edit2, Check } from "lucide-react";
import styles from "./Column.module.css";

export function Column({ column }: { column: ColumnType }) {
  const { state, dispatch } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const columnCards = state.cards.filter((card) => card.columnId === column.id);

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleRename = () => {
    if (title.trim() && title !== column.title) {
      dispatch({
        type: "RENAME_COLUMN",
        payload: { columnId: column.id, title: title.trim() },
      });
    }
    setIsEditing(false);
  };

  const handleAddCard = () => {
    const newTitle = prompt("Enter card title:");
    if (!newTitle) return;
    const newDetails = prompt("Enter card details:");
    dispatch({
      type: "ADD_CARD",
      payload: {
        columnId: column.id,
        title: newTitle,
        details: newDetails || "",
      },
    });
  };

  return (
    <div className={styles.column} ref={setNodeRef}>
      <div className={styles.header}>
        {isEditing ? (
          <div className={styles.editTitle}>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className={styles.titleInput}
            />
            <button onClick={handleRename} className="icon-btn" aria-label="Save title">
              <Check size={16} />
            </button>
          </div>
        ) : (
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{column.title}</h2>
            <span className={styles.cardCount}>{columnCards.length}</span>
            <button
              onClick={() => setIsEditing(true)}
              className={`icon-btn ${styles.editBtn}`}
              aria-label="Edit column title"
            >
              <Edit2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.cardList}>
        <SortableContext
          items={columnCards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnCards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      <button onClick={handleAddCard} className={styles.addCardBtn}>
        <Plus size={16} />
        <span>Add Card</span>
      </button>
    </div>
  );
}
