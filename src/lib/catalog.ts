import { useSyncExternalStore } from "react";
import img3018 from "@/assets/cnc-3018.jpg";
import img3040 from "@/assets/cnc-3040.svg";
import img4040 from "@/assets/cnc-4040.jpg";
import imgLaser from "@/assets/laser-co2.jpg";
import imgMills from "@/assets/endmills.jpg";

export type CategoryId = "routers" | "laser" | "escritorio" | "accesorios";

export const CATEGORIES: { id: CategoryId; name: string; short: string; blurb: string }[] = [
  { id: "routers", name: "Routers CNC", short: "Routers", blurb: "Equipos de pórtico para madera, plásticos y aluminio en formatos 400 mm o mayores." },
  { id: "laser", name: "Cortadoras láser CO2", short: "Láser CO2", blurb: "Corte y grabado de acrílico, MDF, madera, cuero y textiles con tubo CO2." },
  { id: "escritorio", name: "CNC de escritorio", short: "Escritorio", blurb: "Clase 3018 y similares: formato compacto para prototipos, PCB y piezas pequeñas." },
  { id: "accesorios", name: "Accesorios", short: "Accesorios", blurb: "Fresas, sujeción, extracción y consumibles para el taller." },
];

export type SourceType = "oficial" | "amazon" | "aliexpress" | "ebay" | "otro" | "documentacion";
export const SOURCE_LABELS: Record<SourceType, string> = {
  oficial: "Tienda oficial",
  amazon: "Amazon",
  aliexpress: "AliExpress",
  ebay: "eBay",
  otro: "Otro distribuidor",
  documentacion: "Documentación y seguridad",
};

export interface Source { id: string; type: SourceType; label: string; url: string }
export interface Spec { label: string; value: string; verified: boolean }

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  category: CategoryId;
  images: string[];
  imageNote: string;
  description: string;
  workArea: { x: number | null; y: number | null; z: number | null };
  workAreaNote: string;
  dimensions: string;
  powerW: number | null;
  powerLabel: string;
  specs: Spec[];
  materials: string[];
  accessories: string[];
  priceUSD: number | null;
  shippingNote: string;
  sources: Source[];
  lastChecked: string | null;
  status: "verificado" | "por-verificar";
  /** Reserved for a future interactive 3D viewer (GLB/GLTF URL). */
  model3dUrl: string | null;
}

export interface Settings { rateDOP: number; rateNote: string }
export interface CatalogState { products: Product[]; settings: Settings; compare: string[] }

const PENDING = "Por verificar";
const ILLUSTRATIVE = "Imagen ilustrativa de la clase de equipo; no corresponde a un listado específico.";

