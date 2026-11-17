export interface Division {
  id: string;
  code: string;
  name: string;
  amharicName?: string;
  description: string;
  status: 'Active' | 'Inactive';
  headOfDivision?: string;
  headEmail?: string;
  headPhone?: string;
  establishedDate?: string;
  createdAt?: string;
  targetHeadcount?: number;
}
