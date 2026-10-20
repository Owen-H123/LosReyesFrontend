import { describe, expect, it } from 'vitest'
import { cellphoneWarning, documentRules, documentWarning, onlyDigits } from '@lib/documentosPeru'

describe('documentosPeru', () => {
  it('deja solo números y corta al largo máximo', () => {
    expect(onlyDigits('12ab34-56', 8)).toBe('123456')
    expect(onlyDigits('123456789012', 11)).toBe('12345678901')
  })

  it('DNI de 8 dígitos y RUC de 11 que empieza con 10 o 20', () => {
    const dni = new RegExp(`^${documentRules('DNI')!.pattern}$`)
    const ruc = new RegExp(`^${documentRules('RUC')!.pattern}$`)

    expect(dni.test('45678912')).toBe(true)
    expect(dni.test('4567891')).toBe(false)
    expect(ruc.test('20123456789')).toBe(true)
    expect(ruc.test('10456789123')).toBe(true)
    expect(ruc.test('15123456789')).toBe(false)
    expect(ruc.test('2012345678')).toBe(false)
  })

  it('avisa si el RUC no empieza con 10 o 20', () => {
    expect(documentWarning('RUC', '2')).toBeNull()      // todavía no se puede saber
    expect(documentWarning('RUC', '20123')).toBeNull()
    expect(documentWarning('RUC', '10')).toBeNull()
    expect(documentWarning('RUC', '15')).toBe('El RUC debe empezar con 10 o 20')
    expect(documentWarning('DNI', '15')).toBeNull()
  })

  it('avisa si el celular no empieza con 9', () => {
    expect(cellphoneWarning('')).toBeNull()             // es opcional
    expect(cellphoneWarning('987654321')).toBeNull()
    expect(cellphoneWarning('8')).toBe('El celular debe empezar con 9')
  })

  it('CE y Pasaporte de clientes antiguos no tienen reglas', () => {
    expect(documentRules('CE')).toBeUndefined()
    expect(documentRules('PASSPORT')).toBeUndefined()
  })
})
