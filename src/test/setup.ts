// src/test/setup.ts
// Se ejecuta antes de cada archivo de test.
import '@testing-library/jest-dom/vitest'   // agrega toBeInTheDocument(), toHaveTextContent(), etc.
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Desmonta lo que renderizó cada test para que no se mezcle con el siguiente
afterEach(() => cleanup())

// Node 25 trae un localStorage propio (experimental) que reemplaza al de jsdom
// y no implementa setItem. Si pasa eso, se usa uno en memoria para los tests.
if (typeof globalThis.localStorage?.setItem !== 'function') {
  const data = new Map<string, string>()
  const memoryStorage: Storage = {
    get length() { return data.size },
    clear: () => data.clear(),
    getItem: key => data.get(key) ?? null,
    key: index => [...data.keys()][index] ?? null,
    removeItem: key => { data.delete(key) },
    setItem: (key, value) => { data.set(key, String(value)) },
  }
  Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true })
}
