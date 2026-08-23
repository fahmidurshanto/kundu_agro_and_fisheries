import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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
  const users = await readUsers();
  return users.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await readUsers();
  return users.find((user) => user.id === id) ?? null;
}

export async function addUser(
  input: Omit<User, "id" | "createdAt">
): Promise<User> {
  const users = await readUsers();
  const user: User = {
    ...input,
    id: `usr_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  return user;
}

export async function deleteUserById(id: string): Promise<User | null> {
  const users = await readUsers();
  const existing = users.find((user) => user.id === id);
  if (!existing) return null;

  await writeUsers(users.filter((user) => user.id !== id));
  return existing;
}
