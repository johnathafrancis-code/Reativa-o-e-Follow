import { AlertCircle, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { FilterStatus } from '../types';

interface StatsBarProps {
  stats: {
    today: number;
    overdue: number;
    pending: number;
    completed: number;
    total: number;
  };
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
}

export function StatsBar({ stats, activeFilter, onSelectFilter }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Para Hoje */}
      <button
        onClick={() => onSelectFilter(activeFilter === 'today' ? 'all' : 'today')}
        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
          activeFilter === 'today'
            ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
            : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Para Hoje</div>
          <div className="text-xl font-bold text-slate-900">{stats.today}</div>
        </div>
      </button>

      {/* Atrasados */}
      <button
        onClick={() => onSelectFilter(activeFilter === 'overdue' ? 'all' : 'overdue')}
        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
          activeFilter === 'overdue'
            ? 'bg-rose-500/10 border-rose-500 shadow-sm ring-2 ring-rose-500/20'
            : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/50'
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Atrasados</div>
          <div className="text-xl font-bold text-slate-900">{stats.overdue}</div>
        </div>
      </button>

      {/* Pendentes */}
      <button
        onClick={() => onSelectFilter(activeFilter === 'pending' ? 'all' : 'pending')}
        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
          activeFilter === 'pending'
            ? 'bg-indigo-500/10 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
            : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pendentes</div>
          <div className="text-xl font-bold text-slate-900">{stats.pending}</div>
        </div>
      </button>

      {/* Concluídos */}
      <button
        onClick={() => onSelectFilter(activeFilter === 'completed' ? 'all' : 'completed')}
        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
          activeFilter === 'completed'
            ? 'bg-emerald-500/10 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Concluídos</div>
          <div className="text-xl font-bold text-slate-900">{stats.completed}</div>
        </div>
      </button>
    </div>
  );
}
