"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

import axios from "axios";
import { toast } from "sonner";

import {
  useForm,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  RegisterInput,
} from "@/lib/validations";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    try {
      await axios.post("/api/auth/register", data);

      toast.success(
        "Account created successfully!"
      );

      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Registration failed."
        );
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  function onInvalid(
    errors: FieldErrors<RegisterInput>
  ) {
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message);
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
        Create Account
      </h1>

      <p className="mt-3 text-center leading-7 text-slate-400">
        Join{" "}
        <span className="font-semibold text-white">
          FollowUp AI
        </span>{" "}
        and build your AI-powered knowledge base.
      </p>

      <form
        onSubmit={handleSubmit(
          onSubmit,
          onInvalid
        )}
        className="mt-10 space-y-6"
      >
        {/* Name */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <User size={16} />
            Full Name
          </label>

          <input
            type="text"
            autoComplete="name"
            {...register("name")}
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {errors.name && (
            <p className="mt-2 text-sm text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Mail size={16} />
            Email Address
          </label>

          <input
            type="email"
            autoComplete="email"
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
            autoComplete="new-password"
            minLength={6}
            {...register("password")}
            placeholder="Minimum 6 characters"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {errors.password && (
            <p className="mt-2 text-sm text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            "Creating Account..."
          ) : (
            <>
              Create Account
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?
          </p>

          <Link
            href="/login"
            className="mt-2 inline-block font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Sign In →
          </Link>
        </div>
      </form>
    </div>
  );
}