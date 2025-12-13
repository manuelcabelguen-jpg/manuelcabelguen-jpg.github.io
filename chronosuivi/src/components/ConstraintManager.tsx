import React, { useState, useMemo } from 'react';
import { Constraint } from '../types';
import { AlertTriangle, Plus, Trash2, CalendarX, Download, CalendarRange, Calendar, ArrowRight } from 'lucide-react';
import { formatDateFr, parseDate, getFederalHolidaysQuebec, addDays } from '../utils/dateUtils';

interface ConstraintManagerProps {
  constraints: Constraint[];
  setConstraints: React.Dispatch<React.SetStateAction<Constraint[]>>;
}

export const ConstraintManager: React.FC<ConstraintManagerProps> = ({ constraints, setConstraints }) => {
  const [mode, setMode] = useState<'SINGLE' | 'RANGE'>('SINGLE');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Constraint['type']>('LOGISTICS');

  // Safer ID generation
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  const addConstraint = () => {
    if (!description) return;

    let newConstraints: Constraint[] = [];

    if (mode === 'SINGLE') {
      if (!date) return;
      newConstraints.push({
        id: generateId(),
        date,
        description,
        type
      });
    } else {
      if (!date || !endDate) return;
      const start = parseDate(date);
      const end = parseDate(endDate);

      if (end < start) {
        alert("La date de fin doit être après la date de début.");
        return;
      }

      const periodId = generateId();
      let current = start;
      while (current <= end) {
        newConstraints.push({
          id: generateId(),
          date: current.toISOString().split('T')[0],
          description: `${description}`,
          type,
          periodId
        });
        current = addDays(current, 1);
      }
    }

    setConstraints(prev => {
      const existingDates = new Set(prev.map(c => c.date));
      const filtered = newConstraints.filter(c => !existingDates.has(c.date));
      return [...prev, ...filtered].sort((a,b) => a.date.localeCompare(b.date));
    });

    setDescription('');
    setDate('');
    setEndDate('');
  };

  const removeConstraint = (id: string, periodId?: string) => {
    if (periodId) {
       setConstraints(prev => prev.filter(c => c.periodId !== periodId));
    } else {
       setConstraints(prev => prev.filter(c => c.id !== id));
    }
  };

  const importHolidays = () => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear + 1, currentYear + 2];
    let newHolidays: Constraint[] = [];
    years.forEach(year => {
      newHolidays = [...newHolidays, ...getFederalHolidaysQuebec(year)];
    });

    setConstraints(prev => {
      const existingDates = new Set(prev.map(c => c.date));
      const filtered = newHolidays.filter(h => !existingDates.has(h.date));
      return [...prev, ...filtered].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  // Group constraints for display
  const displayItems = useMemo(() => {
    const groups: Record<string, Constraint[]> = {};
    const singles: Constraint[] = [];

    constraints.forEach(c => {
      if (c.periodId) {
        if (!groups[c.periodId]) groups[c.periodId] = [];
        groups[c.periodId].push(c);
      } else {
        singles.push(c);
      }
    });

    const periodItems = Object.values(groups).map(group => {
      const sorted = group.sort((a, b) => a.date.localeCompare(b.date));
      return {
        ...sorted[0],
        endDate: sorted[sorted.length - 1].date,
        isPeriod: true,
        count: group.length,
        periodId: group[0].periodId // Ensure we pass the periodId
      };
    });

    return [...singles, ...periodItems].sort((a, b) => a.date.localeCompare(b.date));
  }, [constraints]);

  return (
    <div className="card p-6 relative group hover:shadow-md transition-shadow duration-300">
      <div className="absolute -left-3 top-6 w-1.5 h-12 bg-amber-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 text-sm font-bold rounded-lg shadow-sm print:hidden">4</span>
          Contraintes & Fériés
        </h3>
        <button
          onClick={importHolidays}
          className="text-xs font-semibold flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg transition-colors border border-slate-200 shadow-sm print:hidden"
          title="Importer les jours fériés de la fonction publique (QC)"
        >
          <Download className="w-3.5 h-3.5" />
          Auto-Import
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100/80 rounded-lg mb-5 w-fit print:hidden">
         <button
           onClick={() => setMode('SINGLE')}
           className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-md transition-all ${mode === 'SINGLE' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <Calendar className="w-3.5 h-3.5" />
           Date unique
         </button>
         <button
           onClick={() => setMode('RANGE')}
           className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-md transition-all ${mode === 'RANGE' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <CalendarRange className="w-3.5 h-3.5" />
           Période (Vacances)
         </button>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 mb-6 flex flex-col sm:flex-row gap-3 items-end print:hidden">

        {mode === 'SINGLE' ? (
          <div className="w-full sm:w-40">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="w-1/2 sm:w-32">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Du</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field text-sm"
              />
            </div>
            <div className="w-1/2 sm:w-32">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Au</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>
        )}

        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Raison</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addConstraint()}
            placeholder={mode === 'RANGE' ? "Ex: Vacances d'été" : "Ex: Formation"}
            className="input-field"
          />
        </div>
        <div className="w-full sm:w-36">
           <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Type</label>
           <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="input-field appearance-none bg-white cursor-pointer"
          >
            <option value="LOGISTICS">Logistique</option>
            <option value="HOLIDAY">Férié</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>
        <button
          onClick={addConstraint}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-amber-500/20 active:scale-95 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar print:max-h-none print:overflow-visible">
        {displayItems.length === 0 && (
          <div className="text-center py-8 text-slate-400">
             <CalendarX className="w-8 h-8 mx-auto mb-2 opacity-30" />
             <p className="text-sm">Aucune contrainte pour le moment.</p>
          </div>
        )}
        {displayItems.map((item: any) => (
          <div key={item.id} className="flex items-center gap-3 p-2.5 px-3 bg-white rounded-lg border border-slate-100 hover:border-amber-200 shadow-sm transition-all group print:border-none print:p-1 print:pl-0">

            <div className={`p-1.5 rounded-md ${item.type === 'HOLIDAY' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'} print:hidden`}>
              {item.isPeriod ? <CalendarRange className="w-3.5 h-3.5" /> : (item.type === 'HOLIDAY' ? <Calendar className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />)}
            </div>

            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
               <span>{formatDateFr(parseDate(item.date))}</span>
               {item.isPeriod && (
                 <>
                   <ArrowRight className="w-3 h-3 text-slate-400" />
                   <span>{formatDateFr(parseDate(item.endDate))}</span>
                 </>
               )}
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                 <span className="text-sm text-slate-600 font-medium truncate">{item.description}</span>
                 {item.isPeriod && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded-full border border-slate-200 print:hidden">
                      {item.count}j
                    </span>
                 )}
               </div>
            </div>

            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md print:border print:border-slate-200 print:text-slate-500 ${
              item.type === 'HOLIDAY'
                ? 'bg-purple-50 text-purple-600'
                : 'bg-amber-50 text-amber-600'
            }`}>
              {item.type === 'HOLIDAY' ? 'Férié' : item.type === 'LOGISTICS' ? 'Logistique' : 'Autre'}
            </span>

            <button
              onClick={() => removeConstraint(item.id, item.periodId)}
              className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 print:hidden"
              title={item.isPeriod ? "Supprimer la période" : "Supprimer"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
