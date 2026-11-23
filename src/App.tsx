import { useState, useEffect, useRef, useCallback } from 'react';
import { planetsByEMField, getOrbitalSpeedFactor, getVisualOrbitRadius, getVisualPlanetSize, Planet } from './data/planets';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(planetsByEMField.map(() => Math.random() * Math.PI * 2));
  const starsRef = useRef<Star[]>([]);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const selectedPlanetRef = useRef(selectedPlanet);
  const hoveredPlanetRef = useRef(hoveredPlanet);

  // Keep refs in sync with state
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { selectedPlanetRef.current = selectedPlanet; }, [selectedPlanet]);
  useEffect(() => { hoveredPlanetRef.current = hoveredPlanet; }, [hoveredPlanet]);

  const CANVAS_W = 800;
  const CANVAS_H = 700;
  const centerX = CANVAS_W / 2;
  const centerY = CANVAS_H / 2;

  // Generate stars once
  useEffect(() => {
    starsRef.current = Array.from({ length: 250 }, () => ({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.7 + 0.2,
    }));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = '#060612';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Subtle radial gradient background
    const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 400);
    bgGrad.addColorStop(0, 'rgba(20, 10, 40, 0.5)');
    bgGrad.addColorStop(1, 'rgba(6, 6, 18, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Stars
    starsRef.current.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });

    // Orbit paths with EM field strength gradient
    planetsByEMField.forEach((planet, index) => {
      const orbitRadius = getVisualOrbitRadius(index, planetsByEMField.length);
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
      
      // Stronger EM field = brighter orbit line
      const emStrength = planet.magneticField > 0 ? Math.min(1, Math.log10(planet.magneticField + 1) / 5.2) : 0.02;
      ctx.strokeStyle = `rgba(${100 + emStrength * 155}, ${150 + emStrength * 105}, 255, ${0.06 + emStrength * 0.12})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Sun outer glow
    const sunGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 55);
    sunGlow.addColorStop(0, 'rgba(255, 220, 80, 0.9)');
    sunGlow.addColorStop(0.3, 'rgba(255, 160, 20, 0.6)');
    sunGlow.addColorStop(0.6, 'rgba(255, 80, 0, 0.2)');
    sunGlow.addColorStop(1, 'rgba(255, 50, 0, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
    ctx.fillStyle = sunGlow;
    ctx.fill();

    // Sun core
    const sunCore = ctx.createRadialGradient(centerX - 4, centerY - 4, 0, centerX, centerY, 20);
    sunCore.addColorStop(0, '#FFFDE7');
    sunCore.addColorStop(0.4, '#FFD54F');
    sunCore.addColorStop(0.8, '#FF8F00');
    sunCore.addColorStop(1, '#E65100');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = sunCore;
    ctx.fill();

    // Sun label
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 220, 100, 0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('Sol', centerX, centerY + 32);

    // Draw planets
    planetsByEMField.forEach((planet, index) => {
      const orbitRadius = getVisualOrbitRadius(index, planetsByEMField.length);
      const angle = anglesRef.current[index];
      const px = centerX + Math.cos(angle) * orbitRadius;
      const py = centerY + Math.sin(angle) * orbitRadius;
      const size = getVisualPlanetSize(planet.radius);
      const isSelected = selectedPlanetRef.current?.id === planet.id;
      const isHovered = hoveredPlanetRef.current === planet.id;

      // Magnetic field visualization (subtle aura)
      if (planet.magneticField > 0) {
        const emStrength = Math.min(1, Math.log10(planet.magneticField + 1) / 5.2);
        const auraSize = size + 4 + emStrength * 12;
        const auraGrad = ctx.createRadialGradient(px, py, size, px, py, auraSize);
        auraGrad.addColorStop(0, `rgba(100, 180, 255, ${emStrength * 0.15})`);
        auraGrad.addColorStop(1, 'rgba(100, 180, 255, 0)');
        ctx.beginPath();
        ctx.arc(px, py, auraSize, 0, Math.PI * 2);
        ctx.fillStyle = auraGrad;
        ctx.fill();
      }

      // Selection/hover glow
      if (isSelected || isHovered) {
        const glowGrad = ctx.createRadialGradient(px, py, size, px, py, size * 3);
        glowGrad.addColorStop(0, planet.color + '40');
        glowGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      // Planet body with 3D shading
      const planetGrad = ctx.createRadialGradient(
        px - size * 0.3, py - size * 0.3, size * 0.1,
        px, py, size
      );
      planetGrad.addColorStop(0, lightenColor(planet.color, 40));
      planetGrad.addColorStop(0.5, planet.color);
      planetGrad.addColorStop(1, darkenColor(planet.color, 40));

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.fill();

      // Saturn rings
      if (planet.id === 'saturn') {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(px, py, size * 2, size * 0.5, -0.3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(243, 213, 118, 0.5)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        // Inner ring
        ctx.beginPath();
        ctx.ellipse(px, py, size * 1.5, size * 0.38, -0.3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(220, 190, 100, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Selection ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(px, py, size + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Planet name label
      const showLabel = isSelected || isHovered || size > 8;
      if (showLabel) {
        ctx.font = `${isSelected || isHovered ? 'bold ' : ''}10px Inter, sans-serif`;
        ctx.fillStyle = isSelected || isHovered ? '#ffffff' : 'rgba(255,255,255,0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(planet.nameEs, px, py + size + 14);
      }
    });

    // EM field legend at bottom
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText('Órbitas ordenadas por intensidad de campo magnético (interior → exterior: mayor → menor)', centerX, CANVAS_H - 12);

  }, []);

  // Animation loop
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (isPlayingRef.current) {
        planetsByEMField.forEach((planet, index) => {
          const speedFactor = getOrbitalSpeedFactor(planet.orbitalSpeed);
          const angularVelocity = speedFactor * 0.4 * speedRef.current;
          anglesRef.current[index] += angularVelocity * delta;
        });
      }

      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  const getPlanetAtPosition = (x: number, y: number): Planet | null => {
    for (let i = planetsByEMField.length - 1; i >= 0; i--) {
      const planet = planetsByEMField[i];
      const orbitRadius = getVisualOrbitRadius(i, planetsByEMField.length);
      const angle = anglesRef.current[i];
      const px = centerX + Math.cos(angle) * orbitRadius;
      const py = centerY + Math.sin(angle) * orbitRadius;
      const size = getVisualPlanetSize(planet.radius);
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= size + 8) {
        return planet;
      }
    }
    return null;
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    const planet = getPlanetAtPosition(x, y);
    setSelectedPlanet(planet);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    const planet = getPlanetAtPosition(x, y);
    setHoveredPlanet(planet?.id || null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = planet ? 'pointer' : 'default';
    }
  };

  const randomizePositions = () => {
    anglesRef.current = planetsByEMField.map(() => Math.random() * Math.PI * 2);
  };

  return (
    <div className="min-h-screen bg-[#060612] text-white font-sans flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="px-4 md:px-6 py-3 md:py-4 border-b border-white/10 backdrop-blur-sm bg-black/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-blue-400 bg-clip-text text-transparent">
              ☀️ Sistema Solar Interactivo
            </h1>
            <p className="text-[10px] md:text-xs text-white/40 mt-0.5">
              Órbitas ordenadas por intensidad de campo electromagnético · Velocidades proporcionales a la masa
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
            <span className={`inline-block w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
            {isPlaying ? 'Simulando' : 'Pausado'}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-3 md:p-4 max-w-7xl mx-auto w-full">
        {/* Canvas area */}
        <div className="flex-1 flex flex-col items-center min-w-0">
          <div className="relative w-full" style={{ maxWidth: '800px' }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="w-full rounded-xl border border-white/10 shadow-2xl shadow-purple-900/20"
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setHoveredPlanet(null)}
            />
          </div>

          {/* Controls */}
          <div className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-medium text-xs md:text-sm transition-all ${
                isPlaying
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
              }`}
            >
              {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
            </button>

            <div className="flex items-center gap-1 md:gap-2 bg-white/5 rounded-lg px-3 md:px-4 py-2 border border-white/10">
              <span className="text-[10px] md:text-xs text-white/50 whitespace-nowrap">Velocidad:</span>
              {[0.25, 0.5, 1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-[10px] md:text-xs font-medium transition-all ${
                    speed === s
                      ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>

            <button
              onClick={randomizePositions}
              className="px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all"
            >
              🔄 Aleatorizar
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:w-80 w-full flex-shrink-0">
          {selectedPlanet ? (
            <PlanetInfoPanel planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
          ) : (
            <DefaultPanel onSelectPlanet={setSelectedPlanet} />
          )}
        </div>
      </main>
    </div>
  );
}

// Default Panel (no planet selected)
function DefaultPanel({ onSelectPlanet }: { onSelectPlanet: (p: Planet) => void }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 md:p-6 backdrop-blur-sm">
      <h3 className="text-base md:text-lg font-semibold text-white/90 mb-2">🪐 Sistema Solar</h3>
      <p className="text-xs md:text-sm text-white/50 leading-relaxed mb-4">
        Haz clic en cualquier planeta para ver información detallada. Las órbitas están ordenadas por la potencia del campo magnético planetario.
      </p>

      <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 mb-4">
        <p className="text-[10px] md:text-xs text-indigo-300/80 leading-relaxed">
          💡 <strong>Orden EM:</strong> De mayor a menor campo magnético (interior → exterior). Las velocidades orbitales reflejan las velocidades reales (los planetas más masivos/lejanos se mueven más lento según las leyes de Kepler).
        </p>
      </div>

      {/* Planet list */}
      <div className="space-y-0.5">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Orden por campo magnético:</p>
        {planetsByEMField.map((planet, i) => (
          <button
            key={planet.id}
            onClick={() => onSelectPlanet(planet)}
            className="w-full flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg text-left text-xs md:text-sm hover:bg-white/5 transition-all group"
          >
            <span className="text-[10px] text-white/20 w-4">{i + 1}</span>
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
              style={{ backgroundColor: planet.color }}
            ></span>
            <span className="text-white/70 group-hover:text-white/90 transition-colors">{planet.nameEs}</span>
            <span className="ml-auto text-[10px] text-white/20 hidden sm:inline">
              {planet.magneticField > 0 ? `${planet.magneticField.toExponential(1)}` : 'Nulo'}
            </span>
          </button>
        ))}
      </div>

      {/* Mass comparison */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Masa relativa:</p>
        <div className="space-y-1">
          {planetsByEMField.map((planet) => {
            const maxMass = 1898; // Jupiter
            const width = Math.max(2, (planet.mass / maxMass) * 100);
            return (
              <div key={planet.id} className="flex items-center gap-2">
                <span className="text-[9px] text-white/40 w-12 truncate">{planet.nameEs}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${width}%`, backgroundColor: planet.color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Planet Info Panel
function PlanetInfoPanel({ planet, onClose }: { planet: Planet; onClose: () => void }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 md:p-6 backdrop-blur-sm animate-fadeIn">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex-shrink-0"
            style={{ background: planet.gradient }}
          ></div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white">{planet.nameEs}</h2>
            <p className="text-[10px] md:text-xs text-white/40">{planet.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/80 transition-colors p-1 text-lg"
        >
          ✕
        </button>
      </div>

      <p className="text-xs md:text-sm text-white/60 leading-relaxed mb-4">{planet.description}</p>

      <div className="space-y-2 md:space-y-2.5">
        <InfoRow label="Radio" value={`${planet.radius.toLocaleString()} km`} icon="📏" />
        <InfoRow label="Masa" value={`${planet.mass} × 10²⁴ kg`} icon="⚖️" />
        <InfoRow label="Distancia al Sol" value={`${planet.distanceFromSun} M km`} icon="📐" />
        <InfoRow label="Período orbital" value={`${planet.orbitalPeriod.toLocaleString()} días`} icon="🔄" />
        <InfoRow label="Velocidad orbital" value={`${planet.orbitalSpeed} km/s`} icon="🚀" />

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-start gap-2">
            <span className="text-sm flex-shrink-0">🧲</span>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Campo Magnético</p>
              <p className="text-xs md:text-sm text-white/80 font-medium">
                {planet.magneticField > 0
                  ? `${planet.magneticField} × 10¹² T·m³`
                  : 'Sin campo global'}
              </p>
              <p className="text-[10px] md:text-xs text-white/50 mt-1 leading-relaxed">{planet.magneticFieldNote}</p>
            </div>
          </div>
        </div>
      </div>

      {/* EM Field strength bar */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-[10px] text-white/40 mb-1.5">Intensidad del campo EM (escala logarítmica)</p>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${planet.magneticField > 0 ? Math.min(100, (Math.log10(planet.magneticField + 1) / Math.log10(155001)) * 100) : 1}%`,
              background: planet.gradient,
            }}
          ></div>
        </div>
      </div>

      {/* Speed comparison */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-[10px] text-white/40 mb-1.5">Velocidad orbital relativa</p>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
            style={{ width: `${(planet.orbitalSpeed / 47.87) * 100}%` }}
          ></div>
        </div>
        <p className="text-[9px] text-white/30 mt-1">
          {planet.orbitalSpeed > 30 ? '⚡ Alta velocidad (cercano al Sol)' :
           planet.orbitalSpeed > 15 ? '🌀 Velocidad media' :
           '🐢 Baja velocidad (lejano del Sol)'}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm flex-shrink-0">{icon}</span>
      <span className="text-[10px] md:text-xs text-white/40 w-24 md:w-28 flex-shrink-0">{label}:</span>
      <span className="text-xs md:text-sm text-white/80 font-medium">{value}</span>
    </div>
  );
}

// Utility functions
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `rgb(${R},${G},${B})`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `rgb(${R},${G},${B})`;
}
