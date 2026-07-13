"use client";

import { Trip } from "@/shared/domain/models";
import { TripStatus } from "@/shared/domain/enums";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { MapPin, ArrowRight, Clock, Box } from "lucide-react";
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent, 
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { tripManagementService } from "@/modules/trips";

type TripsBoardProps = {
  trips: Trip[];
  onTripClick: (trip: Trip) => void;
  onTripMoved?: () => void;
};

export function TripsBoard({ trips: initialTrips, onTripClick, onTripMoved }: TripsBoardProps) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setTrips(initialTrips);
  }, [initialTrips]);

  const dispatched = trips.filter(t => t.status === TripStatus.Dispatched);
  const inTransit = trips.filter(t => t.status === TripStatus.InTransit);
  const completed = trips.filter(t => t.status === TripStatus.Completed);

  const handleDragStart = (event: DragStartEvent) => {
    const tripId = event.active.id as string;
    setActiveTrip(trips.find(t => t.id === tripId) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTrip(null);
    const { active, over } = event;
    if (!over) return;

    const tripId = active.id as string;
    const overId = over.id as string; // Could be a column ID or another trip ID

    // Find what status we dropped onto
    let newStatus: TripStatus | null = null;
    
    if (overId === "col-dispatched") newStatus = TripStatus.Dispatched;
    else if (overId === "col-intransit") newStatus = TripStatus.InTransit;
    else if (overId === "col-completed") newStatus = TripStatus.Completed;
    else {
      // Dropped on another trip, copy its status
      const overTrip = trips.find(t => t.id === overId);
      if (overTrip) {
        newStatus = overTrip.status;
      }
    }

    if (newStatus) {
      // Optimistic update
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: newStatus! } : t));
      
      // Update backend
      tripManagementService.updateTripStatus(tripId, newStatus);
      
      if (onTripMoved) {
        onTripMoved();
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        <TripColumn id="col-dispatched" title="Ready / Dispatched" count={dispatched.length} trips={dispatched} onClick={onTripClick} />
        <TripColumn id="col-intransit" title="In Transit" count={inTransit.length} trips={inTransit} onClick={onTripClick} />
        <TripColumn id="col-completed" title="Completed" count={completed.length} trips={completed} onClick={onTripClick} isDraggable={false} />
      </div>

      <DragOverlay>
        {activeTrip ? <TripCard trip={activeTrip} onClick={() => {}} isDraggingOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function TripColumn({ id, title, count, trips, onClick, isDraggable = true }: { id: string, title: string, count: number, trips: Trip[], onClick: (t: Trip) => void, isDraggable?: boolean }) {
  // Make the column itself a droppable zone using SortableContext
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <span className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
          {count}
        </span>
      </div>
      
      <SortableContext id={id} items={trips.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[200px] rounded-xl transition-colors">
          {trips.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-slate-200 bg-slate-50/50 py-10">
              <Box className="size-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-400">Drop here</p>
            </div>
          ) : (
            trips.map(trip => (
              <SortableTripCard key={trip.id} trip={trip} onClick={onClick} isDraggable={isDraggable} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableTripCard({ trip, onClick, isDraggable = true }: { trip: Trip, onClick: (t: Trip) => void, isDraggable?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: trip.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TripCard trip={trip} onClick={onClick} />
    </div>
  );
}

function TripCard({ trip, onClick, isDraggingOverlay }: { trip: Trip, onClick: (t: Trip) => void, isDraggingOverlay?: boolean }) {
  return (
    <div 
      onClick={() => onClick(trip)}
      className={`group cursor-grab active:cursor-grabbing rounded-[20px] bg-white p-5 border border-slate-100 transition-all duration-200 
        ${isDraggingOverlay ? 'shadow-2xl scale-105 border-indigo-200' : 'shadow-soft hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {trip.tripNumber}
        </span>
        <StatusBadge status={trip.status} size="sm" />
      </div>

      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{trip.origin}</p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-slate-300" />
        <div className="flex-1 min-w-0 text-right">
          <p className="truncate text-sm font-semibold text-slate-900">{trip.destination}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
          <MapPin className="size-3.5" />
          <span>{trip.plannedDistance} km</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
          <Clock className="size-3.5" />
          <span>
            {new Date(trip.scheduledStartAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}