export const SEED_PRODUCTS: Product[] = [
  {
    id: "cnc-3018-clase",
    name: "CNC de escritorio Genmitsu 3018-PRO",
    manufacturer: "Genmitsu / SainSmart",
    category: "escritorio",
    images: [img3018],
    imageNote: ILLUSTRATIVE,
    description: "Router CNC de escritorio de tres ejes y formato compacto. El modelo 3018-PRO ofrece un área nominal de 300 × 180 × 45 mm y está pensado para trabajos pequeños de grabado y fresado. Esta ficha toma como referencia el modelo publicado por Genmitsu; la configuración y los accesorios pueden variar por región o vendedor.",
    workArea: { x: 300, y: 180, z: 45 },
    workAreaNote: "Área de trabajo publicada para el modelo Genmitsu 3018-PRO.",
    dimensions: "Por confirmar en la variante y región de venta.",
    powerW: null,
    powerLabel: "Potencia del husillo: verificar en la variante seleccionada.",
    specs: [
      { label: "Ejes", value: "3 (X, Y, Z)", verified: true },
      { label: "Control", value: "GRBL; confirmar versión de placa según variante", verified: false },
      { label: "Área nominal", value: "300 × 180 × 45 mm", verified: true },
      { label: "Uso previsto", value: "Grabado y fresado de piezas pequeñas", verified: true },
      { label: "Portaherramientas", value: "Pinza ER11; confirmar diámetro incluido", verified: false },
    ],
    materials: ["Madera", "MDF", "Acrílico", "Plásticos", "PCB (con configuración adecuada)"],
    accessories: ["El contenido exacto del paquete depende de la variante; revisar la lista del vendedor."],
    priceUSD: 199,
    shippingNote: "Precio de referencia publicado en la tienda oficial; envío internacional, aranceles e ITBIS no incluidos. Confirmar precio y disponibilidad al abrir el enlace.",
    sources: [
      { id: "3018-official", type: "oficial", label: "Genmitsu: routers CNC y precio de referencia del 3018-PRO", url: "https://genmitsu.com/collections/milling-machines" },
      { id: "3018-manual", type: "oficial", label: "Manual del Genmitsu 3018-PRO", url: "https://genmitsu.s3.us-east-1.amazonaws.com/101-60-280PRO/3018-PRO_MANUAL_V1.4_EN%2BDE_2021.12.pdf" },
      { id: "3018-safety", type: "documentacion", label: "HSE: prácticas seguras para routers CNC y centros de mecanizado", url: "https://www.hse.gov.uk/pubns/wis22.htm" },
    ],
    lastChecked: "2026-11-03",
    status: "verificado",
    model3dUrl: null,
  },
  {
    id: "router-3040-clase",
    name: "Router CNC clase 3040",
    manufacturer: "Varios fabricantes",
    category: "routers",
    images: [img3040],
    imageNote: ILLUSTRATIVE,
    description: "Router CNC compacto de la clase 3040. Esta categoría reúne equipos de distintos fabricantes y puede presentar diferencias entre modelos. La ficha ofrece una descripción general de esta clase de equipo, no de una versión comercial específica.",
    workArea: { x: 300, y: 400, z: null },
    workAreaNote: "Área de referencia indicada para esta ficha: 300 × 400 mm.",
    dimensions: "Las dimensiones exteriores varían según el fabricante y el modelo.",
    powerW: null,
    powerLabel: "La potencia depende del modelo específico y debe consultarse en su ficha comercial.",
    specs: [
      { label: "Tipo de equipo", value: "Router CNC compacto", verified: true },
      { label: "Clase", value: "3040", verified: true },
      { label: "Fabricante", value: "Varios fabricantes", verified: true },
    ],
    materials: [],
    accessories: [],
    priceUSD: null,
    shippingNote: "El precio, la disponibilidad y las condiciones de envío dependen del fabricante y del modelo seleccionado.",
    sources: [
      { id: "3040-guide", type: "otro", label: "Guía técnica: qué significa la clase CNC 3040", url: "https://cncrouterinfo.com/routers/3040-cnc-router/" },
      { id: "3040-vendor", type: "otro", label: "Catálogo de routers CNC para comparar configuraciones", url: "https://www.ato.com/cnc-router-machine?viewmode=list" },
      { id: "3040-safety", type: "documentacion", label: "HSE: prácticas seguras para routers CNC y centros de mecanizado", url: "https://www.hse.gov.uk/pubns/wis22.htm" },
    ],
    lastChecked: "2026-11-03",
    status: "por-verificar",
    model3dUrl: null,
  },
  {
    id: "router-4040-clase",
    name: "Router CNC Genmitsu 4040-PRO",
    manufacturer: "Genmitsu / SainSmart",
    category: "routers",
    images: [img4040],
    imageNote: ILLUSTRATIVE,
    description: "Router CNC de escritorio con estructura de aluminio y área de trabajo cuadrada de 400 × 400 mm. La versión 4040-PRO incorpora una plataforma MDF reforzada con ranuras T, husillo de 75 W y controlador GRBL de 32 bits. La imagen de esta ficha es ilustrativa; consulta el enlace para ver la variante comercial exacta.",
    workArea: { x: 400, y: 400, z: 78 },
    workAreaNote: "Área de trabajo publicada: 400 × 400 × 78 mm.",
    dimensions: "673 × 663 × 336 mm",
    powerW: 75,
    powerLabel: "Husillo nominal de 75 W (no confundir con la versión 4040-PRO MAX).",
    specs: [
      { label: "Ejes", value: "3 (X, Y, Z)", verified: true },
      { label: "Estructura", value: "Aluminio", verified: true },
      { label: "Transmisión", value: "Husillos de avance (lead screw)", verified: true },
      { label: "Control", value: "GRBL, MCU de 32 bits", verified: true },
      { label: "Velocidad máxima publicada", value: "2.000 mm/min", verified: true },
      { label: "Alimentación", value: "24 V / 4 A", verified: true },
      { label: "Peso", value: "20,65 kg", verified: true },
      { label: "Seguridad y referencia", value: "Interruptor de emergencia, finales de carrera y sonda Z", verified: true },
      { label: "Plataforma", value: "MDF reforzado con soporte central y ranuras T", verified: true },
    ],
    materials: ["Madera", "MDF", "Acrílico", "Plásticos; otros materiales dependen de la herramienta y configuración."],
    accessories: ["Fuente de alimentación", "Cable USB", "Unidad USB", "Sonda Z LED", "4 sujeciones", "Pinzas ER11 de 4 mm y 3,175 mm", "Fresas V de 30° (3 unidades)", "Kit de tornillos y herramientas"],
    priceUSD: 479,
    shippingNote: "Precio promocional de referencia visto en la tienda oficial; envío y taxes se calculan al finalizar compra. No incluye importación a República Dominicana.",
    sources: [
      { id: "4040-official", type: "oficial", label: "Ficha oficial Genmitsu 4040-PRO: precio, medidas y especificaciones", url: "https://genmitsu.com/products/4040-pro" },
      { id: "4040-resource", type: "oficial", label: "Centro de recursos y documentación del 4040-PRO", url: "https://docs.sainsmart.com/article/oq9mdxodpe-genmitsu-4040-pro-resource-page" },
      { id: "4040-safety", type: "documentacion", label: "HSE: prácticas seguras para routers CNC y centros de mecanizado", url: "https://www.hse.gov.uk/pubns/wis22.htm" },
    ],
    lastChecked: "2026-11-03",
    status: "verificado",
    model3dUrl: null,
  },
  {
    id: "laser-co2-40w-clase",
    name: "Cortadora y grabadora láser CO₂ Monport 40W Pro",
    manufacturer: "Monport",
    category: "laser",
    images: [imgLaser],
    imageNote: ILLUSTRATIVE,
    description: "Grabadora y cortadora de sobremesa con tubo láser CO₂ de 40 W y área de trabajo de 300 × 200 mm. El fabricante indica compatibilidad con LightBurn y GRBL, asistencia de aire y refrigeración por agua. Es una referencia de modelo concreto, no una especificación universal para todas las máquinas CO₂ de 40 W. Equipo láser que requiere instalación, protección y supervisión adecuadas.",
    workArea: { x: 300, y: 200, z: null },
    workAreaNote: "Área de grabado publicada: 12 × 8 pulgadas (aprox. 300 × 200 mm).",
    dimensions: "790 × 500 × 260 mm",
    powerW: 40,
    powerLabel: "40 W de potencia láser CO₂.",
    specs: [
      { label: "Tipo de láser", value: "Tubo CO₂, longitud de onda 10,6 μm", verified: true },
      { label: "Área de trabajo", value: "300 × 200 mm", verified: true },
      { label: "Velocidad máxima de grabado", value: "350 mm/s (dato del fabricante)", verified: true },
      { label: "Precisión de movimiento", value: "0,01 pulgadas (dato publicado)", verified: true },
      { label: "Refrigeración", value: "Sistema por agua", verified: true },
      { label: "Software", value: "LightBurn y GRBL; compatibilidad según sistema", verified: true },
      { label: "Peso", value: "22 kg", verified: true },
      { label: "Vida útil estimada del tubo", value: "2.000 horas (dato publicado por el fabricante)", verified: true },
    ],
    materials: ["Madera", "Acrílico", "Cuero", "Papel", "Cartón", "Tela (según material y configuración)"],
    accessories: ["Asistencia de aire", "Bomba de agua y mangueras del sistema de refrigeración (según paquete publicado)"],
    priceUSD: 551.99,
    shippingNote: "Precio final de referencia publicado por Monport al consultar la ficha; la página indicaba agotado. Confirmar disponibilidad, envío internacional, aranceles e ITBIS antes de presupuestar.",
    sources: [
      { id: "laser-monport", type: "oficial", label: "Ficha oficial Monport 40W Pro: precio, área y especificaciones", url: "https://monportlaser.com/products/monport-40w-lightburn-laser-engraver" },
      { id: "laser-iso", type: "documentacion", label: "ISO 11553-1:2020: requisitos de seguridad para máquinas de procesamiento láser", url: "https://www.iso.org/standard/67658.html" },
      { id: "laser-nist", type: "documentacion", label: "NIST: programa de seguridad para sistemas láser", url: "https://www.nist.gov/oshe/safety-programs/laser-safety-program" },
    ],
    lastChecked: "2026-11-03",
    status: "verificado",
    model3dUrl: null,
  },
  {
    id: "fresas-3175",
    name: "Juego de 10 fresas CNC VEVOR de 3,175 mm",
    manufacturer: "VEVOR",
    category: "accesorios",
    images: [imgMills],
    imageNote: ILLUSTRATIVE,
    description: "Juego de diez fresas de punta plana y dos filos, con vástago de 3,175 mm (1/8 pulgada). La ficha del vendedor indica acero de tungsteno, longitud de corte de 17 mm y longitud total de 38 mm. Verifica que el diámetro del vástago coincida con la pinza del equipo antes de considerar compatibilidad.",
    workArea: { x: null, y: null, z: null },
    workAreaNote: "Accesorio; no aplica área de trabajo.",
    dimensions: "Vástago Ø 3,175 mm; longitud total 38 mm.",
    powerW: null,
    powerLabel: "No aplica",
    specs: [
      { label: "Cantidad", value: "10 piezas", verified: true },
      { label: "Tipo", value: "Punta plana, 2 filos", verified: true },
      { label: "Material", value: "Acero de tungsteno (según vendedor)", verified: true },
      { label: "Diámetro del vástago", value: "3,175 mm (1/8 pulgada)", verified: true },
      { label: "Diámetro de corte", value: "3,175 mm", verified: true },
      { label: "Longitud de corte", value: "17 mm", verified: true },
      { label: "Longitud total", value: "38 mm", verified: true },
      { label: "Estuche", value: "55 × 52 × 9 mm", verified: true },
    ],
    materials: ["Madera", "MDF", "Acrílico", "Plásticos y PCB, según material y especificación del fabricante."],
    accessories: ["Estuche plástico de almacenamiento."],
    priceUSD: 14.99,
    shippingNote: "Precio de referencia del listado VEVOR; envío e impuestos se calculan aparte. Confirmar precio y disponibilidad en la tienda.",
    sources: [
      { id: "mills-vevor", type: "otro", label: "VEVOR: juego de 10 fresas CNC de 3,175 mm", url: "https://www.vevor.com/cnc-end-mill-c_10127/vevor-10pcs-3-175mm-cnc-engraving-router-bits-end-mill-2-flute-flat-nose-bits-p_010462119900" },
      { id: "mills-safety", type: "documentacion", label: "HSE: prácticas seguras para routers CNC y centros de mecanizado", url: "https://www.hse.gov.uk/pubns/wis22.htm" },
    ],
    lastChecked: "2026-11-03",
    status: "verificado",
    model3dUrl: null,
  },
];

