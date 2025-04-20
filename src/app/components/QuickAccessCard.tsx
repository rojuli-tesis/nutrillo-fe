import React from 'react';
import { Card, Box, Typography, IconButton, useTheme, alpha } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  onClick: () => void;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
}) => {
  const theme = useTheme();
  const gradient = `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`;

  return (
    <Card
      onClick={onClick}
      sx={{
        background: gradient,
        borderRadius: { xs: 2, sm: 3 },
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'transparent',
        height: 0,
        paddingTop: '100%',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: alpha(color, 0.2),
          boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1.5, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: { xs: 48, sm: 80 },
            height: { xs: 48, sm: 80 },
            borderRadius: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            background: alpha(color, 0.1),
            mb: { xs: 1.5, sm: 2.5 },
          }}
        >
          {React.cloneElement(icon, {
            sx: { fontSize: { xs: 28, sm: 40 } }
          })}
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: { xs: 0.5, sm: 1 },
            color: 'text.primary',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            textAlign: 'center',
            maxWidth: '85%',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            display: { xs: 'none', sm: 'block' }
          }}
        >
          {description}
        </Typography>
        <IconButton
          size="small"
          sx={{
            color: color,
            position: 'absolute',
            bottom: { xs: 8, sm: 12 },
            right: { xs: 8, sm: 12 },
            padding: { xs: '4px', sm: '8px' },
            '& svg': {
              fontSize: { xs: '1rem', sm: '1.25rem' }
            },
            '&:hover': {
              background: alpha(color, 0.1),
            }
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Card>
  );
}; 