"use client";

import { useEffect, useMemo, useState } from "react";
import { FileField } from "@/components/FileField";
import { SecurityPanel } from "@/components/SecurityPanel";
import { ADMIN_CREATE, ADMIN_DELETE, ADMIN_LIST, ADMIN_UPDATE, gql } from "@/lib/gql";
import { RESOURCE_SCHEMA, type Field } from "@/lib/schema";

const RESOURCES = Object.keys(RESOURCE_SCHEMA);

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

const SECTION_KEYS = ["skills", "experience", "projects", "education", "featured", "certificates", "earlier"];

function SectionOrderField({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: string[]) => void;
}) {
  const items = (Array.isArray(value) ? value.map(String) : String(value ?? "").split("\n"))
    .map((item) => item.trim())
    .filter(Boolean);
  const ordered = items.length ? items : SECTION_KEYS;

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= ordered.length) return;
    const copy = [...ordered];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    onChange(copy);
  }

  return (
    <ol className="mt-2 space-y-2">
      {ordered.map((key, index) => (
        <li key={key} className="flex items-center justify-between rounded-md border border-gray-800 px-3 py-2">
          <span>
            {index + 1}. {key}
          </span>
          <span className="space-x-3">
            <button type="button" disabled={index === 0} onClick={() => move(index, -1)}>
              Up
            </button>
            <button type="button" disabled={index === ordered.length - 1} onClick={() => move(index, 1)}>
              Down
            </button>
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function DashboardPage() {
  const [resource, setResource] = useState("profiles");
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const schema = resource === "security" ? null : RESOURCE_SCHEMA[resource];

  async function load(next = resource) {
    setBusy(true);
    setError("");
    try {
      const data = await gql<{ adminList: Record<string, unknown>[] }>(ADMIN_LIST, { resource: next });
      setItems(Array.isArray(data.adminList) ? data.adminList : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
      if (String(err).toLowerCase().includes("unauthor") || String(err).toLowerCase().includes("forbidden")) {
        window.location.href = "/login";
      }
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (resource === "security") return;
    setItems([]);
    void load(resource);
    setEditingId(null);
    setForm(emptyFrom(RESOURCE_SCHEMA[resource].fields));
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

  async function move(index: number, direction: -1 | 1) {
    if (!schema || schema.singleton) return;
    const next = index + direction;
    if (next < 0 || next >= orderedItems.length) return;
    const current = orderedItems[index];
    const other = orderedItems[next];
    await gql(ADMIN_UPDATE, {
      resource,
      id: String(current.id),
      input: { sortOrder: Number(other.sortOrder ?? next) },
    });
    await gql(ADMIN_UPDATE, {
      resource,
      id: String(other.id),
      input: { sortOrder: Number(current.sortOrder ?? index) },
    });
    await load();
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
    await load();
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xl italic font-serif text-cyan-400">AS</p>
          <p className="text-sm text-gray-500">Dynamic content for the public site</p>
        </div>
        <div className="flex items-center gap-4">
          <a href={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://aa-web-abdulrahmanashraf98s-projects.vercel.app"}/cv`} target="_blank" rel="noreferrer" className="text-sm text-cyan-400">
            Generate CV
          </a>
          <button
            className="text-sm text-gray-400"
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="grid lg:grid-cols-[220px_1fr] gap-6 p-6">
        <aside className="space-y-2">
          {RESOURCES.map((item) => (
            <button
              key={item}
              onClick={() => setResource(item)}
              className={`block w-full text-left px-4 py-2 rounded-md ${
                resource === item ? "bg-cyan-800 text-white" : "bg-gray-900"
              }`}
            >
              {RESOURCE_SCHEMA[item].label}
            </button>
          ))}
          <button
            onClick={() => setResource("security")}
            className={`block w-full text-left px-4 py-2 rounded-md ${
              resource === "security" ? "bg-cyan-800 text-white" : "bg-gray-900"
            }`}
          >
            Security
          </button>
        </aside>
        <section className="space-y-6">
          {resource === "security" ? <SecurityPanel /> : null}
          {resource !== "security" && schema ? (
            <>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {error ? <p className="text-red-400">{error}</p> : null}
          <div className="overflow-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="text-left p-3">Item</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {orderedItems.map((item, index) => (
                  <tr key={String(item.id ?? item.fullName ?? item.signatureText)} className="border-t border-gray-800">
                    <td className="p-3">
                      {String(
                        item.name ??
                          item.fullName ??
                          item.jobTitle ??
                          item.degree ??
                          item.title ??
                          item.signatureText ??
                          "",
                      )}
                    </td>
                    <td className="p-3 text-right space-x-3">
                      {schema.singleton ? null : (
                        <>
                          <button disabled={index === 0} onClick={() => void move(index, -1)}>
                            Up
                          </button>
                          <button disabled={index === orderedItems.length - 1} onClick={() => void move(index, 1)}>
                            Down
                          </button>
                        </>
                      )}
                      <button onClick={() => startEdit(item)}>Edit</button>
                      {schema.singleton ? null : (
                        <button className="text-red-400" onClick={() => void remove(String(item.id))}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {busy ? <p className="p-4 text-gray-500">Loading...</p> : null}
          </div>
          <div className="rounded-xl border border-gray-800 p-5 space-y-4">
            <h2 className="font-semibold">{editingId ? "Edit" : "Create"} {title.toLowerCase()}</h2>
            {schema.fields.map((field) => (
              <label key={field.key} className="block text-sm">
                <span className="text-gray-400">{field.label}</span>
                {field.key === "sectionOrder" ? (
                  <SectionOrderField
                    value={form[field.key]}
                    onChange={(next) => setForm((current) => ({ ...current, [field.key]: next }))}
                  />
                ) : field.type === "textarea" || field.type === "list" ? (
                  <textarea
                    className="mt-1 w-full rounded-md bg-black border border-gray-800 px-3 py-2 min-h-24"
                    value={String(toFormValue(field, form[field.key]))}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  />
                ) : field.type === "boolean" ? (
                  <input
                    type="checkbox"
                    className="mt-2 ml-3"
                    checked={Boolean(form[field.key])}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.checked }))}
                  />
                ) : field.type === "file" ? (
                  <FileField
                    value={String(form[field.key] ?? "")}
                    accept={field.accept}
                    onChange={(url) => setForm((current) => ({ ...current, [field.key]: url }))}
                  />
                ) : (
                  <input
                    className="mt-1 w-full rounded-md bg-black border border-gray-800 px-3 py-2"
                    type={field.type === "number" ? "number" : "text"}
                    value={String(form[field.key] ?? "")}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: field.type === "number" ? Number(event.target.value) : event.target.value,
                      }))
                    }
                  />
                )}
              </label>
            ))}
            <div className="flex gap-3">
              <button onClick={() => void save()} className="px-5 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500">
                Save
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyFrom(schema.fields));
                }}
              >
                Reset
              </button>
            </div>
            </div>
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}
