export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDate(baseDateStr: string, days: number): string {
  const parts = baseDateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  date.setDate(date.getDate() + days);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatBrazilianDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function getDateStatus(dateStr: string, isCompleted: boolean): {
  status: 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'completed';
  label: string;
  badgeClass: string;
} {
  if (isCompleted) {
    return {
      status: 'completed',
      label: 'Concluído',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    };
  }

  const today = getTodayString();
  const tomorrow = addDaysToDate(today, 1);

  if (dateStr < today) {
    return {
      status: 'overdue',
      label: 'Atrasado',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    };
  }

  if (dateStr === today) {
    return {
      status: 'today',
      label: 'Para Hoje',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-700',
    };
  }

  if (dateStr === tomorrow) {
    return {
      status: 'tomorrow',
      label: 'Amanhã',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    };
  }

  return {
    status: 'upcoming',
    label: 'Agendado',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };
}

export function getRelativeDaysLabel(dateStr: string): string {
  const today = getTodayString();
  if (dateStr === today) return 'Hoje';
  
  const tomorrow = addDaysToDate(today, 1);
  if (dateStr === tomorrow) return 'Amanhã';

  const partsToday = today.split('-');
  const partsTarget = dateStr.split('-');
  
  const d1 = new Date(parseInt(partsToday[0], 10), parseInt(partsToday[1], 10) - 1, parseInt(partsToday[2], 10));
  const d2 = new Date(parseInt(partsTarget[0], 10), parseInt(partsTarget[1], 10) - 1, parseInt(partsTarget[2], 10));
  
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const abs = Math.abs(diffDays);
    return `${abs} ${abs === 1 ? 'dia' : 'dias'} atrás`;
  }

  return `em ${diffDays} dias`;
}
