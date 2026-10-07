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
      badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-semibold',
    };
  }

  const today = getTodayString();
  const tomorrow = addDaysToDate(today, 1);

  if (dateStr < today) {
    return {
      status: 'overdue',
      label: 'Atrasado',
      badgeClass: 'bg-rose-100 text-rose-950 border-rose-400 font-bold',
    };
  }

  if (dateStr === today) {
    return {
      status: 'today',
      label: 'Para Hoje',
      badgeClass: 'bg-amber-100 text-amber-950 border-amber-400 font-bold',
    };
  }

  if (dateStr === tomorrow) {
    return {
      status: 'tomorrow',
      label: 'Amanhã',
      badgeClass: 'bg-blue-100 text-blue-950 border-blue-400 font-bold',
    };
  }

  return {
    status: 'upcoming',
    label: 'Agendado',
    badgeClass: 'bg-slate-100 text-slate-900 border-slate-300 font-semibold',
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
