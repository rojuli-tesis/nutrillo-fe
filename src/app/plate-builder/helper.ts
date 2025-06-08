import { PlateIngredient } from "@/types/plate-ingredient";
import restClient from "@/utils/restClient";

async function getPlateIngredients() {
  const response = await restClient.get< PlateIngredient[]>('/plate-ingredient');
  return response;
}

export { getPlateIngredients };