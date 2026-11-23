import { motion } from 'framer-motion';
import { shapes, GeometricShape } from '../data/shapes';

interface HomeScreenProps {
  onSelectShape: (shape: GeometricShape) => void;
}

export default function HomeScreen({ onSelectShape }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a3e] via-[#151530] to-[#0d0d20] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white/90 mb-2">
          🔷 Cuerpos Geométricos
        </h1>
        <p className="text-sm md:text-base text-white/40">
          Toca un cuerpo para jugar
        </p>
      </motion.div>

      {/* Shape selection grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-lg w-full">
        {shapes.map((shape, index) => (
          <motion.button
            key={shape.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectShape(shape)}
            className="relative group aspect-square rounded-3xl border border-white/10 overflow-hidden transition-all hover:border-white/20"
            style={{
              background: `linear-gradient(135deg, ${shape.baseColor}15, ${shape.accentColor}10)`,
            }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at center, ${shape.baseColor}20, transparent 70%)`,
              }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-4">
              {/* Shape preview */}
              <div className="mb-3 md:mb-4">
                <ShapePreview shape={shape} />
              </div>

              {/* Name */}
              <div className="text-center">
                <span className="text-2xl md:text-3xl mb-1 block">{shape.emoji}</span>
                <span className="text-sm md:text-base font-medium text-white/80">
                  {shape.name}
                </span>
              </div>

              {/* Piece count indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: shape.pieces[i].color }}
                  />
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 md:mt-12 text-center"
      >
        <p className="text-xs md:text-sm text-white/30 max-w-md">
          Cada cuerpo se puede desarmar en 4 piezas. 
          ¡Arrástralas para armarlos de nuevo!
        </p>
        <div className="flex items-center justify-center gap-4 mt-4 text-white/20 text-xs">
          <span>🧮 Suma</span>
          <span>📐 Volumen</span>
          <span>🔢 Conteo</span>
          <span>✋ Motricidad</span>
        </div>
      </motion.div>
    </div>
  );
}

// Shape preview component for the selection screen
function ShapePreview({ shape }: { shape: GeometricShape }) {
  const size = 80;

  switch (shape.id) {
    case 'cube':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <defs>
            <linearGradient id="cube-preview" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={shape.baseColor} />
              <stop offset="100%" stopColor={shape.accentColor} />
            </linearGradient>
          </defs>
          {/* Front face */}
          <rect x="10" y="25" width="45" height="45" fill={shape.baseColor} rx="2" />
          {/* Top face */}
          <polygon points="10,25 25,10 70,10 55,25" fill={shape.accentColor} />
          {/* Right face */}
          <polygon points="55,25 70,10 70,55 55,70" fill={shape.pieces[3].colorDark} />
          {/* Division lines */}
          <line x1="32" y1="25" x2="32" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="10" y1="47" x2="55" y2="47" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </svg>
      );

    case 'sphere':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <defs>
            <radialGradient id="sphere-preview" cx="40%" cy="35%">
              <stop offset="0%" stopColor={shape.accentColor} />
              <stop offset="100%" stopColor={shape.baseColor} />
            </radialGradient>
          </defs>
          <circle cx="40" cy="40" r="30" fill="url(#sphere-preview)" />
          {/* Division lines */}
          <line x1="40" y1="10" x2="40" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="10" y1="40" x2="70" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          {/* Highlight */}
          <circle cx="30" cy="30" r="8" fill="rgba(255,255,255,0.15)" />
        </svg>
      );

    case 'cylinder':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <defs>
            <linearGradient id="cyl-preview" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={shape.accentColor} />
              <stop offset="100%" stopColor={shape.baseColor} />
            </linearGradient>
          </defs>
          {/* Body */}
          <rect x="15" y="20" width="50" height="45" fill="url(#cyl-preview)" />
          {/* Top ellipse */}
          <ellipse cx="40" cy="20" rx="25" ry="10" fill={shape.accentColor} />
          {/* Bottom ellipse */}
          <ellipse cx="40" cy="65" rx="25" ry="10" fill={shape.pieces[3].colorDark} />
          {/* Division lines */}
          <line x1="40" y1="10" x2="40" y2="65" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="15" y1="42" x2="65" y2="42" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </svg>
      );

    case 'pyramid':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <defs>
            <linearGradient id="pyr-preview" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={shape.accentColor} />
              <stop offset="100%" stopColor={shape.baseColor} />
            </linearGradient>
          </defs>
          {/* Main triangle */}
          <polygon points="40,10 10,70 70,70" fill="url(#pyr-preview)" />
          {/* Layer lines */}
          <line x1="25" y1="40" x2="55" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="20" y1="50" x2="60" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="15" y1="60" x2="65" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          {/* Right face shading */}
          <polygon points="40,10 70,70 40,70" fill="rgba(0,0,0,0.15)" />
        </svg>
      );

    default:
      return null;
  }
}
