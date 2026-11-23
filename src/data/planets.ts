export interface Planet {
  id: string;
  name: string;
  nameEs: string;
  color: string;
  gradient: string;
  radius: number; // km
  mass: number; // kg (×10^24)
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  orbitalSpeed: number; // km/s
  magneticField: number; // magnetic dipole moment (×10^12 T·m³)
  magneticFieldNote: string;
  description: string;
  emoji: string;
}

// Planets ordered by electromagnetic field strength (strongest to weakest)
// This determines their orbital position in our visualization
export const planetsByEMField: Planet[] = [
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameEs: 'Júpiter',
    color: '#E8A87C',
    gradient: 'linear-gradient(135deg, #E8A87C 0%, #D4845A 50%, #C4734A 100%)',
    radius: 69911,
    mass: 1898,
    distanceFromSun: 778.5,
    orbitalPeriod: 4333,
    orbitalSpeed: 13.07,
    magneticField: 155000, // 1.55 × 10^20 T·m³ = 155000 × 10^12
    magneticFieldNote: 'El campo magnético más fuerte del sistema solar, ~20,000× más fuerte que el de la Tierra',
    description: 'El planeta más grande del sistema solar, un gigante gaseoso con un campo magnético colosal generado por hidrógeno metálico en su interior.',
    emoji: '🟠',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameEs: 'Saturno',
    color: '#F3D576',
    gradient: 'linear-gradient(135deg, #F3D576 0%, #E8C84A 50%, #D4B03A 100%)',
    radius: 58232,
    mass: 568.3,
    distanceFromSun: 1434,
    orbitalPeriod: 10759,
    orbitalSpeed: 9.69,
    magneticField: 4600, // 4.6 × 10^18 T·m³
    magneticFieldNote: 'Campo magnético fuerte y simétrico, alineado casi perfectamente con su eje de rotación',
    description: 'Famoso por sus anillos espectaculares, Saturno tiene un campo magnético casi perfectamente simétrico, único entre los planetas.',
    emoji: '🟡',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameEs: 'Neptuno',
    color: '#4A90D9',
    gradient: 'linear-gradient(135deg, #4A90D9 0%, #357ABD 50%, #2868A8 100%)',
    radius: 24622,
    mass: 102.4,
    distanceFromSun: 4495,
    orbitalPeriod: 60190,
    orbitalSpeed: 5.43,
    magneticField: 220, // 2.2 × 10^17 T·m³
    magneticFieldNote: 'Campo magnético fuertemente inclinado (47°) y desplazado del centro del planeta',
    description: 'El planeta más lejano, con un campo magnético extremadamente inclinado y desplazado, sugiriendo una dinamo inusual.',
    emoji: '🔵',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameEs: 'Urano',
    color: '#7EC8E3',
    gradient: 'linear-gradient(135deg, #7EC8E3 0%, #5BB5D5 50%, #4AA8C8 100%)',
    radius: 25362,
    mass: 86.81,
    distanceFromSun: 2871,
    orbitalPeriod: 30687,
    orbitalSpeed: 6.81,
    magneticField: 39, // 3.9 × 10^16 T·m³
    magneticFieldNote: 'Campo magnético inclinado 59° y desplazado significativamente del centro',
    description: 'Gira de lado con una inclinación axial de 98°. Su campo magnético está radicalmente desalineado con su eje de rotación.',
    emoji: '🩵',
  },
  {
    id: 'earth',
    name: 'Earth',
    nameEs: 'Tierra',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 50%, #1976D2 100%)',
    radius: 6371,
    mass: 5.972,
    distanceFromSun: 149.6,
    orbitalPeriod: 365.25,
    orbitalSpeed: 29.78,
    magneticField: 7.79, // 7.79 × 10^15 T·m³
    magneticFieldNote: 'Campo dipolar fuerte que protege la atmósfera del viento solar',
    description: 'Nuestro hogar. Su campo magnético, generado por el núcleo de hierro líquido, protege la vida de la radiación solar.',
    emoji: '🌍',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    nameEs: 'Mercurio',
    color: '#9E9E9E',
    gradient: 'linear-gradient(135deg, #BDBDBD 0%, #9E9E9E 50%, #757575 100%)',
    radius: 2439,
    mass: 0.330,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    orbitalSpeed: 47.87,
    magneticField: 0.0038, // 3.8 × 10^12 T·m³
    magneticFieldNote: 'Campo magnético global débil, ~1% del campo terrestre',
    description: 'El planeta más pequeño y cercano al Sol. Sorprendentemente tiene un campo magnético global, aunque muy débil.',
    emoji: '⚫',
  },
  {
    id: 'mars',
    name: 'Mars',
    nameEs: 'Marte',
    color: '#E57373',
    gradient: 'linear-gradient(135deg, #E57373 0%, #D32F2F 50%, #C62828 100%)',
    radius: 3389,
    mass: 0.642,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    orbitalSpeed: 24.07,
    magneticField: 0, // No global field, only crustal remnants
    magneticFieldNote: 'Sin campo magnético global; solo campos crustales residuales muy débiles',
    description: 'El planeta rojo perdió su campo magnético global hace miles de millones de años, lo que contribuyó a la pérdida de su atmósfera.',
    emoji: '🔴',
  },
  {
    id: 'venus',
    name: 'Venus',
    nameEs: 'Venus',
    color: '#FFB74D',
    gradient: 'linear-gradient(135deg, #FFB74D 0%, #FF9800 50%, #F57C00 100%)',
    radius: 6051,
    mass: 4.867,
    distanceFromSun: 108.2,
    orbitalPeriod: 224.7,
    orbitalSpeed: 35.02,
    magneticField: 0, // No intrinsic magnetic field
    magneticFieldNote: 'Sin campo magnético intrínseco; la interacción con el viento solar crea una magnetosfera inducida muy débil',
    description: 'Similar en tamaño a la Tierra pero sin campo magnético propio. Su lenta rotación (243 días) no genera una dinamo significativa.',
    emoji: '🟠',
  },
];

// Orbital speeds normalized for visualization (relative to Mercury's speed)
// These preserve the physical ratios between planets
export const getOrbitalSpeedFactor = (orbitalSpeed: number): number => {
  return orbitalSpeed / 47.87; // Normalize to Mercury = 1
};

// Visual orbit radii (scaled for the canvas)
// Ordered by EM field strength position, not actual distance
export const getVisualOrbitRadius = (index: number, totalPlanets: number): number => {
  const minRadius = 80;
  const maxRadius = 340;
  const step = (maxRadius - minRadius) / (totalPlanets - 1);
  return minRadius + step * index;
};

// Visual planet sizes (scaled, preserving relative proportions with minimum visibility)
export const getVisualPlanetSize = (radius: number): number => {
  const maxSize = 28;
  const minSize = 6;
  const jupiterRadius = 69911;
  const scale = (radius / jupiterRadius);
  return Math.max(minSize, maxSize * Math.pow(scale, 0.5));
};
