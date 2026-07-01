"use client";

import { useEffect, useState, useTransition } from "react";
import type { ProjectRoom } from "@musempire/contracts";

type ProjectRoomsResponse = {
  projectRooms: ProjectRoom[];
};

export default function ProjectRoomGrid() {
  const [rooms, setRooms] = useState<ProjectRoom[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/project-rooms")
      .then((response) => response.json() as Promise<ProjectRoomsResponse>)
      .then((payload) => setRooms(payload.projectRooms))
      .catch(() => {
        return;
      });
  }, []);

  const createRoom = () => {
    startTransition(async () => {
      const response = await fetch("/api/project-rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || "Untitled Alpha Room",
          description,
        }),
      });

      const payload = (await response.json()) as ProjectRoomsResponse;
      if (response.ok) {
        setRooms(payload.projectRooms);
        setName("");
        setDescription("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/75">Project Rooms</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Room name"
            className="h-12 rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white placeholder:text-white/45 outline-none"
          />
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the room objective, milestone, or release sprint"
            className="h-12 rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white placeholder:text-white/45 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={createRoom}
          disabled={isPending}
          className="glow-button mt-4 rounded-full border border-fuchsia-300/70 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Creating..." : "Create Room"}
        </button>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {rooms.map((room) => (
          <article key={room.id} className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-white">{room.name}</p>
                <p className="mt-1 text-sm text-white/58">Role: {room.memberRole}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/68">
                {room.taskSummary.todo + room.taskSummary.inProgress + room.taskSummary.done} tasks
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{room.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
              <Metric label="Todo" value={room.taskSummary.todo} />
              <Metric label="Active" value={room.taskSummary.inProgress} />
              <Metric label="Done" value={room.taskSummary.done} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">{label}</p>
    </div>
  );
}