export const DEFAULT_SETTINGS: Settings = {
  rateDOP: 60,
  rateNote: "Tasa de referencia introducida manualmente; no es una cotización en vivo.",
};

const KEY = "fablab-catalog-v1";
const initial: CatalogState = { products: SEED_PRODUCTS, settings: DEFAULT_SETTINGS, compare: [] };
let state: CatalogState = initial;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CatalogState>;
      state = {
        products: Array.isArray(parsed.products) ? parsed.products : SEED_PRODUCTS,
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        compare: Array.isArray(parsed.compare) ? parsed.compare : [],
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
}

function setState(next: CatalogState) {
  state = next;
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
  listeners.forEach((l) => l());
}

export function useCatalog() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => initial,
  );
}

export const catalog = {
  get: () => state,
  upsert(p: Product) {
    const exists = state.products.some((x) => x.id === p.id);
    setState({ ...state, products: exists ? state.products.map((x) => (x.id === p.id ? p : x)) : [...state.products, p] });
  },
  remove(id: string) {
    setState({ ...state, products: state.products.filter((x) => x.id !== id), compare: state.compare.filter((c) => c !== id) });
  },
  setSettings(s: Partial<Settings>) { setState({ ...state, settings: { ...state.settings, ...s } }); },
  toggleCompare(id: string) {
    const has = state.compare.includes(id);
    if (!has && state.compare.length >= 4) return false;
    setState({ ...state, compare: has ? state.compare.filter((c) => c !== id) : [...state.compare, id] });
    return true;
  },
  clearCompare() { setState({ ...state, compare: [] }); },
  replaceAll(products: Product[]) { setState({ ...state, products }); },
  reset() { setState({ ...initial }); },
};

