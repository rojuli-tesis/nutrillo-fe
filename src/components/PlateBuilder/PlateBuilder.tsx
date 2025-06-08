'use client'
import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  useDroppable, 
  DragOverlay,
  useDndMonitor,
  DragOverEvent
} from '@dnd-kit/core';
import { Box, Paper, Typography, styled, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DraggableIngredient from './DraggableIngredient';
import { PlateIngredient } from '@/types/plate-ingredient';
import { describeArc, polarToCartesian } from '@/utils/plateUtils';
import { getUniqueTypes, getFilteredSubtypes, filterIngredients } from './helper';

// Styled components
const PlateContainer = styled(Box)(({ theme }) => ({
  width: '320px',
  height: '320px',
  margin: '20px auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// DropZone as a pie chart
const DropZone: React.FC<{
  onDrop: (ingredient: PlateIngredient) => void;
  plateIngredients: PlateIngredient[];
  onRemoveIngredient: (index: number) => void;
}> = ({ onDrop, plateIngredients, onRemoveIngredient }) => {
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
      <svg width={300} height={300} style={{ borderRadius: '50%', background: isOver ? '#e3f2fd' : '#f5f5f5', border: isOver ? '2px dashed #1976d2' : '2px solid #e0e0e0', transition: 'all 0.3s' }}>
        {N === 0 && (
          <text x={150} y={155} textAnchor="middle" fill="#bbb" fontSize={22} fontFamily="inherit">Arrastra los ingredientes aquí</text>
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

          // --- Improved label rotation logic ---
          let textRotation = 0;
          if (N > 4 && N !== 1) {
            // Keep labels mostly horizontal, flip for left side
            if (labelAngle > 90 && labelAngle < 270) {
              textRotation = labelAngle + 180;
            } else {
              textRotation = labelAngle;
            }
            // Clamp rotation to -60 to 60 for readability
            if (textRotation > 180) textRotation -= 360;
            if (textRotation < -60) textRotation = -60;
            if (textRotation > 60) textRotation = 60;
          }
          // --- End improved label rotation logic ---

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
            <g key={ingredient.name}
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
              <path d={path} fill={ingredient.type.color} stroke="#fff" strokeWidth={2} fillOpacity={hasImage ? 0.4 : 1} />
              <text 
                x={N === 1 ? cx : labelPos.x} 
                y={N === 1 ? cy : labelPos.y + 6} 
                textAnchor="middle" 
                fill="#fff" 
                fontSize={labelFontSize} 
                fontFamily="inherit" 
                style={{ pointerEvents: 'none', fontWeight: 600, textShadow: '0 1px 4px #222, 0 0 2px #000' }}
                transform={N > 1 ? `rotate(${labelAngle - 90} ${labelPos.x} ${labelPos.y + 6})` : undefined}
              >
                {nameLines.map((line, idx) => (
                  <tspan key={idx} x={N === 1 ? cx : labelPos.x} dy={idx === 0 ? 0 : labelFontSize + 2}>
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

const PlateBuilder: React.FC<{
  plateIngredients: PlateIngredient[];
}> = ({
  plateIngredients
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<PlateIngredient[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get types and subtypes using helper functions
  const types = getUniqueTypes(plateIngredients);
  const subtypes = getFilteredSubtypes(plateIngredients, selectedType);
  const filteredIngredients = filterIngredients(plateIngredients, selectedType, selectedSubtype);

  // Reset subtype when type changes
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setSelectedSubtype('all');
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'plate') {
      const ingredient = plateIngredients.find(ing => ing.name === active.id);
      if (ingredient) {
        setSelectedIngredients(prev => [...prev, ingredient]);
      }
    }
    
    setActiveId(null);
  };

  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ p: 3 }}>
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <DropZone 
          onDrop={(ingredient) => setSelectedIngredients(prev => [...prev, ingredient])}
          plateIngredients={selectedIngredients}
          onRemoveIngredient={handleRemoveIngredient}
        />

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={selectedType}
              label="Tipo"
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              {types.map(type => (
                <MenuItem key={type} value={type}>
                  {type === 'all' ? 'Todos' : type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Subtipo</InputLabel>
            <Select
              value={selectedSubtype}
              label="Subtipo"
              onChange={(e) => setSelectedSubtype(e.target.value)}
              disabled={selectedType === 'all'}
            >
              {subtypes.map(subtype => (
                <MenuItem key={subtype} value={subtype}>
                  {subtype === 'all' ? 'Todos' : subtype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Ingredients List */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            Ingredientes 
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {filteredIngredients.map((ingredient) => (
              <DraggableIngredient 
                key={ingredient.name} 
                id={ingredient.name}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: ingredient.type.color,
                    fontSize: '14px',
                    padding: 0,
                    borderRadius: '4px',
                    color: 'white',
                    height: 48,
                    minWidth: 120,
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ flex: 1, px: 2, py: 1, textAlign: 'left', whiteSpace: 'nowrap', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ingredient.name}
                  </Box>
                  {!ingredient.imageUrl?.includes('default-ingredient') && (
                    <Box
                      component="img"
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      sx={{
                        height: '100%',
                        width: 40,
                        objectFit: 'cover',
                        borderRadius: '0 4px 4px 0',
                        display: 'block',
                      }}
                    />
                  )}
                </Box>
              </DraggableIngredient>
            ))}
          </Box>
        </Box>

        <DragOverlay>
          {activeId ? (
            <Paper
              sx={{
                padding: '10px 20px',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              {activeId}
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
};

export default PlateBuilder; 