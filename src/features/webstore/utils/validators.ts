// features/webstore/utils/validators.ts
// Mismas reglas que valida el backend (WebstoreDtos.SettingsRequest), para avisar antes de guardar.
export const isValidWhatsapp = (v: string | null) => !v || /^[0-9]{9,15}$/.test(v)
export const isValidYapeNumber = (v: string | null) => !v || /^[0-9]{9}$/.test(v)
export const isValidQrUrl = (v: string | null) => !v || /^(https:\/\/|\/uploads\/).+/.test(v)
