import { useState, useEffect } from 'react';
import restClient from '@/utils/restClient';

interface RegistrationStep {
  stepName: string;
  [key: string]: any;
}

interface Registration {
  userId: string;
  information: RegistrationStep[];
  lastStep: string;
  finished: boolean;
  notes?: string;
}

export const useRegistrationData = () => {
  const [registrationData, setRegistrationData] = useState<Registration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await restClient.get<Registration>('/registration');
        setRegistrationData(data);
      } catch (err) {
        console.error('Error fetching registration data:', err);
        setError('Failed to load registration data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrationData();
  }, []);

  const getStepData = (stepName: string) => {
    if (!registrationData) return null;
    
    return registrationData.information.find(step => step.stepName === stepName) || null;
  };

  return {
    registrationData,
    isLoading,
    error,
    getStepData,
  };
};
