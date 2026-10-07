import { useState } from 'react';
import { 
  Calendar, 
  Check, 
  Trash2, 
  Edit3, 
  Phone, 
  RotateCcw
} from 'lucide-react';
import { FollowUpItem } from '../types';
import { formatBrazilianDate, getDateStatus, getRelativeDaysLabel } from '../utils/date';

interface FollowUpCardProps {
  item: FollowUpItem;
  onToggleComplete: (id: string) => void;
  onPostpone: (id: string, days: number) => void;
  onEdit: (item: FollowUpItem) => void;
  onDelete: (id: string) => void;
}

export function FollowUpCard({
  item,
  onToggleComplete,
  onPostpone,
  onEdit,
  onDelete,
}: FollowUpCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const statusInfo = getDateStatus(item.returnDate, item.completed);
  const relativeDays = getRelativeDaysLabel(item.returnDate);

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 p-4 sm:p-5 ${
        item.completed
          ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-75'
          : statusInfo.status === 'overdue'
          ? 'bg-white border-rose-300 shadow-xs ring-1 ring-rose-500/20'
          : statusInfo.status === 'today'
          ? 'bg-white border-amber-400 shadow-xs ring-1 ring-amber-400/30'
          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox button */}
        <button
          onClick={() => onToggleComplete(item.id)}
          aria-label={item.completed ? 'Marcar como pendente' : 'Marcar como concluído'}
          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer ${
            item.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'border-slate-300 bg-white hover:border-indigo-500 hover:bg-indigo-50 text-transparent'
          }`}
        >
          <Check className={`w-4 h-4 stroke-[2.5] ${item.completed ? 'opacity-100' : 'opacity-0 hover:opacity-40 hover:text-indigo-600'}`} />
        </button>

        {/* Content body */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            {/* Contact Name & Phone */}
            <div className="flex flex-wrap items-center gap-2.5 min-w-0">
              <h3
                className={`text-base font-bold truncate ${
                  item.completed
                    ? 'line-through text-slate-400 font-normal'
                    : 'text-slate-900'
                }`}
              >
                {item.name}
              </h3>

              {/* Telefone sem botões de ligar ou whatsapp */}
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold inline-flex items-center gap-1.5 border border-slate-200 shrink-0">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {item.phone}
              </span>
            </div>

            {/* Date Badge - Visível, nítido e com alto contraste */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border-2 shadow-xs ${statusInfo.badgeClass}`}
              >
                <Calendar className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span className="font-bold tracking-tight text-[13px]">
                  {formatBrazilianDate(item.returnDate)}
                </span>
                <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-black/10 tracking-wider">
                  {statusInfo.status === 'upcoming' 
                    ? relativeDays 
                    : statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Subject of Reactivation */}
          <div className="mb-2">
            <div className="flex items-start gap-1.5 text-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mt-0.5">
                ASSUNTO:
              </span>
              <p
                className={`font-semibold ${
                  item.completed
                    ? 'text-slate-500 line-through'
                    : 'text-slate-900'
                }`}
              >
                {item.subject}
              </p>
            </div>

            {item.notes && (
              <p className="text-xs text-slate-600 mt-1 pl-2 border-l-2 border-slate-300 italic">
                {item.notes}
              </p>
            )}
          </div>

          {/* Bottom Actions bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 mt-2">
            {/* Left side actions (Postpone shortcuts) */}
            <div className="flex flex-wrap items-center gap-1.5">
              {!item.completed ? (
                <>
                  <span className="text-[11px] font-medium text-slate-400 mr-0.5">Adiar:</span>
                  <button
                    onClick={() => onPostpone(item.id, 1)}
                    className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
                    title="Adiar para amanhã"
                  >
                    +1 dia
                  </button>
                  <button
                    onClick={() => onPostpone(item.id, 3)}
                    className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
                    title="Adiar por 3 dias"
                  >
                    +3 dias
                  </button>
                  <button
                    onClick={() => onPostpone(item.id, 7)}
                    className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
                    title="Adiar por 7 dias"
                  >
                    +7 dias
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reabrir contato
                </button>
              )}
            </div>

            {/* Right side controls (Edit, Delete) */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Editar"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {showConfirmDelete ? (
                <div className="flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  <span className="text-[11px] text-rose-700 font-semibold">Excluir?</span>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-[11px] bg-rose-600 text-white px-2 py-0.5 rounded font-bold hover:bg-rose-700 cursor-pointer"
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="text-[11px] text-slate-600 hover:text-slate-800 px-1 cursor-pointer font-medium"
                  >
                    Não
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
