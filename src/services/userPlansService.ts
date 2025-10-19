import restClient from '@/utils/restClient';

export interface UserPlan {
  _id: string;
  patientId: string;
  fileName: string;
  url: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const userPlansService = {
  async getAllPlans(userId: string): Promise<UserPlan[]> {
    return restClient.get<UserPlan[]>(`/nutrition-plan/patient/${userId}`);
  },

  async getActivePlan(userId: string): Promise<UserPlan | null> {
    // For now, return the most recent plan as active
    // The nutrition-plan system doesn't have an active flag
    const plans = await this.getAllPlans(userId);
    return plans.length > 0 ? plans[0] : null;
  },

  async getPlanById(id: string): Promise<UserPlan> {
    // The nutrition-plan system doesn't have a get by ID endpoint
    // We'll need to get all plans and find the one with matching ID
    throw new Error('Get plan by ID not implemented for nutrition-plan system');
  },

  async deletePlan(id: string): Promise<void> {
    return restClient.delete(`/nutrition-plan/${id}`);
  },

  async downloadPlan(id: string): Promise<Blob> {
    // Use the backend download endpoint to avoid CORS issues
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nutrition-plan/${id}/download`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to download plan');
    }
    
    return response.blob();
  }
};
