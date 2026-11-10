import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Producto } from '../types';
import { FALLBACK_PRODUCTOS } from '../data/fallbackProducts';

export const DEFAULT_SUPABASE_URL = 'https://atmbzcodupgllqmmqyfn.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_XWwhhI731497G-VB6Bzzjg_69zs4ljZc';

const STORAGE_KEY_URL = 'universo3d_sb_url';
const STORAGE_KEY_KEY = 'universo3d_sb_key';

export function getActiveSupabaseConfig(): { url: string; key: string; isCustom: boolean } {
  try {
    const customUrl = localStorage.getItem(STORAGE_KEY_URL);
    const customKey = localStorage.getItem(STORAGE_KEY_KEY);
    if (customUrl && customKey) {
      return { url: customUrl.trim(), key: customKey.trim(), isCustom: true };
    }
  } catch {
    // ignore localStorage errors
  }
  return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_KEY, isCustom: false };
}

export function saveSupabaseConfig(url: string, key: string) {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, key.trim());
}

export function resetSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_KEY);
}

export function getSupabaseClient(): SupabaseClient {
  const config = getActiveSupabaseConfig();
  return createClient(config.url, config.key, {
    auth: {
      persistSession: false,
    },
  });
}

export interface FetchResult {
  productos: Producto[];
  source: 'supabase' | 'fallback';
  errorMessage?: string;
  configUsed: { url: string; key: string };
}

export async function fetchProductosFromSupabase(): Promise<FetchResult> {
  const config = getActiveSupabaseConfig();
  try {
    const client = getSupabaseClient();
    const { data, error, status } = await client
      .from('productos')
      .select('*');

    if (error) {
      console.warn('Supabase query error:', error);
      return {
        productos: FALLBACK_PRODUCTOS,
        source: 'fallback',
        errorMessage: error.message || `Error HTTP ${status}: No se pudo acceder a la tabla 'productos'`,
        configUsed: config,
      };
    }

    if (!data || data.length === 0) {
      return {
        productos: FALLBACK_PRODUCTOS,
        source: 'fallback',
        errorMessage: "La tabla 'productos' en Supabase respondió correctamente pero está vacía.",
        configUsed: config,
      };
    }

    // Map rows from Supabase ensuring required fields exist
    const mapped: Producto[] = data.map((row: Record<string, unknown>, index: number) => {
      const precioNum = typeof row.precio === 'number' ? row.precio : parseFloat(String(row.precio || 0));
      const stockNum = typeof row.stock === 'number' ? row.stock : parseInt(String(row.stock || 0), 10);
      
      let rawImg = String(row.imagen_url || '');
      // Normalize /src/assets/images/ paths to /images/ for production (Vercel)
      if (rawImg.startsWith('/src/assets/images/')) {
        rawImg = rawImg.replace('/src/assets/images/', '/images/');
      }
      if (!rawImg) {
        rawImg = FALLBACK_PRODUCTOS[index % FALLBACK_PRODUCTOS.length].imagen_url;
      }

      return {
        id: (row.id as string | number) ?? `supa-${index + 1}`,
        nombre: String(row.nombre || 'Pieza 3D'),
        precio: isNaN(precioNum) ? 0 : precioNum,
        imagen_url: rawImg,
        material: String(row.material || 'PLA'),
        stock: isNaN(stockNum) ? 5 : stockNum,
        descripcion: row.descripcion ? String(row.descripcion) : undefined,
        categoria: row.categoria ? String(row.categoria) : 'Impresión 3D',
        dimensiones: row.dimensiones ? String(row.dimensiones) : undefined,
        tiempo_estimado: row.tiempo_estimado ? String(row.tiempo_estimado) : undefined,
        colores_disponibles: Array.isArray(row.colores) ? (row.colores as string[]) : ['Negro', 'Blanco', 'Gris'],
        destacado: Boolean(row.destacado),
      };
    });

    return {
      productos: mapped,
      source: 'supabase',
      configUsed: config,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Supabase fetch exception:', err);
    return {
      productos: FALLBACK_PRODUCTOS,
      source: 'fallback',
      errorMessage: msg,
      configUsed: config,
    };
  }
}
