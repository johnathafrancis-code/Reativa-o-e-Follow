import { CalendarCheck2, FileSpreadsheet } from 'lucide-react';

interface HeaderProps {
  onExportCSV: () => void;
  totalCount: number;
}

export function Header({ onExportCSV, totalCount }: HeaderProps) {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Agenda de Reativação & Follow Up
            </h1>
            <p className="text-xs text-slate-500">
              Controle ágil de contatos, retornos e assuntos de reativação
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {totalCount > 0 && (
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Exportar contatos para planilha CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exportar CSV</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
