import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { adminFetch } from "./api/admin-client";

export type UserRole = "Admin" | "Manager" | "Staff" | "Customer";
export type UserStatus = "Active" | "Inactive";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  createdAt: string;
};

export const USER_ROLES: UserRole[] = ["Admin", "Manager", "Staff", "Customer"];
export const USER_STATUSES: UserStatus[] = ["Active", "Inactive"];

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "users.json");

function formatBackendUser(u: any): User {
  return {
    id: u._id || u.id,
    name: u.name || "",
    email: u.email || "",
    role: (u.role || "Customer") as UserRole,
    status: (u.status || "Active") as UserStatus,
    phone: u.phone || "",
    createdAt: u.createdAt || new Date().toISOString(),
  };
}

async function readUsers(): Promise<User[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as User[]) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function getUsers(): Promise<User[]> {
  try {
    const res = await adminFetch<any[]>("/admin/users");
    const list = res.data || res.users || (Array.isArray(res) ? res : null);
    if (list && Array.isArray(list)) {
      return list.map(formatBackendUser);
    }
  } catch (err) {
    console.warn("Backend users fetch failed, using local fallback:", err);
  }

  const users = await readUsers();
  return users.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const res = await adminFetch<any>(`/admin/users/${id}`);
    const item = res.data || res.user || res;
    if (item && (item._id || item.id)) {
      return formatBackendUser(item);
    }
  } catch (err) {
    console.warn(`Backend user fetch for ${id} failed, using local fallback:`, err);
  }

  const users = await readUsers();
  return users.find((user) => user.id === id) ?? null;
}

export async function addUser(
  input: Omit<User, "id" | "createdAt"> & { password?: string }
): Promise<User> {
  try {
    const res = await adminFetch<any>("/admin/users", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        password: input.password || "Password123!",
      }),
    });
    const created = res.data || res.user;
    if (created) return formatBackendUser(created);
  } catch (err) {
    console.warn("Backend addUser failed, saving locally:", err);
  }

  const users = await readUsers();
  const user: User = {
    name: input.name,
    email: input.email,
    role: input.role,
    status: input.status,
    phone: input.phone,
    id: `usr_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  return user;
}

export async function updateUserById(
  id: string,
  input: Partial<Omit<User, "id" | "createdAt">>
): Promise<User | null> {
  try {
    const res = await adminFetch<any>(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    const updated = res.data || res.user;
    if (updated) return formatBackendUser(updated);
  } catch (err) {
    console.warn(`Backend updateUserById for ${id} failed:`, err);
  }

  const users = await readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...input };
  await writeUsers(users);
  return users[index];
}

export async function deleteUserById(id: string): Promise<User | null> {
  try {
    const res = await adminFetch<any>(`/admin/users/${id}`, {
      method: "DELETE",
    });
    if (res.success) return { id } as User;
  } catch (err) {
    console.warn(`Backend deleteUserById for ${id} failed, deleting locally:`, err);
  }

  const users = await readUsers();
  const existing = users.find((user) => user.id === id);
  if (!existing) return null;

  await writeUsers(users.filter((user) => user.id !== id));
  return existing;
}

export async function changeUserPasswordByAdmin(id: string, newPassword: string): Promise<boolean> {
  try {
    const res = await adminFetch<any>(`/admin/users/${id}/change-password`, {
      method: "POST",
      body: JSON.stringify({ password: newPassword }),
    });
    return res.success;
  } catch (err) {
    console.warn(`Backend changeUserPasswordByAdmin for ${id} failed:`, err);
    return false;
  }
}

