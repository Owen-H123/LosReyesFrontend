// features/receipts/services/receipts.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse } from '@interfaces/api.types'

export const receiptsApi = {
  /**
   * Obtiene el PDF de la boleta como Blob.
   * Base para descargar, abrir en nueva pestaña o imprimir.
   */
  getPdfBlob: async (saleId: number): Promise<Blob> => {
    const response = await apiClient.get(API.receipts.pdf(saleId), {
      responseType: 'blob',
    })
    return new Blob([response.data], { type: 'application/pdf' })
  },

  /**
   * Descarga la boleta como archivo PDF en el navegador.
   */
  downloadPdf: async (saleId: number, saleNumber?: string) => {
    const blob = await receiptsApi.getPdfBlob(saleId)
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href  = url
    link.download = `boleta-${saleNumber ?? saleId}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  },

  /**
   * Abre la boleta en una nueva pestaña del navegador.
   */
  openPdf: async (saleId: number) => {
    const blob = await receiptsApi.getPdfBlob(saleId)
    const url  = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  },

  /**
   * Envía la boleta directamente al diálogo de impresión del navegador.
   */
  printPdf: async (saleId: number) => {
    const blob = await receiptsApi.getPdfBlob(saleId)
    const url  = URL.createObjectURL(blob)

    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    document.body.appendChild(iframe)

    iframe.onload = () => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }

    setTimeout(() => {
      document.body.removeChild(iframe)
      URL.revokeObjectURL(url)
    }, 60_000)
  },

  /**
   * Envía la boleta por correo electrónico al cliente de la venta.
   * El backend valida que el cliente tenga email registrado.
   */
  sendEmail: async (saleId: number): Promise<string> => {
    const { data } = await apiClient.post<ApiResponse<void>>(API.receipts.email(saleId))
    return data.message
  },
}