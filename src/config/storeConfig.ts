export interface StoreConfig {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // Formato internacional sin símbolos: ej: 5491112345678
  displayPhone: string;
  address: string;
  schedule: string;
  paymentNotice: string;
  currency: string;
  logoUrl: string;
}

export const STORE_CONFIG: StoreConfig = {
  storeName: "Fiambrería Me Gusta",
  tagline: "Sándwiches Gourmet & Charcutería Artesanal",
  logoUrl: "/logo.png",
  // Número de WhatsApp configurable. Puede sobrescribirse con variables de entorno si se desea.
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "5491162411992",
  displayPhone: "11 6241-1992",
  address: "Rio de Janeiro 392",
  schedule: "Lun a Sáb de 10:00 a 13:30 hs y de 16:30 a 20:30 hs",
  paymentNotice: "El pago se abona al momento de retirar en el local (Efectivo o Transferencia bancaria).",
  currency: "ARS",
};
