// features/products/pages/ProductDetailPage.tsx
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Upload, X, Loader2, Package } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { PageHeader, FormSection, Field, FormActions } from '@components/ui/Form'
import { useEffect, useRef, useState } from 'react'
import { useProduct, useCreateProduct, useUpdateProduct, useUploadProductImage } from '@features/products/hooks/useProducts'
import { useCategoriesActive } from '@features/categories/hooks/useCategories'
import { formatCurrency, formatPercent, getImageUrl } from '@lib/utils'
import { includedIgv, withIgv, withoutIgv } from '@lib/igv'

const schema = z.object({
  code:         z.string().min(2, 'Código requerido'),
  name:         z.string().min(2, 'Nombre requerido'),
  description:  z.string().optional(),
  brand:        z.string().optional(),
  categoryId:   z.coerce.number().min(1, 'Seleccione una categoría'),
  costPrice:    z.coerce.number().positive('Debe ser mayor a 0'),
  salePrice:    z.coerce.number().positive('Debe ser mayor a 0'),
  stock:        z.coerce.number().min(0),
  minimumStock: z.coerce.number().min(0),
  status:       z.enum(['ACTIVE','INACTIVE','DISCONTINUED']).optional(),
  imageUrl:     z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function ProductDetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const isNew     = !id || id === 'new'

  const { data: product, isLoading } = useProduct(isNew ? 0 : Number(id))
  const { data: categories }          = useCategoriesActive()
  const createMutation                = useCreateProduct()
  const updateMutation                = useUpdateProduct(Number(id))
  const uploadImageMutation           = useUploadProductImage()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { minimumStock: 5, status: 'ACTIVE', salePrice: 0 },
  })

  const imageUrl = watch('imageUrl')
  const salePrice = Number(watch('salePrice')) || 0

  // Se escribe el precio sin IGV; lo que se guarda es salePrice (con IGV).
  // Solo se recalcula salePrice cuando el usuario edita este campo: así, al
  // editar un producto sin tocar el precio, no cambia por redondeo.
  const [priceWithoutIgv, setPriceWithoutIgv] = useState('')
  const handlePriceWithoutIgv = (value: string) => {
    setPriceWithoutIgv(value)
    const base = Number(value)
    setValue('salePrice', value && base > 0 ? withIgv(base) : 0,
      { shouldDirty: true, shouldValidate: true })
  }
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (product && !isNew) {
      reset({
        code:         product.code,
        name:         product.name,
        description:  product.description,
        brand:        product.brand,
        categoryId:   product.categoryId,
        costPrice:    product.costPrice,
        salePrice:    product.salePrice,
        stock:        product.stock,
        minimumStock: product.minimumStock,
        status:       product.status,
        imageUrl:     product.imageUrl ?? undefined,
      })
      setPriceWithoutIgv(withoutIgv(product.salePrice).toFixed(2))
    }
  }, [product, isNew, reset])

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Solo se permiten imágenes JPG, PNG o WEBP')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede pesar más de 5MB')
      return
    }
    const result = await uploadImageMutation.mutateAsync(file)
    setValue('imageUrl', result.imageUrl, { shouldDirty: true })
  }

  const onSubmit = async (data: FormData) => {
    if (isNew) {
      await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0])
      navigate('/products')
    } else {
      await updateMutation.mutateAsync(data as Parameters<typeof updateMutation.mutateAsync>[0])
      navigate('/products')
    }
  }

  const inputClass = (error?: { message?: string }) => `field-input ${error ? 'field-input-error' : ''}`

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="skeleton w-9 h-9 rounded-lg" />
          <div><div className="skeleton h-7 w-48 mb-1" /><div className="skeleton h-4 w-32" /></div>
        </div>
        <div className="section-card"><div className="skeleton h-64 w-full rounded-lg" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title={isNew ? 'Nuevo producto' : 'Editar producto'}
        subtitle={isNew ? 'Registra un producto en el catálogo e inventario.' : <>Código <span className="font-mono">{product?.code}</span></>}
        onBack={() => navigate('/products')}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] items-start">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 min-w-0">

        <FormSection title="Información básica" description="Cómo se identifica el producto en el catálogo y en las boletas.">
          <Field label="Código / SKU" required error={errors.code?.message} hint={isNew ? undefined : 'El código no se puede cambiar.'}>
            <input {...register('code')} placeholder="BRK-2024-001" className={`${inputClass(errors.code)} font-mono`} disabled={!isNew} />
          </Field>
          <Field label="Marca">
            <select {...register('brand')} className={inputClass()}>
              <option value="">Seleccionar marca</option>
              <option>Peugeot</option>
              <option>Citroën</option>
              <option>Renault</option>
              <option>Universal</option>
            </select>
          </Field>
          <Field label="Nombre del producto" required full error={errors.name?.message}>
            <input {...register('name')} placeholder="Pastillas de freno delanteras" className={inputClass(errors.name)} />
          </Field>
          <Field label="Categoría" required error={errors.categoryId?.message}>
            <select {...register('categoryId')} className={inputClass(errors.categoryId)}>
              <option value="">Seleccionar categoría</option>
              {categories?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          {!isNew && (
            <Field label="Estado">
              <select {...register('status')} className={inputClass()}>
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="DISCONTINUED">Descontinuado</option>
              </select>
            </Field>
          )}
          <Field label="Descripción" full>
            <textarea {...register('description')} rows={3} placeholder="Medidas, compatibilidad, observaciones..." className={`${inputClass()} resize-none`} />
          </Field>
        </FormSection>

        <FormSection title="Inventario" description="El sistema avisa en Alertas de stock cuando baja del mínimo.">
          {isNew && (
            <Field label="Stock inicial" required error={errors.stock?.message}>
              <input type="number" {...register('stock')} placeholder="0" className={inputClass(errors.stock)} />
            </Field>
          )}
          <Field label="Stock mínimo" required error={errors.minimumStock?.message}>
            <input type="number" {...register('minimumStock')} placeholder="5" className={inputClass(errors.minimumStock)} />
          </Field>
        </FormSection>

        <FormSection title="Precios" description="Ingresa el precio sin IGV; el precio de venta se calcula solo.">
          <Field label="Precio de costo" required error={errors.costPrice?.message}>
            <input type="number" step="0.01" {...register('costPrice')} placeholder="0.00" className={inputClass(errors.costPrice)} />
          </Field>
          <Field label="Precio sin IGV" required error={errors.salePrice?.message}>
            <input type="number" step="0.01" min="0" value={priceWithoutIgv}
              onChange={e => handlePriceWithoutIgv(e.target.value)}
              placeholder="0.00" className={inputClass(errors.salePrice)} />
            <input type="hidden" {...register('salePrice')} />
          </Field>
          <div className="sm:col-span-2 flex items-center justify-between rounded-lg px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div>
              <p className="text-xs text-[var(--text-muted)]">IGV (18 %)</p>
              <p className="text-sm font-medium text-[var(--text-secondary)]">{formatCurrency(includedIgv(salePrice))}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Precio de venta (con IGV)</p>
              <p className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{formatCurrency(salePrice)}</p>
            </div>
          </div>
        </FormSection>

        <FormSection title="Imagen" description="Se muestra en el catálogo y en la búsqueda de ventas.">
          <div className="sm:col-span-2">
            {imageUrl ? (
              <div className="relative inline-block">
                <img
                  src={getImageUrl(imageUrl) ?? undefined}
                  alt="Producto"
                  className="w-40 h-40 object-cover rounded-lg border border-[var(--border)]"
                />
                <button
                  type="button"
                  onClick={() => setValue('imageUrl', undefined, { shouldDirty: true })}
                  className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-[var(--danger)] text-white rounded-full shadow"
                  title="Quitar imagen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => !uploadImageMutation.isPending && fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault()
                  setIsDragging(false)
                  handleFile(e.dataTransfer.files?.[0])
                }}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragging ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-subtle)]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0])}
                />
                {uploadImageMutation.isPending ? (
                  <>
                    <Loader2 className="w-8 h-8 text-[var(--accent)] mx-auto mb-3 animate-spin" />
                    <p className="text-sm font-medium text-[var(--text-primary)]">Subiendo imagen...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
                    <p className="text-sm font-medium text-[var(--text-primary)]">Arrastra una imagen o haz clic para seleccionar</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">PNG, JPG o WEBP hasta 5 MB</p>
                  </>
                )}
              </div>
            )}
          </div>
        </FormSection>

        <FormActions note={<><span className="text-[var(--danger)]">*</span> Campos obligatorios</>}>
          <Button type="button" variant="secondary" onClick={() => navigate('/products')}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
            {isNew ? 'Crear producto' : 'Guardar cambios'}
          </Button>
        </FormActions>
      </form>

      <ProductSummary
        imageUrl={imageUrl}
        name={watch('name')}
        code={watch('code')}
        category={categories?.find(c => c.id === Number(watch('categoryId')))?.name}
        brand={watch('brand')}
        salePrice={salePrice}
        costPrice={Number(watch('costPrice')) || 0}
        stock={Number(watch('stock')) || 0}
        minimumStock={Number(watch('minimumStock')) || 0}
        showStock={isNew}
      />
      </div>
    </div>
  )
}

