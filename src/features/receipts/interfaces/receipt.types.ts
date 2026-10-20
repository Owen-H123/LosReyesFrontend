// features/receipts/interfaces/receipt.types.ts

/**
 * Parámetros para generar/descargar/abrir/imprimir la boleta de una venta.
 * saleNumber es opcional y solo se usa para nombrar el archivo descargado
 * (ej: boleta-VTA-20260727-00001.pdf). Si no se provee, se usa el saleId.
 */
export interface GenerateReceiptParams {
  saleId: number
  saleNumber?: string
}