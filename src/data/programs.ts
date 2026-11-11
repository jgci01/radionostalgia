export interface ProgramItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  schedule: string;
  image: string;
  audio: string;
}

export const PROGRAMS: ProgramItem[] = [
  {
    id: 1,
    title: 'Cantares Latinoamericanos',
    subtitle: 'Raíces y voces de nuestra tierra',
    description:
      'Un recorrido íntimo por el folclore, la trova y los grandes intérpretes que dieron identidad musical a toda Hispanoamérica.',
    category: 'Folclore y Raíces',
    schedule: 'Lunes y Miércoles • 20:00 hs',
    image: '/images/cantares.jpeg',
    audio: '/audio/cantares.mpeg',
  },
  {
    id: 2,
    title: 'El Baúl de los Recuerdos',
    subtitle: 'Melodías que guardan historias',
    description:
      'Abrimos el cofre de las décadas del 60, 70 y 80 con baladas inolvidables y canciones que marcaron épocas doradas.',
    category: 'Clásicos y Baladas',
    schedule: 'Martes y Jueves • 21:00 hs',
    image: '/images/baul.jpeg',
    audio: '/audio/baul.mpeg',
  },
  {
    id: 3,
    title: 'Nostalgia Instrumental',
    subtitle: 'Orquestas y armonías sin palabras',
    description:
      'Grandes orquestas, pianos de cola, saxofones y arreglos instrumentales de alta fidelidad para relajar los sentidos.',
    category: 'Instrumental',
    schedule: 'Todos los días • 23:00 hs',
    image: '/images/instrumental.jpeg',
    audio: '/audio/instrumental.mpeg',
  },
  {
    id: 4,
    title: 'Nostalgia Vallenata',
    subtitle: 'Acordeones y sentimiento clásico',
    description:
      'Los vallenatos románticos y tradicionales más queridos, llenos de poesía, acordeón y sentimiento caribeño.',
    category: 'Vallenato Clásico',
    schedule: 'Viernes • 22:00 hs',
    image: '/images/vallenata.jpeg',
    audio: '/audio/vallenata.mpeg',
  },
  {
    id: 5,
    title: 'Joyas Musicales del Ayer',
    subtitle: 'Edición de colección en alta fidelidad',
    description:
      'Grabaciones históricas, duetos irrepetibles y versiones originales restauradas para los oídos más exigentes.',
    category: 'Colección Oro',
    schedule: 'Sábados • 19:00 hs',
    image: '/images/joyas.jpeg',
    audio: '/audio/joyas.mpeg',
  },
  {
    id: 6,
    title: 'Bailables del Recuerdo',
    subtitle: 'La pista encendida con los clásicos',
    description:
      'Cumbias clásicas, tropicales de salón y ritmos festivos de antaño para revivir la alegría de las grandes fiestas.',
    category: 'Tropical y Bailable',
    schedule: 'Sábados • 22:00 hs',
    image: '/images/bailables.jpeg',
    audio: '/audio/bailables.mpeg',
  },
  {
    id: 7,
    title: 'El Rincón de Juancho',
    subtitle: 'Charlas, anécdotas y selección del locutor',
    description:
      'El espacio de autor de nuestro creador y locutor: historias detrás de las canciones, dedicatorias y selección especial.',
    category: 'Programa Especial',
    schedule: 'Domingos • 20:00 hs',
    image: '/images/juancho.jpeg',
    audio: '/audio/juancho.mpeg',
  },
];
