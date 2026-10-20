// features/receipts/hooks/useReceipts.ts
import { useMutation } from '@tanstack/react-query'
import { receiptsApi } from '@features/receipts/services/receipts.api'
import type { GenerateReceiptParams } from '@features/receipts/interfaces/receipt.types'
import { toast } from 'sonner'

type ApiError = { response?: { data?: { message?: string } } }

/**
 * Descarga la boleta en PDF de una venta.
 */
export function useDownloadReceipt() {
  return useMutation({
    mutationFn: ({ saleId, saleNumber }: GenerateReceiptParams) =>
      receiptsApi.downloadPdf(saleId, saleNumber),
    onSuccess: () => toast.success('Boleta descargada correctamente'),
    onError: (e: ApiError) =>
      toast.error(e?.response?.data?.message ?? 'Error al generar la boleta'),
  })
}

/**
 * Abre la boleta en PDF de una venta en una nueva pestaña.
 */
export function useOpenReceipt() {
  return useMutation({
    mutationFn: ({ saleId }: GenerateReceiptParams) => receiptsApi.openPdf(saleId),
    onError: (e: ApiError) =>
      toast.error(e?.response?.data?.message ?? 'Error al abrir la boleta'),
  })
}

/**
 * Envía la boleta en PDF de una venta directamente a impresión.
 */
export function usePrintReceipt() {
  return useMutation({
    mutationFn: ({ saleId }: GenerateReceiptParams) => receiptsApi.printPdf(saleId),
    onError: (e: ApiError) =>
      toast.error(e?.response?.data?.message ?? 'Error al imprimir la boleta'),
  })
}

/**
 * Envía la boleta por correo electrónico al cliente de la venta.
 */
export function useSendReceiptEmail() {
  return useMutation({
    mutationFn: ({ saleId }: GenerateReceiptParams) => receiptsApi.sendEmail(saleId),
    onSuccess: (message) => toast.success(message ?? 'Boleta enviada por correo'),
    onError: (e: ApiError) =>
      toast.error(e?.response?.data?.message ?? 'Error al enviar la boleta por correo'),
  })
}