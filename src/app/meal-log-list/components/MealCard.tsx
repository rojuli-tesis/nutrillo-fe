'use client';

import React from 'react';
import { Card, Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { translateMealType } from '../helpers';
import { MealLog } from '@/types/meals';

const MealCard = ({ log }: { log: MealLog }) => {
  const hasImage = !!log.photoUrl;

  return (
    <Card
      key={log._id}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        minHeight: 100,
        p: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="subtitle1">{translateMealType(log.mealType)}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
        {!hasImage && (
          <Button variant="outlined" size="small" href={`/meal-log-details/${log._id}`}>
            Ver
          </Button>
        )}
      </Box>
      {hasImage && (
        <Box
          sx={{
            position: 'relative',
            width: '50%',
            minWidth: 100,
            height: '100%',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={log.photoUrl}
            alt="Meal"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Gradient overlay on the left edge */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40%',
              height: '100%',
              background: 'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(255,255,255,0.8) 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* Detail button overlays image */}
          <Button
            variant="contained"
            size="small"
            href={`/meal-log-details/${log._id}`}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              minWidth: 0,
              p: 1,
              borderRadius: '50%',
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default MealCard;