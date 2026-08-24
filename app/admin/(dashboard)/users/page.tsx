import type { Metadata } from "next";
import { getUsers } from "@/lib/users";
import { UsersTable } from "./users-table";

export const metadata: Metadata = {
  title: "Users | Kundu Agro and Fisheries",
};

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Users &amp; Team
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {users.length === 0
              ? "No registered users yet."
              : `${users.length} registered ${
                  users.length === 1 ? "user" : "users"
                } in system. Click a row to view details.`}
          </p>
        </div>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
