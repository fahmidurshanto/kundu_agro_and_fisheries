"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginCustomerAction, registerCustomerAction } from "../auth-actions";

export function CustomerLoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [loginState, loginFormAction, isLoginPending] = useActionState(
    loginCustomerAction,
    {}
  );
  const [regState, regFormAction, isRegPending] = useActionState(
    registerCustomerAction,
    {}
  );

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
        {/* Tab Toggle */}
        <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "login"
                ? "bg-white text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In / লগইন
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "register"
                ? "bg-white text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register / রেজিস্টার
          </button>
        </div>

        {mode === "login" ? (
          /* Login Form */
          <form action={loginFormAction} className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
              <p className="text-xs text-muted-foreground">Sign in to your customer account</p>
            </div>

            {loginState.error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                {loginState.error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="customer@example.com"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoginPending}
              className="mt-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-[filter] hover:brightness-95 disabled:opacity-50"
            >
              {isLoginPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form action={regFormAction} className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
              <p className="text-xs text-muted-foreground">Join Kundu Agro & Fisheries</p>
            </div>

            {regState.error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                {regState.error}
              </div>
            )}
            {regState.success && (
              <div className="rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-700 border border-emerald-100">
                {regState.success}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your Full Name"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="customer@example.com"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="01712345678"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isRegPending}
              className="mt-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-[filter] hover:brightness-95 disabled:opacity-50"
            >
              {isRegPending ? "Registering..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
