// features/auth/components/LoginHero.tsx
// Panel izquierdo del login: foto a sangre, marca arriba y mensaje abajo.

import { motion } from "framer-motion";
import { Boxes, Receipt, UserCog, PieChart } from "lucide-react";

import loginBg from "@/assets/images/login-bg.jpg";
import logo from "@/assets/logos/logo.png";

const imageVariants = {
  hidden: { scale: 1.08, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] } },
};

const MODULES = [
  { icon: Boxes,    label: "Inventario" },
  { icon: Receipt,  label: "Ventas" },
  { icon: UserCog,  label: "Usuarios" },
  { icon: PieChart, label: "Reportes" },
];

export function LoginHero() {
  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:flex lg:w-1/2">
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />

      {/* Oscurece arriba (marca) y sobre todo abajo (mensaje), dejando ver la foto al centro */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-slate-950/95" />

      <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
        {/* Marca */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1.5 shadow-lg">
            <img src={logo} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">De los Reyes S.A.C.</p>
            <p className="text-xs text-slate-300">Sistema de gestión ERP</p>
          </div>
        </motion.div>

        {/* Mensaje */}
        <motion.div
          className="max-w-[480px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
            Repuestos originales, bajo control.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Más de 15 años con accesorios y repuestos para{" "}
            <span className="font-semibold text-white">Peugeot</span>,{" "}
            <span className="font-semibold text-white">Citroën</span> y{" "}
            <span className="font-semibold text-white">Renault</span>.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {MODULES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-slate-300">
                <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