export function newProduct(): Product {
  return {
    id: `p-${Date.now().toString(36)}`,
    name: "Nuevo producto",
    manufacturer: "",
    category: "routers",
    images: [],
    imageNote: "",
    description: "",
    workArea: { x: null, y: null, z: null },
    workAreaNote: "",
    dimensions: "",
    powerW: null,
    powerLabel: "",
    specs: [],
    materials: [],
    accessories: [],
    priceUSD: null,
    shippingNote: "Envío, aranceles e ITBIS no incluidos.",
    sources: [],
    lastChecked: null,
    status: "por-verificar",
    model3dUrl: null,
  };
}

/* ---------- formatting helpers ---------- */

export function toDOP(usd: number, rate: number) {
  return Math.round(usd * rate);
}

export function fmtMoney(n: number, cur: "USD" | "DOP") {
  return `${cur} ${new Intl.NumberFormat("es-DO", { maximumFractionDigits: cur === "USD" ? 2 : 0 }).format(n)}`;
}

export function fmtArea(w: Product["workArea"]) {
  if (w.x == null && w.y == null) return "Por verificar";
  const parts = [w.x ?? "?", w.y ?? "?"];
  if (w.z != null) parts.push(w.z);
  return `${parts.join(" × ")} mm`;
}

export function fmtDate(d: string | null) {
  if (!d) return "Sin revisar";
  const date = new Date(d + "T00:00:00");
  return isNaN(date.getTime()) ? d : date.toLocaleDateString("es-DO", { day: "numeric", month: "long", year: "numeric" });
}

export function categoryName(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}
