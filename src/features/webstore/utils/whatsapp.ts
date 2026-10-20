// features/webstore/utils/whatsapp.ts
// Enlace a un chat de WhatsApp de Perú (51 + los últimos 9 dígitos) con el texto ya escrito.
export function whatsappLink(phone: string, text: string) {
  return `https://wa.me/51${phone.replace(/\D/g, '').slice(-9)}?text=${encodeURIComponent(text)}`
}
