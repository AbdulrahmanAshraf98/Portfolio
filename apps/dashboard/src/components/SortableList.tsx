"use client";

import { type ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function DragHandle({ listeners, attributes }: { listeners?: object; attributes?: object }) {
  return (
    <button
      type="button"
      className="flex h-10 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-cyan-300 active:cursor-grabbing"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor" aria-hidden>
        <circle cx="4" cy="3" r="1.4" />
        <circle cx="10" cy="3" r="1.4" />
        <circle cx="4" cy="9" r="1.4" />
        <circle cx="10" cy="9" r="1.4" />
        <circle cx="4" cy="15" r="1.4" />
        <circle cx="10" cy="15" r="1.4" />
      </svg>
    </button>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (handle: ReactNode) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "z-10 rounded-xl opacity-80 shadow-2xl shadow-cyan-950/50" : ""}
    >
      {children(<DragHandle listeners={listeners} attributes={attributes} />)}
    </div>
  );
}

export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  disabled,
}: {
  items: T[];
  getId: (item: T) => string;
  onReorder: (next: T[]) => void;
  renderItem: (item: T, handle: ReactNode) => ReactNode;
  disabled?: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const ids = items.map(getId);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(items, from, to));
  }

  if (disabled) {
    return <div className="space-y-2">{items.map((item) => <div key={getId(item)}>{renderItem(item, null)}</div>)}</div>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableRow key={getId(item)} id={getId(item)}>
              {(handle) => renderItem(item, handle)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
