"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/services/api";
import { loginSchema, LoginInput } from "@/lib/validations";

export default function LoginForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    try {
      setServerError("");

      const response = await api.post("/auth/login", data);

      localStorage.setItem("token", response.data.token);

      router.push("/dashboard");
    } catch (error: unknown) {
      setServerError(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Login failed."
      );
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
      <h1 className="mb-2 text-3xl font-bold text-white">
        Welcome Back
      </h1>

      <p className="mb-8 text-slate-400">
        Login to continue using FollowUp AI.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Email
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Password
          </label>

          <input
            type="password"
            {...register("password")}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-red-500">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-white py-3 font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-white hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}