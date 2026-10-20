import { describe, expect, it } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { DocumentType } from '@interfaces/api.types'
import { CellphoneField, DocumentFields } from '@features/customers/components/CustomerDocumentFields'

// Formulario mínimo con los dos campos, como los usan Clientes y Nueva Venta
function Form({ initialType = 'DNI' as DocumentType }) {
  const [doc, setDoc] = useState({ documentType: initialType, documentNumber: '' })
  const [phone, setPhone] = useState('')
  return (
    <>
      <DocumentFields {...doc} onChange={setDoc} labelClassName="" inputClassName="" />
      <CellphoneField value={phone} onChange={setPhone} labelClassName="" inputClassName="" />
    </>
  )
}

const numberInput = () => screen.getAllByRole('textbox')[0] as HTMLInputElement
const phoneInput = () => screen.getAllByRole('textbox')[1] as HTMLInputElement

describe('Campos de documento y celular del cliente', () => {
  it('solo ofrece DNI y RUC, y el título no tiene asterisco', () => {
    render(<Form />)

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['DNI', 'RUC'])
    expect(screen.getByText('N° Documento')).toBeInTheDocument()
  })

  it('el DNI no acepta letras ni más de 8 dígitos', async () => {
    render(<Form />)

    await userEvent.type(numberInput(), '4567ab89123')

    expect(numberInput().value).toBe('45678912')
  })

  it('el RUC acepta 11 dígitos y marca en rojo si no empieza con 10 o 20', async () => {
    render(<Form />)
    await userEvent.selectOptions(screen.getByRole('combobox'), 'RUC')

    await userEvent.type(numberInput(), '151234567890')
    expect(numberInput().value).toBe('15123456789')
    expect(screen.getByText('El RUC debe empezar con 10 o 20')).toBeInTheDocument()

    await userEvent.clear(numberInput())
    await userEvent.type(numberInput(), '20123456789')
    expect(screen.queryByText('El RUC debe empezar con 10 o 20')).not.toBeInTheDocument()
  })

  it('al cambiar de tipo se borra el número', async () => {
    render(<Form />)
    await userEvent.type(numberInput(), '45678912')

    await userEvent.selectOptions(screen.getByRole('combobox'), 'RUC')

    expect(numberInput().value).toBe('')
  })

  it('el celular solo acepta 9 números y marca en rojo si no empieza con 9', async () => {
    render(<Form />)

    await userEvent.type(phoneInput(), '8a76543210')
    expect(phoneInput().value).toBe('876543210')
    expect(screen.getByText('El celular debe empezar con 9')).toBeInTheDocument()
    expect(screen.getByText('Celular')).toBeInTheDocument()
  })

  it('el navegador no deja guardar un DNI incompleto', async () => {
    render(<Form />)
    await userEvent.type(numberInput(), '4567')

    expect(numberInput().checkValidity()).toBe(false)
    await userEvent.type(numberInput(), '8912')
    expect(numberInput().checkValidity()).toBe(true)
  })

  it('al editar un cliente antiguo con CE, su tipo sigue disponible', () => {
    render(<Form initialType="CE" />)

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['DNI', 'RUC', 'CE'])
  })
})
