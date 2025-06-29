import { Box, Typography } from '@mui/material';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

const GaugeChart = ({ value }: { value: number }) => {
  const data = [
    {
      name: 'Puntaje',
      value,
      fill:
        value < 5 ? '#f44336' :
        value < 7 ? '#ff9800' :
        '#4caf50',
    },
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="subtitle1" mb={1}>
        Puntuación del plato
      </Typography>

      <Box position="relative" width={300} height={150} sx={{ marginTop: '-80px' }}>
        <RadialBarChart
          width={300}
          height={150}
          cx="50%"
          cy="100%"
          innerRadius="80%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          barSize={20}
          data={data}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 10]}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={20}
          />
        </RadialBarChart>

        {/* Puntuación superpuesta */}
        <Box
          position="absolute"
          bottom={"-10px"}
          left="50%"
          sx={{ transform: 'translate(-50%, -20%)' }}
        >
          <Typography variant="h5" fontWeight="bold">
            {value}/10
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default GaugeChart;
