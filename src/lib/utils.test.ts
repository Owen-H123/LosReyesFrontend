import { describe, expect, it } from 'vitest'
import { calcMargin, formatCurrency, getInitials, getStockStatus, truncate } from '@lib/utils'

describe('calcMargin', () => {
  it('calcula el margen con el precio sin IGV', () => {
    // Costo 20.00; precio con IGV 30.68 = 26.00 sin IGV → (26 - 20) / 20 = 30 %
    expect(calcMargin(20, 30.68)).toBeCloseTo(30, 5)
  })

  it('devuelve 0 si el costo es 0 (evita dividir entre cero)', () => {
    expect(calcMargin(0, 50)).toBe(0)
  })
})

describe('formatCurrency', () => {
  it('muestra soles con dos decimales', () => {
    // Intl puede usar un espacio no separable entre "S/" y el número
    expect(formatCurrency(23.6).replace(/\s/g, ' ')).toBe('S/ 23.60')
    expect(formatCurrency(1500).replace(/\s/g, ' ')).toBe('S/ 1,500.00')
  })
})

describe('getStockStatus', () => {
  // Con stock mínimo 5: 0 = sin stock, 1-5 = crítico, 6-10 = bajo, 11+ = normal
  it.each([
    [0, 'empty'],
    [1, 'critical'],
    [5, 'critical'],
    [6, 'low'],
    [10, 'low'],
    [11, 'ok'],
  ])('stock %i con mínimo 5 → %s', (stock, expected) => {
    expect(getStockStatus(stock, 5)).toBe(expected)
  })
})

describe('truncate y getInitials', () => {
  it('recorta textos largos y deja intactos los cortos', () => {
    expect(truncate('Pastilla de freno', 40)).toBe('Pastilla de freno')
    expect(truncate('a'.repeat(50), 10)).toBe('a'.repeat(10) + '…')
  })

  it('saca las iniciales del nombre', () => {
    expect(getInitials('Fabricio Figueroa')).toBe('FF')
  })
})
