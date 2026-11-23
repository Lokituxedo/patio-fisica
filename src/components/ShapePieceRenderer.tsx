import { ShapePiece } from '../data/shapes';

interface ShapePieceRendererProps {
  piece: ShapePiece;
  shapeId: string;
  isAssembled: boolean;
}

export function ShapePieceRenderer({ piece, shapeId, isAssembled }: ShapePieceRendererProps) {
  const { color, colorLight, colorDark, width, height, rotation } = piece;

  switch (shapeId) {
    case 'cube':
      return <CubePiece piece={piece} isAssembled={isAssembled} />;
    case 'sphere':
      return <SpherePiece piece={piece} isAssembled={isAssembled} />;
    case 'cylinder':
      return <CylinderPiece piece={piece} isAssembled={isAssembled} />;
    case 'pyramid':
      return <PyramidPiece piece={piece} isAssembled={isAssembled} />;
    default:
      return null;
  }
}

// CUBE PIECE - Isometric rectangular prism
function CubePiece({ piece, isAssembled }: { piece: ShapePiece; isAssembled: boolean }) {
  const { color, colorLight, colorDark } = piece;
  const w = 70;
  const h = 70;
  const d = 20; // depth for isometric effect

  return (
    <svg width={w + d} height={h + d} viewBox={`0 0 ${w + d} ${h + d}`}>
      {/* Top face */}
      <polygon
        points={`${d},0 ${w + d},0 ${w},${d} 0,${d}`}
        fill={colorLight}
        stroke={colorDark}
        strokeWidth="1"
      />
      {/* Right face */}
      <polygon
        points={`${w},${d} ${w + d},0 ${w + d},${h} ${w},${h + d}`}
        fill={colorDark}
        stroke={colorDark}
        strokeWidth="1"
      />
      {/* Front face */}
      <rect
        x={0}
        y={d}
        width={w}
        height={h}
        fill={color}
        stroke={colorDark}
        strokeWidth="1"
      />
      {/* Subtle inner highlight */}
      <rect
        x={5}
        y={d + 5}
        width={w - 10}
        height={h - 10}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        rx="2"
      />
    </svg>
  );
}

// SPHERE PIECE - Wedge/gore shape
function SpherePiece({ piece }: { piece: ShapePiece; isAssembled: boolean }) {
  const { color, colorLight, colorDark, rotation } = piece;
  const size = 80;
  const cx = size / 2;
  const cy = size / 2;
  const r = 35;

  // Create a wedge shape (like an orange slice)
  const startAngle = (rotation * Math.PI) / 180;
  const endAngle = startAngle + (Math.PI / 2); // 90 degree wedge

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`sphere-grad-${piece.id}`} cx="40%" cy="40%">
          <stop offset="0%" stopColor={colorLight} />
          <stop offset="70%" stopColor={color} />
          <stop offset="100%" stopColor={colorDark} />
        </radialGradient>
      </defs>
      <path
        d={path}
        fill={`url(#sphere-grad-${piece.id})`}
        stroke={colorDark}
        strokeWidth="1.5"
      />
      {/* Highlight */}
      <circle cx={cx - 8} cy={cy - 8} r={6} fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

