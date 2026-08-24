"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { FileField } from "@/components/FileField";
import { SecurityPanel } from "@/components/SecurityPanel";
import { SortableList } from "@/components/SortableList";
import { ADMIN_CREATE, ADMIN_DELETE, ADMIN_LIST, ADMIN_UPDATE, gql } from "@/lib/gql";
import { RESOURCE_SCHEMA, type Field } from "@/lib/schema";

function webOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return "http://localhost:3000";
  }
  return "https://aa-web-gamma.vercel.app";
}

function itemThumb(item: Record<string, unknown>) {
  const firstMedia = Array.isArray(item.mediaUrls) ? String(item.mediaUrls[0] ?? "") : "";
  const raw = String(item.imageUrl ?? item.mediaUrl ?? item.iconUrl ?? firstMedia ?? "");
  if (!raw) return "";
  if (raw.startsWith("/")) return `${webOrigin()}${raw}`;
  return raw;
}

const SECTION_KEYS = ["skills", "experience", "projects", "education", "featured", "certificates", "earlier"];

const NAV = [
  { group: "Site", items: ["profiles", "highlights", "settings"] },
  { group: "CV", items: ["experiences", "educations", "skills", "projects"] },
  { group: "More", items: ["certificates", "socials", "contacts"] },
];

function emptyFrom(fields: Field[]) {
  return Object.fromEntries(
    fields.map((field) => {
      if (field.type === "boolean") return [field.key, false];
      if (field.type === "number") return [field.key, 0];
      if (field.type === "list") return [field.key, []];
      return [field.key, ""];
    }),
  );
}

function toFormValue(field: Field, value: unknown) {
  if (field.type === "list") return Array.isArray(value) ? value.join("\n") : "";
  if (field.type === "boolean") return Boolean(value);
  if (field.type === "number") return Number(value ?? 0);
  return String(value ?? "");
}

function fromFormValue(field: Field, value: unknown) {
  if (field.type === "list") {
    if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
    return String(value)
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (field.type === "boolean") return Boolean(value);
  if (field.type === "number") return Number(value);
  return value;
}

function itemTitle(item: Record<string, unknown>) {
  return String(
    item.name ?? item.fullName ?? item.jobTitle ?? item.degree ?? item.title ?? item.signatureText ?? "Untitled",
  );
}

function itemMeta(item: Record<string, unknown>) {
  return String(item.company ?? item.issuer ?? item.school ?? item.subtitle ?? item.group ?? item.headline ?? "");
}

function SectionOrderField({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: string[]) => void;
}) {
  const ordered = useMemo(() => {
    const items = (Array.isArray(value) ? value.map(String) : String(value ?? "").split("\n"))
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length ? items : SECTION_KEYS;
  }, [value]);

  return (
    <div className="mt-2">
      <SortableList
        items={ordered}
        getId={(item) => item}
        onReorder={onChange}
        renderItem={(item, handle) => (
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/60 px-2 py-2">
            {handle}
            <span className="text-sm capitalize text-zinc-200">{item}</span>
          </div>
        )}
      />
    </div>
  );
}

function NavIcon({ name }: { name: string }) {
  const className = "h-4 w-4";
  if (name === "profiles") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 9a8 8 0 1 0-16 0" />
      </svg>
    );
  }
  if (name === "highlights") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 14.5 9.5 21 12 14.5 14.5 12 21 9.5 14.5 3 12 9.5 9.5 12 3Z" />
      </svg>
    );
  }
  if (name === "security") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 20 7v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

