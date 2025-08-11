'use client'
import React, { useState } from 'react';
import { useDroppable, useDndMonitor, DragOverEvent } from '@dnd-kit/core';
import { Box, styled } from '@mui/material';
import { PlateIngredient } from '@/types/plate-ingredient';
import { describeArc, polarToCartesian } from '@/utils/plateUtils';

// Styled components
const PlateContainer = styled(Box)(({ theme }) => ({
  width: '320px',
  height: '320px',
  margin: '20px auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface PlateVisualizationProps {
  onDrop: (ingredient: PlateIngredient) => void;
  plateIngredients: PlateIngredient[];
  onRemoveIngredient: (index: number) => void;
}

const PlateVisualization: React.FC<PlateVisualizationProps> = ({ 
  onDrop, 
  plateIngredients, 
  onRemoveIngredient 
}) => {
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

  // Pie chart logic
  const cx = 150, cy = 150, r = 140;
  const N = plateIngredients.length;
  let currentAngle = 0;

  // Dynamic font size for label
  const labelFontSize = N > 4 ? 13 : 16;

  return (
    <PlateContainer ref={setNodeRef}>
      <svg 
        width={300} 
        height={300} 
        style={{ 
          borderRadius: '50%', 
          background: isOver ? '#e3f2fd' : '#f5f5f5', 
          border: isOver ? '2px dashed #1976d2' : '2px solid #e0e0e0', 
          transition: 'all 0.3s' 
        }}
        role="img"
        aria-label={`Plato con ${N} ingredientes`}
      >
        {N === 0 && (
          <text 
            x={150} 
            y={155} 
            textAnchor="middle" 
            fill="#bbb" 
            fontSize={22} 
            fontFamily="inherit"
          >
            Arrastra los ingredientes aquí
          </text>
        )}
        {plateIngredients.map((ingredient, i) => {
          const sliceAngle = 360 / N;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;
          // For single ingredient, create a full circle
          const path = N === 1 
            ? `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
            : describeArc(cx, cy, r, startAngle, endAngle);
          // For label position (middle of slice or center for single ingredient)
          const labelAngle = N === 1 ? 0 : startAngle + sliceAngle / 2;
          const labelPos = polarToCartesian(cx, cy, r * 0.6, labelAngle);
          // Position for the remove button (well inside the edge, at the center of the slice)
          const removeButtonPos = polarToCartesian(cx, cy, r * 0.85, labelAngle);
          currentAngle += sliceAngle;
          const hasImage = ingredient.imageUrl && !ingredient.imageUrl.includes('default-ingredient');

          // --- Improved label rotation logic by quarters ---
          let textRotation = 0;
          if (N > 1) {
            let normalizedAngle = labelAngle;
            while (normalizedAngle < 0) normalizedAngle += 360;
            while (normalizedAngle >= 360) normalizedAngle -= 360;

            // Outward incline for each quarter
            if (normalizedAngle >= 0 && normalizedAngle < 90) {
              // Q1: 0-90 (12 to 3)
              textRotation = Math.min(30, normalizedAngle); // gentle outward
            } else if (normalizedAngle >= 90 && normalizedAngle < 180) {
              // Q2: 90-180 (3 to 6)
              textRotation = Math.max(30, Math.min(60, normalizedAngle - 90 + 30));
            } else if (normalizedAngle >= 180 && normalizedAngle < 270) {
              // Q3: 180-270 (6 to 9)
              textRotation = Math.max(-60, Math.min(-30, -(normalizedAngle - 180 + 30)));
            } else {
              // Q4: 270-360 (9 to 12)
              textRotation = Math.max(-30, -(360 - normalizedAngle));
            }
          }
          // --- End improved label rotation logic by quarters ---

          // --- Break long names into two lines ---
          let nameLines: string[] = [ingredient.name];
          if (ingredient.name.length > 14 || ingredient.name.split(' ').length > 2) {
            // Try to split at the nearest space to the middle
            const words = ingredient.name.split(' ');
            if (words.length > 1) {
              const mid = Math.floor(words.length / 2);
              nameLines = [
                words.slice(0, mid).join(' '),
                words.slice(mid).join(' ')
              ];
            }
          }
          // --- End break lines ---

          return (
            <g 
              key={ingredient.name}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Define a unique clipPath for this slice */}
              {hasImage && (
                <defs>
                  <clipPath id={`slice-clip-${i}`}>
                    <path d={path} />
                  </clipPath>
                </defs>
              )}
              {/* Render the image filling the slice, clipped to the slice shape */}
              {hasImage && (
                <image
                  href={ingredient.imageUrl}
                  x={0}
                  y={0}
                  width={300}
                  height={300}
                  clipPath={`url(#slice-clip-${i})`}
                  preserveAspectRatio="xMidYMid slice"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              {/* Overlay the slice color for readability, semi-transparent if image present */}
              <path 
                d={path} 
                fill={ingredient.type.color} 
                stroke="#fff" 
                strokeWidth={2} 
                fillOpacity={hasImage ? 0.4 : 1} 
              />
              <text 
                x={N === 1 ? cx : labelPos.x} 
                y={N === 1 ? cy : labelPos.y + 6} 
                textAnchor="middle" 
                fill="#fff" 
                fontSize={labelFontSize} 
                fontFamily="inherit" 
                style={{ 
                  pointerEvents: 'none', 
                  fontWeight: 600, 
                  textShadow: '0 1px 4px #222, 0 0 2px #000' 
                }}
                transform={N > 1 ? `rotate(${textRotation} ${labelPos.x} ${labelPos.y + 6})` : undefined}
              >
                {nameLines.map((line, idx) => (
                  <tspan 
                    key={idx} 
                    x={N === 1 ? cx : labelPos.x} 
                    dy={idx === 0 ? 0 : labelFontSize + 2}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
              {/* Remove button, only show on hover */}
              {hoveredIndex === i && (
                <g
                  onClick={() => onRemoveIngredient(i)}
                  style={{ cursor: 'pointer' }}
                  transform={`translate(${removeButtonPos.x}, ${removeButtonPos.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Eliminar ${ingredient.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onRemoveIngredient(i);
                    }
                  }}
                >
                  <text
                    x={0}
                    y={7}
                    textAnchor="middle"
                    fill="#222"
                    fontSize={28}
                    fontWeight="bold"
                    style={{ userSelect: 'none' }}
                  >
                    ×
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </PlateContainer>
  );
};

export default PlateVisualization; 