import { describe, expect, it } from 'vitest'
import { isChunkLoadError } from '@lib/errors'

describe('isChunkLoadError', () => {
  it.each([
    'Failed to fetch dynamically imported module: /assets/SalesPage-1a2b.js',   // Chrome, Edge
    'Importing a module script failed.',                                       // Safari
    'error loading dynamically imported module: /assets/SalesPage-1a2b.js',    // Firefox
  ])('reconoce el error de carga de pantalla: %s', message => {
    expect(isChunkLoadError(new Error(message))).toBe(true)
  })

  it('no confunde un error común con uno de carga', () => {
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false)
    expect(isChunkLoadError('texto cualquiera')).toBe(false)
  })
})
