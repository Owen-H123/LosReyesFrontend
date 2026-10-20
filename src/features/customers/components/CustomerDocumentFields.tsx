// features/customers/components/CustomerDocumentFields.tsx
// Campos de tipo de documento, número y celular de un cliente, con las reglas
// de lib/documentosPeru.ts. Los usan el formulario de Clientes y el de
// "Nuevo cliente" en Nueva Venta; cada uno pasa sus propias clases de estilo.
import type { DocumentType } from '@interfaces/api.types'
import {
  CELLPHONE_RULES, CUSTOMER_DOC_TYPES, cellphoneWarning, documentRules, documentWarning, onlyDigits,
} from '@lib/documentosPeru'

interface Styles {
  labelClassName: string
  inputClassName: string
}

const WARNING_CLASS = 'text-xs text-[var(--danger)] mt-1'
const ERROR_BORDER = ' !border-[var(--danger)]'

export function DocumentFields({ documentType, documentNumber, onChange, labelClassName, inputClassName }: Styles & {
  documentType: DocumentType
  documentNumber: string
  onChange: (value: { documentType: DocumentType; documentNumber: string }) => void
}) {
  const rules = documentRules(documentType)
  const warning = documentWarning(documentType, documentNumber)
  // Al editar un cliente antiguo con CE o Pasaporte, su tipo sigue disponible
  const types = CUSTOMER_DOC_TYPES.includes(documentType) ? CUSTOMER_DOC_TYPES : [...CUSTOMER_DOC_TYPES, documentType]

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelClassName}>Tipo de Documento</label>
        <select
          className={inputClassName}
          value={documentType}
          // Al cambiar de tipo se borra el número: el largo y las reglas son otras
          onChange={e => onChange({ documentType: e.target.value as DocumentType, documentNumber: '' })}
        >
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClassName}>N° Documento</label>
        <input
          className={inputClassName + (warning ? ERROR_BORDER : '')}
          required
          inputMode={rules ? 'numeric' : undefined}
          maxLength={rules?.maxLength}
          pattern={rules?.pattern}
          title={rules?.title}
          value={documentNumber}
          onChange={e => onChange({
            documentType,
            documentNumber: rules ? onlyDigits(e.target.value, rules.maxLength) : e.target.value,
          })}
        />
        {warning && <p className={WARNING_CLASS}>{warning}</p>}
      </div>
    </div>
  )
}

export function CellphoneField({ value, onChange, labelClassName, inputClassName }: Styles & {
  value: string
  onChange: (value: string) => void
}) {
  const warning = cellphoneWarning(value)

  return (
    <div>
      <label className={labelClassName}>Celular</label>
      <input
        className={inputClassName + (warning ? ERROR_BORDER : '')}
        inputMode="numeric"
        maxLength={CELLPHONE_RULES.maxLength}
        pattern={CELLPHONE_RULES.pattern}
        title={CELLPHONE_RULES.title}
        value={value}
        onChange={e => onChange(onlyDigits(e.target.value, CELLPHONE_RULES.maxLength))}
      />
      {warning && <p className={WARNING_CLASS}>{warning}</p>}
    </div>
  )
}
