// features/auth/components/LoginForm.tsx

import type { BaseSyntheticEvent } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, X, Mail, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@components/ui/Button";
import logo from "@/assets/logos/logo.png";

interface FormFields {
  email: string;
  password: string;
}

interface Props {
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
  apiError: string | null;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  onClearError: () => void;
}

const inputBase =
  "h-12 w-full rounded-xl border bg-white py-3 pl-11 text-[0.94rem] text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:shadow-[0_0_0_3px_rgba(15,23,42,0.08)]";
const inputOk = "border-slate-200 hover:border-slate-300 focus:border-slate-900";
const inputError = "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]";

export function LoginForm({
  register,
  errors,
  apiError,
  showPassword,
  setShowPassword,
  isSubmitting,
  onSubmit,
  onClearError,
}: Props) {
  return (
    <div>
      <div className="flex flex-col gap-8">

        {/* Encabezado. En escritorio la marca ya está en la foto: el logo solo aparece en móvil */}
        <div className="flex flex-col gap-6">
          <img src={logo} alt="De los Reyes" className="h-11 w-fit object-contain lg:hidden" />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenido de nuevo</h2>
            <p className="text-sm text-slate-500">Inicia sesión en tu cuenta de De los Reyes ERP.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 pt-2">

          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <div className="group relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-900" />
              <input
                id="login-email"
                type="email"
                placeholder="tu@correo.com"
                autoComplete="email"
                autoFocus
                {...register("email")}
                className={`${inputBase} pr-4 ${errors.email ? inputError : inputOk}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="group relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-900" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className={`${inputBase} pr-12 ${errors.password ? inputError : inputOk}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
            )}
          </div>

          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-500" />
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
              <button
                type="button"
                onClick={onClearError}
                className="rounded-lg p-1 text-red-400 transition-colors hover:bg-red-100"
                aria-label="Cerrar alerta"
              >
                <X size={13} />
              </button>
            </motion.div>
          )}

          <Button
            type="submit"
            loading={isSubmitting}
            size="lg"
            className="h-12 w-full text-sm font-semibold"
            style={{
              background: "#0f172a",
              boxShadow: "none",
              border: "1px solid transparent",
              borderRadius: 12,
              width: "100%",
            }}
          >
            Ingresar
          </Button>
        </form>

        <p className="border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
          ¿Problemas para ingresar? Contacta al administrador.
        </p>
      </div>
    </div>
  );
}
