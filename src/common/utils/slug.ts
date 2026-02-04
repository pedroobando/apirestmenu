export const createSlug = (text: string): string => {
  // Convertir a minúsculas
  let slug = text.toLowerCase();

  // Eliminar caracteres especiales usando una expresión regular
  // Dejar solo letras, números y espacios
  slug = slug.replace(/[^a-z0-9\s-]/g, '');

  // Reemplazar espacios y guiones múltiples con un solo guión
  slug = slug.replace(/\s+/g, '-');

  // Eliminar guiones al inicio y al final
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
};
