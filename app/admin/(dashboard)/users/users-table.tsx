"use client";

import { useState } from "react";
import { Modal } from "@/app/components/modal";
import type { User, UserRole, UserStatus } from "@/lib/users";

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case "Admin":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Manager":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Staff":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Customer":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getStatusBadgeColor(status: UserStatus): string {
  return status === "Active"
    ? "bg-green-50 text-emerald-700 border-green-200"
    : "bg-gray-100 text-gray-600 border-gray-200";
}

// ─── Reusable User Detail Modal ──────────────────────────────────────────────
function UserDetailModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={true} onClose={onClose} title="User Details" maxWidth="md">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
          {getInitials(user.name)}
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-gray-100" />

      {/* Details grid */}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Role
          </dt>
          <dd>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                user.role
              )}`}
            >
              {user.role}
            </span>
          </dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </dt>
          <dd>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                user.status
              )}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  user.status === "Active" ? "bg-emerald-500" : "bg-gray-400"
                }`}
              />
              {user.status}
            </span>
          </dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Phone
          </dt>
          <dd className="text-sm text-foreground">{user.phone || "—"}</dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Joined Date
          </dt>
          <dd className="text-sm text-foreground">
            {formatDate(user.createdAt)}
          </dd>
        </div>

        <div className="col-span-full flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            User ID
          </dt>
          <dd className="truncate rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-muted-foreground">
            {user.id}
          </dd>
        </div>
      </dl>
    </Modal>
  );
}

// ─── Interactive Users Table ──────────────────────────────────────────────────
export function UsersTable({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">No users found.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          There are currently no registered users in your database.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-6 py-4">
                  User
                </th>
                <th scope="col" className="px-6 py-4">
                  Role
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Phone
                </th>
                <th scope="col" className="px-6 py-4">
                  Joined Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="cursor-pointer transition-colors hover:bg-primary/5"
                  title={`View details for ${user.name}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                        user.status
                      )}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-gray-400"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.phone || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
