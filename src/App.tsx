import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  CalendarDays, 
  Inbox,
  Sparkles
} from 'lucide-react';
import { FollowUpItem, FilterStatus, SortOption } from './types';
import { getTodayString, addDaysToDate } from './utils/date';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { QuickAddForm } from './components/QuickAddForm';
import { FollowUpCard } from './components/FollowUpCard';
import { EditModal } from './components/EditModal';

const STORAGE_KEY = 'agenda_followup_contatos_prod_v1';

export default function App() {
  const [items, setItems] = useState<FollowUpItem[]>(() => {
    try {
      // Clear old test storage if exists
      localStorage.removeItem('agenda_followup_contatos_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: FollowUpItem[] = JSON.parse(saved);
        // Filter out any leftover demo items
        return parsed.filter((item) => !item.id.startsWith('demo-'));
      }
    } catch (e) {
      console.error('Failed to parse saved follow-ups', e);
    }
    return [];
  });

  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_asc');
  const [editingItem, setEditingItem] = useState<FollowUpItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save follow-ups', e);
    }
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Add item
  const handleAddItem = (newItemData: Omit<FollowUpItem, 'id' | 'completed' | 'createdAt'>) => {
    const newItem: FollowUpItem = {
      ...newItemData,
      id: 'fu-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      completed: false,
      createdAt: getTodayString(),
    };
    setItems((prev) => [newItem, ...prev]);
    showToast(`Contato "${newItem.name}" agendado com sucesso!`);
  };

  // Toggle complete
  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          showToast(
            nextCompleted
              ? `✓ Retorno com "${item.name}" marcado como concluído!`
              : `Retorno com "${item.name}" reaberto.`
          );
          return {
            ...item,
            completed: nextCompleted,
            completedAt: nextCompleted ? getTodayString() : undefined,
          };
        }
        return item;
      })
    );
  };

  // Postpone
  const handlePostpone = (id: string, days: number) => {
    const today = getTodayString();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const baseDate = item.returnDate < today ? today : item.returnDate;
          const newDate = addDaysToDate(baseDate, days);
          showToast(`Retorno com "${item.name}" adiado em +${days} ${days === 1 ? 'dia' : 'dias'}.`);
          return {
            ...item,
            returnDate: newDate,
          };
        }
        return item;
      })
    );
  };

  // Edit item
  const handleSaveEdit = (updatedItem: FollowUpItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    showToast(`Alterações em "${updatedItem.name}" salvas.`);
  };

  // Delete item
  const handleDelete = (id: string) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (target) {
      showToast(`Contato "${target.name}" removido.`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (items.length === 0) return;
    const header = ['Nome', 'Telefone', 'Data de Retorno', 'Assunto', 'Status', 'Anotações'];
    const rows = items.map((item) => [
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.phone.replace(/"/g, '""')}"`,
      item.returnDate,
      `"${item.subject.replace(/"/g, '""')}"`,
      item.completed ? 'Concluído' : 'Pendente',
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agenda_followups_${getTodayString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Planilha CSV exportada com sucesso!');
  };

  // Stats calculation
  const today = getTodayString();
  const stats = useMemo(() => {
    let todayCount = 0;
    let overdueCount = 0;
    let pendingCount = 0;
    let completedCount = 0;

    items.forEach((item) => {
      if (item.completed) {
        completedCount++;
      } else {
        pendingCount++;
        if (item.returnDate === today) {
          todayCount++;
        } else if (item.returnDate < today) {
          overdueCount++;
        }
      }
    });

    return {
      today: todayCount,
      overdue: overdueCount,
      pending: pendingCount,
      completed: completedCount,
      total: items.length,
    };
  }, [items, today]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (activeFilter === 'today') {
          return !item.completed && item.returnDate === today;
        }
        if (activeFilter === 'overdue') {
          return !item.completed && item.returnDate < today;
        }
        if (activeFilter === 'pending') {
          return !item.completed;
        }
        if (activeFilter === 'completed') {
          return item.completed;
        }
        return true;
      })
      .filter((item) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.phone.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (activeFilter === 'all') {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
        }

        if (sortBy === 'name_asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'date_desc') {
          return b.returnDate.localeCompare(a.returnDate);
        }
        return a.returnDate.localeCompare(b.returnDate);
      });
  }, [items, activeFilter, searchTerm, sortBy, today]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Header
        onExportCSV={handleExportCSV}
        totalCount={items.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Metric Summary Cards */}
        <StatsBar
          stats={stats}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Quick Add Follow-up Form */}
        <QuickAddForm onAdd={handleAddItem} />

        {/* List Controls: Search, Tabs & Sorting */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por contato, telefone ou assunto..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="date_asc">Data mais próxima</option>
                <option value="date_desc">Data mais distante</option>
                <option value="name_asc">Nome (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filtrar:
            </span>

            <button
              onClick={() => setActiveFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({stats.total})
            </button>

            <button
              onClick={() => setActiveFilter('today')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'today'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-amber-100/70 hover:text-amber-800'
              }`}
            >
              Hoje ({stats.today})
            </button>

            <button
              onClick={() => setActiveFilter('overdue')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'overdue'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-rose-100/70 hover:text-rose-800'
              }`}
            >
              Atrasados ({stats.overdue})
            </button>

            <button
              onClick={() => setActiveFilter('pending')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pendentes ({stats.pending})
            </button>

            <button
              onClick={() => setActiveFilter('completed')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Concluídos ({stats.completed})
            </button>
          </div>
        </div>

        {/* Contact List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              Contatos e Retornos ({filteredItems.length})
            </h2>

            {filteredItems.length > 0 && activeFilter === 'all' && (
              <span className="text-xs text-slate-400">
                Acompanhamentos pendentes priorizados no topo
              </span>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">
                Nenhum contato encontrado
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
                {searchTerm
                  ? `Nenhum resultado corresponde à busca "${searchTerm}".`
                  : activeFilter === 'today'
                  ? 'Você não tem nenhum retorno agendado para o dia de hoje!'
                  : activeFilter === 'overdue'
                  ? 'Não há nenhum retorno atrasado pendente.'
                  : activeFilter === 'completed'
                  ? 'Nenhum contato foi marcado como concluído ainda.'
                  : 'Sua agenda está pronta para uso. Adicione seu primeiro contato acima com nome, telefone, data e assunto.'}
              </p>

              {(searchTerm || activeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                  className="px-4 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                >
                  Limpar filtros e exibir todos
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredItems.map((item) => (
                <FollowUpCard
                  key={item.id}
                  item={item}
                  onToggleComplete={handleToggleComplete}
                  onPostpone={handlePostpone}
                  onEdit={(target) => setEditingItem(target)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-auto border-t border-slate-200/80 py-4 text-center text-xs text-slate-400">
        Agenda de Follow Up • Simples, rápida e focada em resultados
      </footer>

      {/* Edit Modal */}
      <EditModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
