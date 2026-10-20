// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useConnectionStore } from '@store/connection.store'
import { withoutIgv } from '@lib/igv'

// ── Class name merger ─────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Currency formatter ────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = 'PEN',
  locale = 'es-PE'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) return `S/ ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `S/ ${(amount / 1_000).toFixed(1)}K`
  return formatCurrency(amount)
}

// ── Date formatters ───────────────────────────────────────────
export function formatDate(dateStr: string, fmt = 'dd/MM/yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt, { locale: es })
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string): string {
  return formatDate(dateStr, 'dd/MM/yyyy HH:mm')
}

export function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: es })
  } catch {
    return dateStr
  }
}

// ── Number formatters ─────────────────────────────────────────
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-PE').format(n)
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`
}

// ── Stock helpers ─────────────────────────────────────────────
export function getStockStatus(stock: number, minimum: number) {
  if (stock === 0) return 'empty' as const
  if (stock <= minimum) return 'critical' as const
  if (stock <= minimum * 2) return 'low' as const
  return 'ok' as const
}

export type StockStatus = ReturnType<typeof getStockStatus>

// ── Margin calculator ─────────────────────────────────────────
// salePrice incluye IGV; el margen se calcula sin IGV porque el IGV no es ganancia
export function calcMargin(costPrice: number, salePrice: number): number {
  if (costPrice <= 0) return 0
  return ((withoutIgv(salePrice) - costPrice) / costPrice) * 100
}

// ── Truncate ──────────────────────────────────────────────────
export function truncate(str: string, length = 40): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}

// ── Initials ──────────────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// ── Image helper ──────────────────────────────────────────────
/**
 * getImageUrl — arma la URL absoluta de una imagen subida (ej. de producto),
 * usando la IP del backend configurada en Configuración → Conexión.
 * El backend devuelve rutas relativas como "/uploads/products/xxxx.jpg".
 */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  const base = useConnectionStore.getState().getApiBaseUrl() // ej: http://192.168.1.50:8080/api/v1
  return `${base}${path}`
}

// ── Status labels ─────────────────────────────────────────────
export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  DISCONTINUED: 'Descontinuado',
}

export const USER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  SUSPENDED: 'Suspendido',
  INACTIVE: 'Inactivo',
}

export const SALE_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  CREDIT: 'Crédito',
}

export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
  SALE: 'Venta',
  ADJUSTMENT: 'Ajuste',
}

// ── Download helper ───────────────────────────────────────────
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}