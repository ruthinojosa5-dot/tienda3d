export interface Producto {
  id: string | number;
  nombre: string;
  precio: number;
  imagen_url: string;
  material: string;
  stock: number;
  descripcion?: string;
  categoria?: string;
  dimensiones?: string;
  tiempo_estimado?: string;
  relleno_recomendado?: string;
  colores_disponibles?: string[];
  destacado?: boolean;
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
  colorSeleccionado?: string;
  notasPersonalizadas?: string;
}

export interface CustomerOrderInfo {
  nombre: string;
  telefono: string;
  metodoEntrega: 'retiro' | 'envio';
  direccion: string;
  ciudad: string;
  notas: string;
}

export interface SupabaseConfig {
  url: string;
  key: string;
}
