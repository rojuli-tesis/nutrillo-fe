import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Ingredient = styled(Paper)(({ theme }) => ({
  cursor: 'grab',
  userSelect: 'none',
  touchAction: 'none',
  '&[data-dragging="true"]': {
    opacity: 0.5,
    cursor: 'grabbing',
  },
  '&[data-disabled="true"]': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

interface DraggableIngredientProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const DraggableIngredient: React.FC<DraggableIngredientProps> = ({ id, children, disabled = false }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      type: 'ingredient',
      name: children,
    },
    disabled,
  });

  return (
    <Ingredient
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-dragging={isDragging}
      data-disabled={disabled}
      elevation={isDragging ? 6 : 2}
    >
      {children}
    </Ingredient>
  );
};

export default DraggableIngredient; 