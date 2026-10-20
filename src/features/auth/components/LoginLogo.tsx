// features/auth/components/LoginLogo.tsx
// features/auth/components/LoginLogo.tsx

import logo from "@/assets/logos/logo.png";

export function LoginLogo() {
  return (
    <div className="mb-16 text-center">
      <img
        src={logo}
        alt="De los Reyes"
        className="mx-auto h-24 w-auto object-contain"
      />

    </div>
  );
}