// CYLINDER PIECE - Sector of cylinder
function CylinderPiece({ piece }: { piece: ShapePiece; isAssembled: boolean }) {
  const { color, colorLight, colorDark, rotation } = piece;
  const w = 75;
  const h = 90;
  const cx = w / 2;
  const cy = h / 2;
  const rx = 30;
  const ry = 12;

  // Create a sector shape (like a pie slice viewed from above, with height)
  const startAngle = (rotation * Math.PI) / 180;
  const endAngle = startAngle + (Math.PI / 2);

  const x1 = cx + rx * Math.cos(startAngle);
  const y1 = cy + ry * Math.sin(startAngle);
  const x2 = cx + rx * Math.cos(endAngle);
  const y2 = cy + ry * Math.sin(endAngle);

  const sectorHeight = 35;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`cyl-grad-${piece.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorLight} />
          <stop offset="100%" stopColor={colorDark} />
        </linearGradient>
      </defs>
      {/* Side face */}
      <path
        d={`M ${cx} ${cy} L ${x1} ${y1} L ${x1} ${y1 + sectorHeight} L ${cx} ${cy + sectorHeight} Z`}
        fill={color}
        stroke={colorDark}
        strokeWidth="1"
      />
      {/* Curved outer face */}
      <path
        d={`M ${x1} ${y1} A ${rx} ${ry} 0 0 1 ${x2} ${y2} L ${x2} ${y2 + sectorHeight} A ${rx} ${ry} 0 0 0 ${x1} ${y1 + sectorHeight} Z`}
        fill={`url(#cyl-grad-${piece.id})`}
        stroke={colorDark}
        strokeWidth="1"
      />
      {/* Other side face */}
      <path
        d={`M ${cx} ${cy} L ${x2} ${y2} L ${x2} ${y2 + sectorHeight} L ${cx} ${cy + sectorHeight} Z`}
        fill={colorDark}
        stroke={colorDark}
        strokeWidth="1"
      />
      {/* Top face */}
      <path
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${rx} ${ry} 0 0 1 ${x2} ${y2} Z`}
        fill={colorLight}
        stroke={colorDark}
        strokeWidth="1"
      />
    </svg>
  );
}

// PYRAMID PIECE - Layer/trapezoid
function PyramidPiece({ piece }: { piece: ShapePiece; isAssembled: boolean }) {
  const { color, colorLight, colorDark, width: pw, height: ph } = piece;
  const w = pw + 20; // extra for isometric depth
  const h = ph + 10;
  const d = 12;

  return (
    <svg width={w + d} height={h + d} viewBox={`0 0 ${w + d} ${h + d}`}>
      {/* Top face */}
      <polygon
        points={`${d},0 ${pw + d},0 ${pw},${d} 0,${d}`}
        fill={colorLight}
        stroke={colorDark}
        strokeWidth="1"
      />
      {/* Right face */}
      <polygon
        points={`${pw},${d} ${pw + d},0 ${pw + d},${h} ${pw},${h + d}`}
        fill={colorDark}
        stroke={colorDark}
        strokeWidth="1"
      />
      {/* Front face */}
      <rect
        x={0}
        y={d}
        width={pw}
        height={h}
        fill={color}
        stroke={colorDark}
        strokeWidth="1"
      />
    </svg>
  );
}

// Complete shape outline for the assembly area
export function CompleteShapeOutline({ shapeId }: { shapeId: string }) {
  switch (shapeId) {
    case 'cube':
      return (
        <svg width="160" height="160" viewBox="0 0 160 160" className="opacity-20">
          <rect x="10" y="30" width="120" height="120" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 4" rx="4" />
          <polygon points="10,30 30,10 150,10 130,30" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 4" />
          <polygon points="130,30 150,10 150,130 130,150" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 4" />
        </svg>
      );
    case 'sphere':
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-20">
          <circle cx="60" cy="60" r="50" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 4" />
          <line x1="60" y1="10" x2="60" y2="110" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          <line x1="10" y1="60" x2="110" y2="60" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        </svg>
      );
    case 'cylinder':
      return (
        <svg width="120" height="140" viewBox="0 0 120 140" className="opacity-20">
          <ellipse cx="60" cy="25" rx="45" ry="18" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 4" />
          <line x1="15" y1="25" x2="15" y2="115" stroke="white" strokeWidth="2" strokeDasharray="8 4" />
          <line x1="105" y1="25" x2="105" y2="115" stroke="white" strokeWidth="2" strokeDasharray="8 4" />
          <ellipse cx="60" cy="115" rx="45" ry="18" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 4" />
        </svg>
      );
    case 'pyramid':
      return (
        <svg width="160" height="150" viewBox="0 0 160 150" className="opacity-20">
          <polygon points="80,10 10,140 150,140" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 4" />
          <line x1="80" y1="10" x2="80" y2="140" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
}
