export const unicName = (nombreArchivo: string): string => {
  const extension = nombreArchivo.slice(nombreArchivo.lastIndexOf('.'));
  const caracteres: string = 'abcdefghijklmnopqrstuvwxyz0123456789_QWERTYUIOPASDFGHJKLMNBVCXZ';

  const valoresAleatorios = new Uint32Array(35);
  crypto.getRandomValues(valoresAleatorios);

  const stringAleatorio = Array.from(valoresAleatorios, (valor) => caracteres[valor % caracteres.length]).join('');

  return stringAleatorio + extension;
};
