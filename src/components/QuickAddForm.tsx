import { useState } from 'react';
import { Calendar, Plus, User, Tag, Phone } from 'lucide-react';
import { getTodayString, addDaysToDate } from '../utils/date';
import { FollowUpItem } from '../types';

interface QuickAddFormProps {
  onAdd: (item: Omit<FollowUpItem, 'id' | 'completed' | 'createdAt'>) => void;
}

export function QuickAddForm({ onAdd }: QuickAddFormProps) {
  const today = getTodayString();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [returnDate, setReturnDate] = useState(today);
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');

  const formatPhoneInput = (val: string) => {
    // Keep numbers and format standard BR phone if applicable: (XX) XXXXX-XXXX
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !subject.trim()) return;

    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      returnDate: returnDate || today,
      subject: subject.trim(),
      notes: notes.trim() || undefined,
    });

    // Reset fields
    setName('');
    setPhone('');
    setSubject('');
    setNotes('');
    setReturnDate(today);
  };

  const handleQuickDate = (days: number) => {
    setReturnDate(addDaysToDate(today, days));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          Novo Agendamento de Retorno
        </h2>
        <span className="text-xs text-slate-400">Campos com * são obrigatórios</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Linha 1: Nome, Telefone e Data */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Nome do Contato */}
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Contato / Nome <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Ferreira ou Loja Silva"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Telefone / WhatsApp */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Telefone / WhatsApp <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(11) 98765-4321"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Data de Retorno */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Data de Retorno <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full pl-9 pr-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
              />
            </div>
            {/* Quick date chips */}
            <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => handleQuickDate(0)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  returnDate === today
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                    : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(1)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  returnDate === addDaysToDate(today, 1)
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                    : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Amanhã
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(3)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  returnDate === addDaysToDate(today, 3)
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                    : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                +3d
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(7)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  returnDate === addDaysToDate(today, 7)
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                    : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                +7d
              </button>
            </div>
          </div>
        </div>

        {/* Linha 2: Assunto e Observação */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Assunto da Reativação */}
          <div className="md:col-span-7">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Assunto da Reativação <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Informe o motivo ou assunto do contato"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Anotação opcional */}
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Anotações adicionais <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Ligar no período da tarde"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Adicionar à Agenda
          </button>
        </div>
      </form>
    </div>
  );
}
