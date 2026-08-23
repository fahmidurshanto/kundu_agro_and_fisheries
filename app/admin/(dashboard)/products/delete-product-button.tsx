"use client";

import { useActionState } from "react";
import { deleteProduct, type DeleteProductState } from "./actions";

const initialState: DeleteProductState = {};

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [state, formAction, pending] = useActionState(
    deleteProduct,
    initialState
  );

  if (state.success) return null;

  return (
    <form
      action={formAction}
      className="flex flex-col items-end gap-1"
      onSubmit={(event) => {
        if (
          !window.confirm(`Delete “${productName}”? This cannot be undone.`)
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {state.error ? (
        <p role="alert" className="max-w-48 text-right text-xs text-red-600">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
