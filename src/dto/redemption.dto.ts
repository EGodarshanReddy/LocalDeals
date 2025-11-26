export interface RedemptionResponse {
  id: number;
  userId: number;
  partnerId: number;
  points: number;
  amount: number;
  proofImageUrl: string | null;
  code: string;
  status: string;
  createdAt: Date;
  partner?: {
    id: number;
    name: string;
    location: string;
  };
}

