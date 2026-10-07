import { useState } from 'react';
import { 
  Calendar, 
  Check, 
  Trash2, 
  Edit3, 
  Phone, 
  MessageSquare, 
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

  // Phone cleaner for direct whatsapp and tel links
  const cleanPhone = item.phone ? item.phone.replace(/\D/g, '') : '';
  const whatsappUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone.length <= 11 ? '55' + cleanPhone : cleanPhone}?text=${encodeURIComponent(`Olá ${item.name}, tudo bem? Gostaria de falar sobre: ${item.subject}`)}`
    : null;
  const telUrl = cleanPhone ? `tel:${cleanPhone}` : null;

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 p-4 sm:p-5 ${
        item.completed
          ? 'bg-slate-50/80 border-slate-200/80 text-slate-500'
          : statusInfo.status === 'overdue'
          ? 'bg-white border-rose-200 hover:border-rose-300 shadow-xs ring-1 ring-rose-500/10'
          : statusInfo.status === 'today'
          ? 'bg-white border-amber-300 hover:border-amber-400 shadow-xs ring-1 ring-amber-400/20'
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
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            {/* Contact Name & Phone */}
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h3
                className={`text-base font-semibold truncate ${
                  item.completed
                    ? 'line-through text-slate-400 font-normal'
                    : 'text-slate-900'
                }`}
              >
                {item.name}
              </h3>

              <div className="flex items-center gap-1.5">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium inline-flex items-center gap-1 shrink-0">
                  <Phone className="w-3 h-3 text-slate-500" />
                  {item.phone}
                </span>

                {whatsappUrl && !item.completed && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full transition-colors border border-emerald-200 shrink-0"
                    title="Conversar no WhatsApp"
                  >
                    <MessageSquare className="w-3 h-3" />
                    WhatsApp
                  </a>
                )}
                {telUrl && !item.completed && (
                  <a
                    href={telUrl}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors border border-blue-200 shrink-0"
                    title="Ligar para o contato"
                  >
                    <Phone className="w-3 h-3" />
                    Ligar
                  </a>
                )}
              </div>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${statusInfo.badgeClass}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatBrazilianDate(item.returnDate)}</span>
                <span className="font-normal opacity-85">({relativeDays})</span>
              </span>
            </div>
          </div>

          {/* Subject of Reactivation */}
          <div className="mb-2">
            <div className="flex items-start gap-1.5 text-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mt-0.5">
                Assunto:
              </span>
              <p
                className={`font-medium ${
                  item.completed
                    ? 'text-slate-500 line-through'
                    : 'text-slate-800'
                }`}
              >
                {item.subject}
              </p>
            </div>

            {item.notes && (
              <p className="text-xs text-slate-500 mt-1 pl-1 border-l-2 border-slate-200 italic">
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
                  <span className="text-[11px] text-slate-400 mr-0.5">Adiar:</span>
                  <button
                    onClick={() => onPostpone(item.id, 1)}
                    className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                    title="Adiar para amanhã"
                  >
                    +1 dia
                  </button>
                  <button
                    onClick={() => onPostpone(item.id, 3)}
                    className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                    title="Adiar por 3 dias"
                  >
                    +3 dias
                  </button>
                  <button
                    onClick={() => onPostpone(item.id, 7)}
                    className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                    title="Adiar por 7 dias"
                  >
                    +7 dias
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
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
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Editar"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {showConfirmDelete ? (
                <div className="flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  <span className="text-[11px] text-rose-700 font-medium">Excluir?</span>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-[11px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-medium hover:bg-rose-700 cursor-pointer"
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="text-[11px] text-slate-600 hover:text-slate-800 px-1 cursor-pointer"
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
