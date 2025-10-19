/**
 * Usage Examples for ActivityLevelField Component
 * 
 * This file demonstrates two common usage patterns:
 * 1. Plain controlled state with useState
 * 2. React Hook Form controlled field using Controller
 */

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Paper, Typography } from '@mui/material';
import ActivityLevelField, { ActivityLevel } from './ActivityLevelField';

// Example 1: Plain controlled state with useState
export function PlainStateExample() {
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>('');

  const handleSubmit = () => {
    console.log('Selected activity level:', activityLevel);
    // Handle form submission here
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Example 1: Plain State Management
      </Typography>
      
      <ActivityLevelField
        name="activityLevel"
        value={activityLevel}
        onChange={setActivityLevel}
        required
        helperText="Choose your current activity level"
      />
      
      <Box sx={{ mt: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!activityLevel}
        >
          Submit
        </Button>
      </Box>
      
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
        Current value: {activityLevel || 'None selected'}
      </Typography>
    </Paper>
  );
}

// Example 2: React Hook Form integration
interface FormData {
  activityLevel: ActivityLevel | '';
  name: string;
}

export function ReactHookFormExample() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      activityLevel: '',
      name: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
    // Handle form submission here
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Example 2: React Hook Form Integration
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="activityLevel"
          control={control}
          rules={{ required: 'Activity level is required' }}
          render={({ field }) => (
            <ActivityLevelField
              name="activityLevel"
              value={field.value}
              onChange={field.onChange}
              required
              errorText={errors.activityLevel?.message}
              helperText="Select your physical activity level"
            />
          )}
        />
        
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained">
            Submit Form
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

// Combined example showing both patterns
export default function ActivityLevelFieldExamples() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ActivityLevelField Usage Examples
      </Typography>
      
      <PlainStateExample />
      <ReactHookFormExample />
    </Box>
  );
}
