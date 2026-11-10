import React from 'react';
import { MessageCircle, MapPin, Mail, Phone } from 'lucide-react';
import { WHATSAPP_PHONE } from '../lib/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer id="contacto" className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-cyan-400 flex items-center justify-center text-slate-950 font-bold text-xs">
                3D
              </span>
              <span className="text-base font-bold text-white font-display">
                UNIVERSO 3D
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Taller de impresión y manufactura aditiva. Fabricamos piezas de diseño, repuestos mecánicos y prototipos funcionales con despacho a todo el país.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">Catálogo de Productos</a>
              </li>
              <li>
                <a href="#materiales" className="hover:text-white transition-colors">Guía de Materiales</a>
              </li>
              <li>
                <a href="#taller" className="hover:text-white transition-colors">Nuestras Impresoras</a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola Universo 3D! Quisiera hacer una consulta general.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Atención Directa WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Materiales Disponibles
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>PLA & PLA Silk Bicromático</li>
              <li>PETG Reforzado con Carbono</li>
              <li>ABS Técnico para Alta Temperatura</li>
              <li>TPU 95A Elastómero Flexible</li>
              <li>Resina UV 8K Ultra Alta Definición</li>
            </ul>
          </div>

          {/* Contact & Workshop Location */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Contacto y Taller
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>San Salvador de Jujuy, Jujuy, Argentina</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>+54 9 388 8202559</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>contacto@universo3d.com.ar</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola Universo 3D! 👋')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chatear por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div>
            © {new Date().getFullYear()} Universo 3D. Todos los derechos reservados.
          </div>
          <div className="text-slate-500 text-[11px]">
            Conectado a base de datos Supabase · Envíos por Correo Argentino y Andreani
          </div>
        </div>

      </div>
    </footer>
  );
};
