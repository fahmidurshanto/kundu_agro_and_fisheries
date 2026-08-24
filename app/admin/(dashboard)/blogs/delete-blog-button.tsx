"use client";

import { useActionState } from "react";
import { deleteBlog, type DeleteBlogState } from "./actions";

type DeleteBlogButtonProps = {
  blogId: string;
  blogTitle: string;
};

const initialState: DeleteBlogState = {};

export function DeleteBlogButton({ blogId, blogTitle }: DeleteBlogButtonProps) {
  const [state, formAction, isPending] = useActionState(deleteBlog, initialState);

  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="id" value={blogId} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(e) => {
          if (!confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
            e.preventDefault();
          }
        }}
        className="cursor-pointer text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
      {state.error && (
        <p className="mt-1 text-xs text-red-500">{state.error}</p>
      )}
    </form>
  );
}
