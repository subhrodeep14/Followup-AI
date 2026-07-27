"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { toast } from "sonner";

import api from "@/services/api";
import {
  loginSchema,
  LoginInput,
} from "@/lib/validations";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    try {
      const response = await api.post(
        "/auth/login",
        data
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      toast.success("Welcome back!");

      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Login failed."
        );
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

      {/* Logo */}

      <div className="mb-8 flex justify-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-600/30">

          <Sparkles
            size={30}
            className="text-white"
          />

        </div>

      </div>

      {/* Heading */}

      <h1 className="text-center text-3xl font-bold text-white">
        Welcome Back
      </h1>

      <p className="mt-3 text-center leading-7 text-slate-400">
        Sign in to continue using
        <span className="font-semibold text-white">
          {" "}
          FollowUp AI
        </span>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 space-y-6"
      >

        {/* Email */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Mail size={16} />
            Email Address
          </label>

          <input
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-400">
              {errors.email.message}
            </p>
          )}

        </div>

        {/* Password */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Lock size={16} />
            Password
          </label>

          <input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {errors.password && (
            <p className="mt-2 text-sm text-red-400">
              {errors.password.message}
            </p>
          )}

        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            "Signing In..."
          ) : (
            <>
              Login
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <div className="border-t border-slate-800 pt-6 text-center">

          <p className="text-sm text-slate-400">
            Don&apos;t have an account? have an account?
          </p>

          <Link
            href="/register"
            className="mt-2 inline-block font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Create an account →
          </Link>

        </div>

      </form>

    </div>
  );
}