import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mui/material';

interface DraggableIngredientProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  onKeyboardAdd?: () => void;
}

const DraggableIngredient: React.FC<DraggableIngredientProps> = ({ 
  id, 
  children, 
  disabled = false,
  onKeyboardAdd,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      type: 'ingredient',
      name: id,
    },
    disabled,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onKeyboardAdd && !disabled) {
      e.preventDefault();
      onKeyboardAdd();
    }
  };

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        minWidth: '44px',
        minHeight: '44px',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
        },
      }}
      aria-label={`Arrastrar ${id} o presionar Enter para agregar`}
      role="button"
    >
      {children}
    </Box>
  );
};

export default DraggableIngredient; 