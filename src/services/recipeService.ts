import restClient from '@/utils/restClient';

export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nutritionalBenefits: string[];
}

export interface GenerateRecipeRequest {
  plateEvaluationId: number;
  ingredients: string[];
  evaluationScore: number;
  evaluationIssues: string[];
}

export interface RecipeRecommendationResponse {
  recipes: Recipe[];
  pointsSpent: number;
  remainingPoints: number;
}

export interface RecipeRecommendationHistory {
  id: number;
  plateEvaluationId: number;
  ingredients: string[];
  evaluationScore: number;
  recipes: Recipe[];
  pointsSpent: number;
  createdAt: string;
}

export const recipeService = {
  async generateRecipeRecommendations(
    request: GenerateRecipeRequest
  ): Promise<RecipeRecommendationResponse> {
    return restClient.post('/recipe-recommendations/generate', request);
  },

  async getRecipeRecommendationHistory(): Promise<RecipeRecommendationHistory[]> {
    return restClient.get('/recipe-recommendations/history');
  },
};
