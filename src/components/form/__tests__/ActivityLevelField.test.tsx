import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/theme';
import ActivityLevelField from '../ActivityLevelField';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ActivityLevelField', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all activity level options', () => {
    renderWithTheme(
      <ActivityLevelField
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Sedentario')).toBeInTheDocument();
    expect(screen.getByText('1–3 días/semana')).toBeInTheDocument();
    expect(screen.getByText('3–5 días/semana')).toBeInTheDocument();
    expect(screen.getByText('Alta intensidad')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', () => {
    renderWithTheme(
      <ActivityLevelField
        value=""
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Sedentario'));
    expect(mockOnChange).toHaveBeenCalledWith('sedentary');
  });

  it('shows selected state correctly', () => {
    renderWithTheme(
      <ActivityLevelField
        value="moderate"
        onChange={mockOnChange}
      />
    );

    const moderateButton = screen.getByText('3–5 días/semana');
    expect(moderateButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('displays error text when provided', () => {
    renderWithTheme(
      <ActivityLevelField
        value=""
        onChange={mockOnChange}
        errorText="This field is required"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    renderWithTheme(
      <ActivityLevelField
        value=""
        onChange={mockOnChange}
        helperText="Choose your activity level"
      />
    );

    expect(screen.getByText('Choose your activity level')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    renderWithTheme(
      <ActivityLevelField
        value=""
        onChange={mockOnChange}
        disabled
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});