// Vista previa en vivo de cómo quedará el producto; acompaña al formulario al hacer scroll.
function ProductSummary({ imageUrl, name, code, category, brand, salePrice, costPrice, stock, minimumStock, showStock }: {
  imageUrl?: string
  name?: string
  code?: string
  category?: string
  brand?: string
  salePrice: number
  costPrice: number
  stock: number
  minimumStock: number
  showStock: boolean
}) {
  const base = withoutIgv(salePrice)
  const margin = costPrice > 0 && base > 0 ? ((base - costPrice) / costPrice) * 100 : null
  const lowStock = showStock && stock <= minimumStock

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-6 section-card !p-0 overflow-hidden">
        <div className="aspect-[4/3] flex items-center justify-center bg-[var(--bg-subtle)] border-b border-[var(--border)]">
          {imageUrl
            ? <img src={getImageUrl(imageUrl) ?? undefined} alt="" className="w-full h-full object-cover" />
            : <Package className="w-10 h-10 text-[var(--text-disabled)]" strokeWidth={1.5} />}
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Vista previa</p>
            <p className="mt-1 font-semibold text-[var(--text-primary)] leading-snug">
              {name?.trim() || <span className="text-[var(--text-disabled)]">Nombre del producto</span>}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              <span className="font-mono">{code?.trim() || '—'}</span>
              {category && <> · {category}</>}
              {brand && <> · {brand}</>}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)]">Precio de venta</p>
            <p className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{formatCurrency(salePrice)}</p>
            <p className="text-xs text-[var(--text-muted)]">Incluye IGV {formatCurrency(includedIgv(salePrice))}</p>
          </div>

          <dl className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border)] text-sm">
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Margen</dt>
              <dd className={`font-semibold ${margin === null ? 'text-[var(--text-disabled)]' : margin < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                {margin === null ? '—' : formatPercent(margin)}
              </dd>
            </div>
            {showStock && (
              <div>
                <dt className="text-xs text-[var(--text-muted)]">Stock inicial</dt>
                <dd className={`font-semibold ${lowStock ? 'text-[var(--warning)]' : 'text-[var(--text-primary)]'}`}>
                  {stock} <span className="font-normal text-xs text-[var(--text-muted)]">/ mín. {minimumStock}</span>
                </dd>
              </div>
            )}
          </dl>
          {lowStock && (
            <p className="text-xs rounded-md px-2.5 py-2 bg-[var(--warning-light)] text-[var(--warning)]">
              Entrará en Alertas de stock apenas se cree.
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
