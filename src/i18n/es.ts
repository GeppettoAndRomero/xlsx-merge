import type { ToolContent } from './types';

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Combinar libros de Excel — todas las hojas, sin subir archivos | runlocally',
    description:
      'Combina varios libros XLSX o XLSM en un único archivo XLSX desde el navegador. Se conserva el orden y se renombran las hojas con nombres repetidos.',
    ogTitle: 'Combinar libros de Excel en el navegador',
    ogDescription:
      'Reúne todas las hojas de varios libros XLSX o XLSM en un archivo XLSX sin subir los archivos de origen.',
  },

  hero: {
    h1: 'Combinar libros de Excel',
    tagline:
      'Reúne todas las hojas de varios archivos XLSX o XLSM en un solo libro. El procesamiento se realiza en el navegador.',
  },

  intro: {
    h2: 'Un libro con todas las hojas seleccionadas',
    paras: [
      'La herramienta abre cada libro de Excel seleccionado y copia sus hojas en un archivo nuevo llamado merged.xlsx. Se respeta tanto el orden de los archivos de entrada como el orden de las hojas dentro de cada libro.',
      'La operación combina hojas completas; no añade las filas de tablas parecidas ni concilia sus columnas. Si dos hojas tienen el mismo nombre, la segunda recibe un sufijo basado en el archivo de origen, respetando el límite de 31 caracteres de Excel.',
    ],
  },

  privacy: {
    h2: 'Los libros se procesan en tu dispositivo',
    lead:
      'El navegador lee los archivos seleccionados y crea el libro combinado de forma local. No hay ningún paso de subida:',
    points: [
      'El contenido de los libros lo procesa el código que se ejecuta en la página.',
      'El resultado se crea en la memoria del navegador y se descarga desde la misma página.',
      'La página estática no envía los archivos seleccionados a un servicio de conversión.',
      'El código fuente se puede consultar y está publicado con licencia MIT.',
    ],
    note:
      'Durante la combinación puedes revisar el panel Red del navegador y comprobar que ninguna solicitud contiene datos de los libros.',
    sourceLinkText: 'Ver el código fuente.',
  },

  howto: {
    h2: 'Cómo combinar los libros',
    steps: [
      {
        h3: 'Selecciona al menos dos libros',
        p: 'Elige varios archivos .xlsx o .xlsm a la vez, o suéltalos sobre la página. El orden de selección determina el orden final de las hojas.',
      },
      {
        h3: 'Espera mientras se copian las hojas',
        p: 'La página abre los libros de uno en uno, asigna nombres distintos cuando hay conflictos y escribe un libro XLSX nuevo.',
      },
      {
        h3: 'Guarda merged.xlsx',
        p: 'La descarga empieza cuando termina la escritura. El resultado indica cuántos archivos y hojas se han combinado y permite volver a descargar el archivo.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se suben mis archivos de Excel?',
      a: 'No. La lectura, la copia y la escritura tienen lugar en el navegador. Los libros seleccionados no se envían a un servidor de conversión.',
    },
    {
      q: '¿Qué contenido se copia?',
      a: 'Se copian los valores y las fórmulas de las celdas, los formatos numéricos, el ancho de las columnas y el alto de las filas. También se conserva el orden de las hojas. Las fórmulas se copian tal como están, por lo que sus referencias no se reescriben si hay que cambiar un nombre repetido.',
    },
    {
      q: '¿Qué contenido no se transfiere?',
      a: 'No se transfieren gráficos, imágenes incrustadas, macros, formatos condicionales, rangos con nombre ni otras funciones propias del libro. Si necesitas conservarlos, utiliza Excel u otro editor de hojas de cálculo.',
    },
    {
      q: '¿Qué ocurre si dos hojas tienen el mismo nombre?',
      a: 'La primera conserva su nombre. A las siguientes se les añade un sufijo basado en el archivo de origen y, si hace falta, un número. Los caracteres no permitidos se sustituyen y el nombre queda limitado a 31 caracteres.',
    },
    {
      q: '¿Puede unir las filas de tablas con las mismas columnas?',
      a: 'No. Cada hoja de origen sigue siendo una hoja independiente en el resultado. La herramienta no añade filas, concilia columnas, elimina registros duplicados ni calcula totales entre archivos.',
    },
    {
      q: '¿Puedo usar archivos .xls o libros protegidos con contraseña?',
      a: 'El formato antiguo .xls no es compatible. Los libros protegidos con contraseña tampoco se pueden abrir; retira la protección antes de combinarlos.',
    },
    {
      q: '¿Se conservan las macros de los archivos .xlsm?',
      a: 'No. Los archivos .xlsm se aceptan como fuentes para leer las celdas de sus hojas, pero el resultado es merged.xlsx y las macros de VBA no se copian.',
    },
    {
      q: '¿Hay un límite de tamaño?',
      a: 'La herramienta no establece un límite fijo de bytes. Todos los libros seleccionados y el resultado ocupan memoria del navegador, así que el límite práctico depende del dispositivo, del navegador y del contenido.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que se ejecutan localmente en tu dispositivo.',
    colophon:
      'Desarrollado y mantenido por Geppetto. Parte del código y del texto se prepara con ayuda de IA; el responsable revisa el resultado.',
    securityText: 'Seguridad',
  },

  related: {
    h2: 'Herramientas relacionadas',
    blogLinkText: 'Leer las notas técnicas',
  },
};
