import type { Metadata } from "next";
import { getUsers } from "@/lib/users";
import { UsersTable } from "./users-table";
import { UsersHeader } from "./users-header";

export const metadata: Metadata = {
  title: "Users | Kundu Agro and Fisheries",
};

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="flex flex-col gap-8">
      <UsersHeader userCount={users.length} />
      <UsersTable users={users} />
    </div>
  );
}

