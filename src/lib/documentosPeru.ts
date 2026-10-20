// lib/documentosPeru.ts
// Reglas de los documentos y del celular de un cliente en Perú.
import type { DocumentType } from '@interfaces/api.types'

// Tipos de documento que se pueden elegir al registrar un cliente
export const CUSTOMER_DOC_TYPES: DocumentType[] = ['DNI', 'RUC']

interface FieldRules {
  maxLength: number
  pattern: string   // el navegador no deja guardar si el valor no cumple
  title: string     // mensaje que muestra el navegador en ese caso
}

const DOCUMENT_RULES: Partial<Record<DocumentType, FieldRules>> = {
  DNI: { maxLength: 8,  pattern: '\\d{8}',         title: 'El DNI debe tener 8 dígitos' },
  RUC: { maxLength: 11, pattern: '(10|20)\\d{9}',  title: 'El RUC debe tener 11 dígitos y empezar con 10 o 20' },
}

export const CELLPHONE_RULES: FieldRules = {
  maxLength: 9, pattern: '9\\d{8}', title: 'El celular debe tener 9 dígitos y empezar con 9',
}

/**
 * Reglas del número según el tipo de documento. CE y Pasaporte (clientes
 * registrados antes de este cambio) no tienen reglas: pueden llevar letras.
 */
export function documentRules(type: DocumentType): FieldRules | undefined {
  return DOCUMENT_RULES[type]
}

/** Deja solo los dígitos y corta al largo máximo. */
export function onlyDigits(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

/** Aviso en rojo mientras se escribe el número de documento. */
export function documentWarning(type: DocumentType, value: string): string | null {
  if (type === 'RUC' && value.length >= 2 && !/^(10|20)/.test(value)) {
    return 'El RUC debe empezar con 10 o 20'
  }
  return null
}

/** Aviso en rojo mientras se escribe el celular. */
export function cellphoneWarning(value: string): string | null {
  if (value.length > 0 && !value.startsWith('9')) {
    return 'El celular debe empezar con 9'
  }
  return null
}
