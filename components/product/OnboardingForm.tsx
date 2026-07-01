"use client";

import { useMemo, useState, useTransition } from "react";
import type { Role } from "@musempire/contracts";

const roleOptions: { value: Role; label: string; copy: string }[] = [
  { value: "artist", label: "Artist", copy: "Create, release, and find collaborators." },
  { value: "provider", label: "Provider", copy: "Offer production, studio, marketing, or visual services." },
  { value: "fan", label: "Fan", copy: "Discover artists and request access to selected spaces." },
];

export default function OnboardingForm() {
  const [form, setForm] = useState({
    role: "artist" as Role,
    displayName: "",
    username: "",
    city: "",
    region: "",
    country: "",
    genres: "",
    instruments: "",
    skills: "",
    privacyLevel: "city",
    isSeekingCollaboration: true,
    preciseLocationEnabled: false,
    consentLocation: false,
    consentAi: false,
    consentMarketing: false,
  });
  const [message, setMessage] = useState("Musempire defaults to city-level discovery for safety.");
  const [isPending, startTransition] = useTransition();

  const roleCopy = useMemo(
    () => roleOptions.find((option) => option.value === form.role)?.copy ?? "",
    [form.role],
  );

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submit = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: form.role,
            displayName: form.displayName,
            username: form.username || undefined,
            city: form.city,
            region: form.region || undefined,
            country: form.country,
            privacyLevel: form.privacyLevel,
            genres: form.genres.split(",").map((value) => value.trim()).filter(Boolean),
            instruments: form.instruments.split(",").map((value) => value.trim()).filter(Boolean),
            skills: form.skills.split(",").map((value) => value.trim()).filter(Boolean),
            isSeekingCollaboration: form.isSeekingCollaboration,
            preciseLocationEnabled: form.preciseLocationEnabled,
            consentLocation: form.consentLocation,
            consentAi: form.consentAi,
            consentMarketing: form.consentMarketing,
          }),
        });

        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to save onboarding.");
        }

        window.location.href = "/app";
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to save onboarding.");
      }
    });
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
      <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/75">Alpha Onboarding</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Set your collaboration identity</h1>
      <p className="mt-4 text-sm leading-relaxed text-white/72 sm:text-base">{roleCopy}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update("role", option.value)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  form.role === option.value
                    ? "border-fuchsia-300/50 bg-fuchsia-500/10 text-white"
                    : "border-white/10 bg-black/30 text-white/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <Field label="Display name">
            <input
              value={form.displayName}
              onChange={(event) => update("displayName", event.target.value)}
              className="input-base"
            />
          </Field>

          <Field label="Username">
            <input
              value={form.username}
              onChange={(event) => update("username", event.target.value.toLowerCase())}
              className="input-base"
            />
          </Field>

          <Field label="Genres">
            <input
              value={form.genres}
              onChange={(event) => update("genres", event.target.value)}
              placeholder="indie pop, afrobeat, drill"
              className="input-base"
            />
          </Field>

          <Field label="Instruments">
            <input
              value={form.instruments}
              onChange={(event) => update("instruments", event.target.value)}
              placeholder="vocals, guitar, production"
              className="input-base"
            />
          </Field>

          <Field label="Skills">
            <input
              value={form.skills}
              onChange={(event) => update("skills", event.target.value)}
              placeholder="mixing, toplining, visual direction"
              className="input-base"
            />
          </Field>
        </section>

        <section className="space-y-4">
          <Field label="City">
            <input value={form.city} onChange={(event) => update("city", event.target.value)} className="input-base" />
          </Field>

          <Field label="Region">
            <input
              value={form.region}
              onChange={(event) => update("region", event.target.value)}
              className="input-base"
            />
          </Field>

          <Field label="Country">
            <input
              value={form.country}
              onChange={(event) => update("country", event.target.value)}
              className="input-base"
            />
          </Field>

          <Field label="Visibility">
            <select
              value={form.privacyLevel}
              onChange={(event) => update("privacyLevel", event.target.value)}
              className="input-base"
            >
              <option value="hidden">Hidden</option>
              <option value="city">City-level</option>
              <option value="precise">Precise opt-in</option>
            </select>
          </Field>

          <Toggle
            label="Open to collaboration"
            checked={form.isSeekingCollaboration}
            onChange={(value) => update("isSeekingCollaboration", value)}
          />
          <Toggle
            label="Enable precise location on my map pin"
            checked={form.preciseLocationEnabled}
            onChange={(value) => update("preciseLocationEnabled", value)}
          />
          <Toggle
            label="I consent to city or precise map visibility based on my settings"
            checked={form.consentLocation}
            onChange={(value) => update("consentLocation", value)}
          />
          <Toggle label="I consent to AiM beta assistance" checked={form.consentAi} onChange={(value) => update("consentAi", value)} />
          <Toggle
            label="Send me Musempire product updates"
            checked={form.consentMarketing}
            onChange={(value) => update("consentMarketing", value)}
          />
        </section>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/65">{message}</p>
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="glow-button rounded-full border border-fuchsia-300/70 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Enter The Workspace"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/75">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
        checked ? "border-fuchsia-300/45 bg-fuchsia-500/10 text-white" : "border-white/10 bg-black/30 text-white/70"
      }`}
    >
      <span>{label}</span>
      <span>{checked ? "On" : "Off"}</span>
    </button>
  );
}
