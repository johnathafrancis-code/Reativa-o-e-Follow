export interface FollowUpItem {
  id: string;
  name: string;
  phone: string; // Obrigatório
  returnDate: string; // Formato: YYYY-MM-DD
  subject: string; // Obrigatório
  notes?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export type FilterStatus = 'all' | 'today' | 'overdue' | 'pending' | 'completed';
export type SortOption = 'date_asc' | 'date_desc' | 'name_asc';
