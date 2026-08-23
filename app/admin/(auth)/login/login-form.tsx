"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/kunduAgro.png"
          alt="Kundu Agro and Fisheries logo"
          width={80}
          height={80}
          priority
          className="rounded-xl"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to Kundu Agro and Fisheries
          </p>
        </div>
      </div>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        {state.error ? (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {state.error}
          </p>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
            className="h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-11 w-full rounded-lg border border-gray-200 px-3 pr-16 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 cursor-pointer px-3 text-xs font-medium text-muted-foreground hover:text-primary"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-11 cursor-pointer rounded-lg bg-primary text-sm font-semibold text-white transition-[filter] hover:brightness-95 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
