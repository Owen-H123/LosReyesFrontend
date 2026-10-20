// lib/igv.ts
// Cálculos del IGV (18 %). Son los mismos que IgvCalculator del backend.
//
// Los precios de venta se guardan CON IGV incluido. El IGV de una venta no se
// suma al final: se desglosa del total.
//   Precio sin IGV S/ 20.00 → withIgv → S/ 23.60
//   Total S/ 23.60 → includedIgv → S/ 3.60
//
// En pantalla son solo una vista previa: el total oficial lo calcula el backend.

export const IGV_RATE = 0.18

// Redondeo a céntimos. Number.EPSILON evita errores de coma flotante
// como 1.005 * 100 = 100.49999...
const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

/** Precio sin IGV → precio con IGV. */
export function withIgv(priceWithoutIgv: number): number {
  return round2(priceWithoutIgv * (1 + IGV_RATE))
}

/** Precio con IGV → precio sin IGV. */
export function withoutIgv(priceWithIgv: number): number {
  return round2(priceWithIgv / (1 + IGV_RATE))
}

/** Parte del monto (que ya incluye IGV) que corresponde al IGV. */
export function includedIgv(amountWithIgv: number): number {
  return round2(round2(amountWithIgv) - withoutIgv(amountWithIgv))
}