export default function DashboardPage() {
  const [resource, setResource] = useState("profiles");
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const loadId = useRef(0);
  const schema = resource === "security" ? null : RESOURCE_SCHEMA[resource];
  const visibleFields = schema?.fields.filter((field) => !field.hidden) ?? [];

  async function load(next = resource) {
    const id = ++loadId.current;
    setBusy(true);
    setError("");
    try {
      const data = await gql<{ adminList: Record<string, unknown>[] }>(ADMIN_LIST, { resource: next });
      if (id !== loadId.current) return;
      setItems(Array.isArray(data.adminList) ? data.adminList : []);
    } catch (err) {
      if (id !== loadId.current) return;
      setError(err instanceof Error ? err.message : "Load failed");
      if (String(err).toLowerCase().includes("unauthor") || String(err).toLowerCase().includes("forbidden")) {
        window.location.href = "/login";
      }
    } finally {
      if (id === loadId.current) setBusy(false);
    }
  }

  useEffect(() => {
    if (resource === "security") return;
    setItems([]);
    void load(resource);
    setEditingId(null);
    setForm(emptyFrom(RESOURCE_SCHEMA[resource].fields));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  useEffect(() => {
    if (!schema?.singleton || !items[0]) return;
    setEditingId(String(items[0].id ?? "singleton"));
    const next: Record<string, unknown> = {};
    for (const field of schema.fields) next[field.key] = items[0][field.key];
    setForm(next);
  }, [schema, items]);

  const title = useMemo(() => (resource === "security" ? "Security" : schema?.label ?? ""), [resource, schema]);
  const orderedItems = useMemo(
    () => [...items].sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0)),
    [items],
  );

  async function persistOrder(next: Record<string, unknown>[]) {
    const previous = new Map(orderedItems.map((item) => [String(item.id), Number(item.sortOrder ?? 0)]));
    const ranked = next.map((item, index) => ({ ...item, sortOrder: index }));
    setItems(ranked);
    setSavingOrder(true);
    try {
      for (const [index, item] of ranked.entries()) {
        if (previous.get(String(item.id)) === index) continue;
        await gql(ADMIN_UPDATE, {
          resource,
          id: String(item.id),
          input: { sortOrder: index },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reorder failed");
      await load();
    } finally {
      setSavingOrder(false);
    }
  }

  function startEdit(item: Record<string, unknown>) {
    if (!schema) return;
    setEditingId(String(item.id ?? "singleton"));
    const next: Record<string, unknown> = {};
    for (const field of schema.fields) next[field.key] = item[field.key];
    setForm(next);
  }

  async function save() {
    if (!schema) return;
    setBusy(true);
    try {
      const input: Record<string, unknown> = {};
      for (const field of schema.fields) {
        input[field.key] = fromFormValue(field, form[field.key]);
      }
      if (!editingId && !schema.singleton) {
        input.sortOrder = orderedItems.length;
      }
      if (editingId && !schema.singleton) {
        await gql(ADMIN_UPDATE, { resource, id: editingId, input });
      } else if (schema.singleton) {
        const id = String(items[0]?.id ?? "singleton");
        await gql(ADMIN_UPDATE, { resource, id, input });
      } else {
        await gql(ADMIN_CREATE, { resource, input });
      }
      setEditingId(null);
      setForm(emptyFrom(schema.fields));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await gql(ADMIN_DELETE, { resource, id });
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyFrom(schema?.fields ?? []));
    }
    await load();
  }

  function renderField(field: Field) {
    if (field.key === "sectionOrder") {
      return (
        <SectionOrderField
          value={form[field.key]}
          onChange={(next) => setForm((current) => ({ ...current, [field.key]: next }))}
        />
      );
    }
    if (field.type === "textarea" || field.type === "list") {
      return (
        <textarea
          className="mt-1.5 w-full min-h-24 rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none ring-cyan-400/30 focus:border-cyan-500/40 focus:ring-2"
          value={String(toFormValue(field, form[field.key]))}
          onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
        />
      );
    }
    if (field.type === "boolean") {
      return (
        <input
          type="checkbox"
          className="mt-2 h-4 w-4 accent-cyan-400"
          checked={Boolean(form[field.key])}
          onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.checked }))}
        />
      );
    }
    if (field.type === "file") {
      return (
        <FileField
          value={String(form[field.key] ?? "")}
          accept={field.accept}
          onChange={(url) => setForm((current) => ({ ...current, [field.key]: url }))}
        />
      );
    }
    return (
      <input
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none ring-cyan-400/30 focus:border-cyan-500/40 focus:ring-2"
        type="text"
        value={String(form[field.key] ?? "")}
        onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
      />
    );
  }

  function listCard(item: Record<string, unknown>, handle: ReactNode) {
    const thumb = itemThumb(item);
    const selected = editingId === String(item.id ?? "singleton");
    return (
      <div
        className={`flex min-w-0 items-center gap-3 rounded-2xl border px-2 py-2.5 ${
          selected ? "border-cyan-500/40 bg-cyan-950/30" : "border-white/10 bg-zinc-950/50"
        }`}
      >
        {schema?.singleton ? null : handle}
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm font-semibold text-cyan-300">
            {itemTitle(item).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{itemTitle(item)}</p>
          {itemMeta(item) ? <p className="truncate text-xs text-zinc-500">{itemMeta(item)}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 pr-2">
          <button
            type="button"
            onClick={() => startEdit(item)}
            className="rounded-lg px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
          >
            Edit
          </button>
          {schema?.singleton ? null : (
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/50"
              onClick={() => void remove(String(item.id))}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950/70 px-4 py-6 backdrop-blur-xl xl:flex">
        <div className="px-2">
          <p className="font-serif text-3xl italic text-cyan-400">AS</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-zinc-500">Dashboard</p>
        </div>
        <nav className="mt-8 flex-1 space-y-6 overflow-auto">
          {NAV.map((group) => (
            <div key={group.group}>
              <p className="px-3 text-[11px] uppercase tracking-[0.2em] text-zinc-600">{group.group}</p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setResource(item)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                      resource === item ? "bg-cyan-500/15 text-cyan-200" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <NavIcon name={item} />
                    {RESOURCE_SCHEMA[item].label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setResource("security")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${
              resource === "security" ? "bg-cyan-500/15 text-cyan-200" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <NavIcon name="security" />
            Security
          </button>
        </nav>
        <button
          type="button"
          className="mt-4 rounded-xl px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/5 hover:text-white"
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/login";
          }}
        >
          Sign out
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#07090f]/80 px-4 py-4 backdrop-blur-xl lg:px-8">
          <div>
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            <p className="text-xs text-zinc-500">
              {schema?.singleton ? "One record for the public site" : "Drag the handle to change order"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`${webOrigin()}/cv`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-cyan-300 hover:bg-white/5"
            >
              Open CV
            </a>
            <a
              href={webOrigin()}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-xs font-semibold text-black"
            >
              View site
            </a>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3 xl:hidden">
          {[...NAV.flatMap((group) => group.items), "security"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setResource(item)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                resource === item ? "bg-cyan-500/20 text-cyan-200" : "bg-white/5 text-zinc-400"
              }`}
            >
              {item === "security" ? "Security" : RESOURCE_SCHEMA[item].label}
            </button>
          ))}
        </div>

        <section className="space-y-6 p-4 lg:p-8">
          {error ? <p className="rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300">{error}</p> : null}
          {resource === "security" ? <SecurityPanel /> : null}
          {resource !== "security" && schema ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <div>
                {schema.singleton ? null : (
                  <p className="mb-3 text-xs text-zinc-500">
                    {savingOrder ? "Saving order..." : "Grab the six dots and drop where you want it."}
                  </p>
                )}
                {schema.singleton ? (
                  <div className="space-y-2">{orderedItems.map((item) => <div key={String(item.id)}>{listCard(item, null)}</div>)}</div>
                ) : (
                  <SortableList
                    items={orderedItems}
                    getId={(item) => String(item.id)}
                    onReorder={(next) => void persistOrder(next)}
                    disabled={savingOrder}
                    renderItem={listCard}
                  />
                )}
                {busy ? <p className="mt-4 text-sm text-zinc-500">Loading...</p> : null}
                {!busy && !orderedItems.length ? (
                  <p className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-zinc-500">
                    Nothing here yet. Create the first item.
                  </p>
                ) : null}
              </div>

              <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-5 shadow-[0_0_60px_rgba(8,145,178,0.08)]">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white">
                    {editingId && !schema.singleton ? "Edit" : schema.singleton ? "Edit" : "New"} {title.toLowerCase()}
                  </h2>
                  {schema.singleton ? null : (
                    <button
                      type="button"
                      className="text-xs text-zinc-500 hover:text-white"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyFrom(schema.fields));
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="mt-5 space-y-4">
                  {visibleFields.map((field) => (
                    <label key={field.key} className="block text-sm">
                      <span className="text-zinc-400">{field.label}</span>
                      {renderField(field)}
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => void save()}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-2.5 font-semibold text-black"
                >
                  Save
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
