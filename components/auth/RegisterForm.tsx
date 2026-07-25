"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axios from "axios";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, RegisterInput } from "@/lib/validations";

export default function RegisterForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    try {
      setServerError("");

      await axios.post("/api/auth/register", data);

      router.push("/login");
    } catch (error: unknown) {
      setServerError(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Something went wrong."
      );
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

      <h1 className="mb-2 text-3xl font-bold text-white">
        Create Account
      </h1>

      <p className="mb-8 text-slate-400">
        Start using FollowUp AI today.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Full Name
          </label>

          <input
            {...register("name")}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

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
          disabled={isSubmitting}
          className="w-full rounded-lg bg-white py-3 font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-white hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}