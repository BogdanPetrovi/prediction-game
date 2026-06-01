import { Prize, TopUser } from "@/types/TopThree";

export const isPrize = (data: Prize[] | TopUser[]): data is Prize[] => {
  return data.length === 0 || 'skinName' in data[0]
}