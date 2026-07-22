"use client";

import { useKanban, Card as CardType } from "@/store/KanbanContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import styles from "./Card.module.css";

export function Card({ card }: { card: CardType }) {
  const { dispatch } = useKanban();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_CARD", payload: { cardId: card.id } });
  };

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
      ref={setNodeRef}
      style={style}
    >
      <div
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
      >
        <div className={styles.accentLine} />
        <div className={styles.content}>
          <h3 className={styles.title}>{card.title}</h3>
          {card.details && <p className={styles.details}>{card.details}</p>}
        </div>
      </div>
      <button
        onClick={handleDelete}
        className={`icon-btn ${styles.deleteBtn}`}
        aria-label="Delete card"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
