'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Chip,
  Typography,
  styled,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { useDroppable, useDndMonitor, DragOverEvent } from '@dnd-kit/core';
import CloseIcon from '@mui/icons-material/Close';
import { PlateIngredient } from '@/types/plate-ingredient';
import { describeArc, polarToCartesian } from '@/utils/plateUtils';

export interface PlateCanvasProps {
  items: PlateIngredient[];
  onDrop: (ingredient: PlateIngredient) => void;
  onRemove: (index: number) => void;
  minCount?: number;
}

const PlateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 0),
}));

const Plate = styled(Paper)(({ theme }) => ({
  borderRadius: '50%',
  aspectRatio: '1 / 1',
  width: 'min(64vw, 360px)',
  maxWidth: 360,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px dashed ${theme.palette.divider}`,
  background: theme.palette.background.default,
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  
  '&[data-is-over="true"]': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    opacity: 0.9,
  },
  
  [theme.breakpoints.up('md')]: {
    width: 'min(42vw, 480px)',
    maxWidth: 480,
  },
}));

export const PlateCanvas: React.FC<PlateCanvasProps> = ({
  items,
  onDrop,
  onRemove,
  minCount = 3,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOver, setIsOver] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { setNodeRef } = useDroppable({
    id: 'plate',
  });

  useDndMonitor({
    onDragOver: (event: DragOverEvent) => {
      setIsOver(event.over?.id === 'plate');
    },
    onDragEnd: () => {
      setIsOver(false);
    },
  });

  const N = items.length;
  const isReady = N >= minCount;

  // SVG dimensions
  const svgSize = isMobile ? 280 : 360;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const r = (svgSize / 2) - 20;

  // Dynamic font size
  const labelFontSize = N > 4 ? (isMobile ? 11 : 13) : (isMobile ? 13 : 16);

  let currentAngle = 0;

  return (
    <PlateContainer>
      {/* Progress Chip */}
      <Chip
        label={isReady ? 'Listo para evaluar' : `${N}/${minCount} ingredientes`}
        color={isReady ? 'success' : 'default'}
        variant={isReady ? 'filled' : 'outlined'}
        size="small"
        sx={{
          fontWeight: 600,
          minHeight: '32px',
          fontSize: '0.875rem',
        }}
      />

      {/* Plate */}
      <Plate
        ref={setNodeRef}
        data-is-over={isOver}
        elevation={isOver ? 4 : 2}
        role="region"
        aria-label={`Plato con ${N} ingredientes`}
      >
        <svg
          width={svgSize}
          height={svgSize}
          style={{
            borderRadius: '50%',
          }}
        >
          {N === 0 && (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              fill={theme.palette.text.disabled}
              fontSize={isMobile ? 16 : 20}
              fontFamily={theme.typography.fontFamily}
            >
              Soltá ingredientes acá
            </text>
          )}
          
          {items.map((ingredient, i) => {
            const sliceAngle = 360 / N;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            currentAngle = endAngle;

            // Create the slice path
            const pathData = N === 1
              ? `M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
              : describeArc(cx, cy, r, startAngle, endAngle);

            // Calculate label position
            const labelAngle = (startAngle + endAngle) / 2;
            const labelRadius = r * 0.65;
            const labelPos = polarToCartesian(cx, cy, labelRadius, labelAngle);

            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {/* Slice */}
                <path
                  d={pathData}
                  fill={ingredient.type.color}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    cursor: 'pointer',
                    opacity: isHovered ? 0.8 : 1,
                    transition: 'opacity 0.2s',
                  }}
                  onClick={() => onRemove(i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                      onRemove(i);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Remover ${ingredient.name}`}
                />
                
                {/* Label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  fill="white"
                  fontSize={labelFontSize}
                  fontWeight="600"
                  fontFamily={theme.typography.fontFamily}
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    textTransform: 'capitalize',
                  }}
                >
                  {ingredient.name.length > 12
                    ? `${ingredient.name.substring(0, 12)}...`
                    : ingredient.name}
                </text>

                {/* Delete hint on hover */}
                {isHovered && (
                  <circle
                    cx={labelPos.x}
                    cy={labelPos.y - 20}
                    r={12}
                    fill="rgba(0,0,0,0.6)"
                    style={{ pointerEvents: 'none' }}
                  />
                )}
                {isHovered && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y - 16}
                    textAnchor="middle"
                    fill="white"
                    fontSize={16}
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                  >
                    ×
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </Plate>
    </PlateContainer>
  );
};
