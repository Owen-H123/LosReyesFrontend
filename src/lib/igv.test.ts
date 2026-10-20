// Mismos casos que IgvCalculatorTest del backend: los dos deben calcular igual.
import { describe, expect, it } from 'vitest'
import { includedIgv, withIgv, withoutIgv } from '@lib/igv'

describe('igv', () => {
  it('agrega el IGV al precio sin IGV', () => {
    expect(withIgv(20)).toBe(23.6)
    expect(withIgv(80)).toBe(94.4)
  })

  it('quita el IGV del precio con IGV', () => {
    expect(withoutIgv(23.6)).toBe(20)
    expect(withoutIgv(94.4)).toBe(80)
  })

  it('desglosa el IGV incluido en un total', () => {
    expect(includedIgv(23.6)).toBe(3.6)
    expect(includedIgv(37.2)).toBe(5.67)   // ejemplo acordado: 47.20 - 10.00 de descuento
    expect(includedIgv(100)).toBe(15.25)
    expect(includedIgv(0)).toBe(0)
  })

  it.each([11.79, 10, 0.01, 999.99, 37.2])('base + IGV da exactamente el total (%s)', total => {
    const sum = Math.round((withoutIgv(total) + includedIgv(total)) * 100) / 100
    expect(sum).toBe(total)
  })
})
