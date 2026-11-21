import { ProductCategory } from './product.data';

/** Valeur de l'option "All" : aucun filtre par catégorie. */
export const ALL_CATEGORIES = '';

/** Texte de recherche sans espaces autour et insensible à la casse. */
export function normalize(text: string): string {
  return text.trim().toLowerCase();
}

/** Le nom du produit contient le terme (déjà normalisé). */
export function matchesSearch(product: ProductCategory, normalizedTerm: string): boolean {
  return product.name.toLowerCase().includes(normalizedTerm);
}

/** Le produit appartient à la catégorie, ou "All" est sélectionné. */
export function matchesCategory(product: ProductCategory, category: string): boolean {
  return category === ALL_CATEGORIES || product.category === category;
}

/** Catégories distinctes, dans l'ordre d'apparition. */
export function categoriesOf(products: readonly ProductCategory[]): string[] {
  return [...new Set(products.map((product) => product.category))];
}
