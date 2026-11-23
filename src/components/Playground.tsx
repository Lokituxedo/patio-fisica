import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeometricShape, ShapePiece } from '../data/shapes';
import { ShapePieceRenderer, CompleteShapeOutline } from './ShapePieceRenderer';
import { useSound } from '../hooks/useSound';

interface PlaygroundProps {
  shape: GeometricShape;
  onBack: () => void;
}

type GamePhase = 'assembled' | 'scattered' | 'playing';

interface PieceState {
  id: string;
  x: number;
  y: number;
  isPlaced: boolean;
}

export default function Playground({ shape, onBack }: PlaygroundProps) {
  const [phase, setPhase] = useState<GamePhase>('assembled');
  const [pieces, setPieces] = useState<PieceState[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [showMathHint, setShowMathHint] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  // Initialize pieces in assembled position
  useEffect(() => {
    setPieces(
      shape.pieces.map((p) => ({
        id: p.id,
        x: p.targetX,
        y: p.targetY,
        isPlaced: true,
      }))
    );
  }, [shape]);

  const placedCount = pieces.filter((p) => p.isPlaced).length;
  const totalCount = pieces.length;
  const allPlaced = placedCount === totalCount;

  // Disassemble: scatter pieces
  const handleDisassemble = useCallback(() => {
    play('whoosh');
    setPhase('scattered');
    setCelebrating(false);
    
    const newPieces = shape.pieces.map((p) => ({
      id: p.id,
      x: p.scatterX + (Math.random() * 40 - 20),
      y: p.scatterY + (Math.random() * 40 - 20),
      isPlaced: false,
    }));
    
    // Animate scatter with delay
    setTimeout(() => {
      setPieces(newPieces);
      setPhase('playing');
    }, 100);
  }, [shape, play]);

  // Check if piece is near its target
  const checkSnap = useCallback(
    (pieceId: string, x: number, y: number): boolean => {
      const pieceData = shape.pieces.find((p) => p.id === pieceId);
      if (!pieceData) return false;
      
      const SNAP_DISTANCE = 60; // Large snap area for neurodivergent children
      const dx = x - pieceData.targetX;
      const dy = y - pieceData.targetY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance < SNAP_DISTANCE;
    },
    [shape]
  );

  // Handle piece drag end
  const handleDragEnd = useCallback(
    (pieceId: string, x: number, y: number) => {
      setDraggingId(null);
      
      if (checkSnap(pieceId, x, y)) {
        // Snap to target
        const pieceData = shape.pieces.find((p) => p.id === pieceId)!;
        play('snap');
        
        setPieces((prev) =>
          prev.map((p) =>
            p.id === pieceId
              ? { ...p, x: pieceData.targetX, y: pieceData.targetY, isPlaced: true }
              : p
          )
        );

        // Show math hint
        const newCount = pieces.filter((p) => p.isPlaced).length + 1;
        if (newCount <= totalCount) {
          setShowMathHint(`${newCount - 1} + 1 = ${newCount}`);
          setTimeout(() => setShowMathHint(null), 1500);
        }

        // Check if all placed
        if (newCount === totalCount) {
          setTimeout(() => {
            play('complete');
            setCelebrating(true);
          }, 300);
        }
      } else {
        // Drop in place
        play('drop');
        setPieces((prev) =>
          prev.map((p) => (p.id === pieceId ? { ...p, x, y, isPlaced: false } : p))
        );
      }
    },
    [checkSnap, shape, pieces, totalCount, play]
  );

  // Handle piece drag start
  const handleDragStart = useCallback(
    (pieceId: string) => {
      play('pickup');
      setDraggingId(pieceId);
      
      // If piece was placed, unplace it
      const piece = pieces.find((p) => p.id === pieceId);
      if (piece?.isPlaced) {
        const newCount = placedCount - 1;
        if (newCount >= 0) {
          setShowMathHint(`${placedCount} - 1 = ${newCount}`);
          setTimeout(() => setShowMathHint(null), 1500);
        }
        setPieces((prev) =>
          prev.map((p) => (p.id === pieceId ? { ...p, isPlaced: false } : p))
        );
        setCelebrating(false);
      }
    },
    [pieces, placedCount, play]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a3e] via-[#151530] to-[#0d0d20] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-white/70 hover:text-white"
        >
          <span className="text-lg">←</span>
          <span className="text-sm hidden sm:inline">Volver</span>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl">{shape.emoji}</span>
          <span className="text-white/80 font-medium text-sm md:text-base">{shape.name}</span>
        </div>

        {/* Piece counter */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10">
          {Array.from({ length: totalCount }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                i < placedCount
                  ? 'bg-green-400 scale-110 shadow-lg shadow-green-400/30'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Math hint */}
      <AnimatePresence>
        {showMathHint && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="px-6 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl">
              <span className="text-xl md:text-2xl font-bold text-white/90">{showMathHint}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main playground area */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden mx-3 md:mx-4 rounded-2xl bg-white/[0.02] border border-white/5"
      >
        {/* Assembly area outline */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <CompleteShapeOutline shapeId={shape.id} />
        </div>

        {/* Pieces */}
        {shape.pieces.map((pieceData, index) => {
          const pieceState = pieces.find((p) => p.id === pieceData.id);
          if (!pieceState) return null;

          const isDragging = draggingId === pieceData.id;

          return (
            <motion.div
              key={pieceData.id}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
              }}
              animate={{
                x: pieceState.x - (pieceData.width / 2),
                y: pieceState.y - (pieceData.height / 2),
                scale: isDragging ? 1.1 : 1,
                zIndex: isDragging ? 50 : pieceState.isPlaced ? 1 : 10 + index,
                rotate: phase === 'scattered' && !pieceState.isPlaced ? (Math.random() * 20 - 10) : 0,
              }}
              transition={{
                type: pieceState.isPlaced ? 'spring' : 'tween',
                stiffness: pieceState.isPlaced ? 300 : 200,
                damping: pieceState.isPlaced ? 25 : 20,
                duration: isDragging ? 0 : 0.5,
              }}
              drag={!pieceState.isPlaced || phase === 'playing'}
              dragMomentum={false}
              onDragStart={() => handleDragStart(pieceData.id)}
              onDragEnd={(e) => {
                const el = e.target as HTMLElement;
                const container = containerRef.current;
                if (!container) return;
                
                const rect = container.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Get current position from transform
                const transform = el.style.transform;
                const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                let currentX = pieceState.x;
                let currentY = pieceState.y;
                
                if (match) {
                  currentX = parseFloat(match[1]);
                  currentY = parseFloat(match[2]);
                }
                
                handleDragEnd(pieceData.id, currentX, currentY);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`transition-shadow duration-200 ${
                  isDragging ? 'drop-shadow-2xl' : pieceState.isPlaced ? 'drop-shadow-md' : 'drop-shadow-lg'
                }`}
              >
                <ShapePieceRenderer
                  piece={pieceData}
                  shapeId={shape.id}
                  isAssembled={pieceState.isPlaced}
                />
              </div>
            </motion.div>
          );
        })}

        {/* Celebration overlay */}
        <AnimatePresence>
          {celebrating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="text-5xl md:text-7xl mb-4">🎉</div>
                <div className="text-xl md:text-2xl font-bold text-white/90">
                  ¡{totalCount} piezas!
                </div>
                <div className="text-sm md:text-base text-white/60 mt-2">
                  {shape.pieces.map((_, i) => i + 1).join(' + ')} = {totalCount}
                </div>
              </motion.div>

              {/* Floating particles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: shape.pieces[i % 4]?.color || '#fff',
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 12) * 150,
                    y: Math.sin((i * Math.PI * 2) / 12) * 150,
                    opacity: 0,
                    scale: [0, 1.5, 0],
                  }}
                  transition={{ duration: 1.5, delay: i * 0.05, ease: 'easeOut' }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-3 md:p-4 flex justify-center gap-3">
        {phase === 'assembled' && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleDisassemble}
            className="px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold text-base md:text-lg shadow-lg shadow-orange-400/20 hover:shadow-orange-400/40 transition-shadow active:scale-95"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">💥</span>
              ¡Desarmar!
            </span>
          </motion.button>
        )}

        {(phase === 'playing' || phase === 'scattered') && !allPlaced && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-2 rounded-xl bg-white/10 text-white/60 text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="animate-bounce">👆</span>
              Arrastra las piezas al centro
            </span>
          </motion.div>
        )}

        {celebrating && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={handleDisassemble}
            className="px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-bold text-base md:text-lg shadow-lg shadow-purple-400/20 hover:shadow-purple-400/40 transition-shadow active:scale-95"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">🔄</span>
              ¡Otra vez!
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
