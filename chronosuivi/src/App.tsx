import React, { useState, useMemo, useEffect } from 'react';
import { Stage, Constraint, DaySchedule } from './types';
import { calculateTimeline, formatDateFr, addDays } from './utils/dateUtils';
import { StageBuilder } from './components/StageBuilder';
import { ConstraintManager } from './components/ConstraintManager';
import { ScheduleManager } from './components/ScheduleManager';
import { Timeline } from './components/Timeline';
import { Clock, User, RotateCcw, Printer, CalendarRange, Layers, AlertTriangle, ArrowRight, Shield } from 'lucide-react';

// --- Local Storage Helpers ---
// CHANGE: Updated version to v3 to absolutely clear any corrupted data
const STORAGE_KEY = 'chronosuivi_v3';

const loadState = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY + '_' + key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export default function App() {
  // Initialize state
  const [programName, setProgramName] = useState(() => loadState('programName', 'Programme Correctionnel Alpha'));
  const [intervenantName, setIntervenantName] = useState(() => loadState('intervenantName', ''));

  // Validate start date on load
  const [startDate, setStartDate] = useState(() => {
    const s = loadState('startDate', new Date().toISOString().split('T')[0]);
    return isNaN(new Date(s).getTime()) ? new Date().toISOString().split('T')[0] : s;
  });

  const defaultSchedule: DaySchedule[] = [
    { dayIndex: 1, sessionsCount: 1, label: 'Lun' },
    { dayIndex: 2, sessionsCount: 1, label: 'Mar' },
    { dayIndex: 3, sessionsCount: 1, label: 'Mer' },
    { dayIndex: 4, sessionsCount: 1, label: 'Jeu' },
    { dayIndex: 5, sessionsCount: 1, label: 'Ven' },
  ];
  const [schedule, setSchedule] = useState<DaySchedule[]>(() => loadState('schedule', defaultSchedule));

  const defaultStages: Stage[] = [
    { id: '1', name: 'Évaluation Initiale', sessionsRequired: 2, order: 1 },
    { id: '2', name: 'Module de Réintégration', sessionsRequired: 10, order: 2 },
    { id: '3', name: 'Stage Pratique', sessionsRequired: 5, order: 3 },
  ];

  const [stages, setStages] = useState<Stage[]>(() => loadState('stages', defaultStages));

  const [constraints, setConstraints] = useState<Constraint[]>(() => loadState('constraints', []));
  const [isSaved, setIsSaved] = useState(true);

  // Persistence Effect
  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY + '_programName', JSON.stringify(programName));
      localStorage.setItem(STORAGE_KEY + '_intervenantName', JSON.stringify(intervenantName));
      localStorage.setItem(STORAGE_KEY + '_startDate', JSON.stringify(startDate));
      localStorage.setItem(STORAGE_KEY + '_schedule', JSON.stringify(schedule));
      localStorage.setItem(STORAGE_KEY + '_stages', JSON.stringify(stages));
      localStorage.setItem(STORAGE_KEY + '_constraints', JSON.stringify(constraints));
      setIsSaved(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [programName, intervenantName, startDate, schedule, stages, constraints]);

  // Calculations
  const calculatedTimeline = useMemo(() => {
    return calculateTimeline(startDate, stages, constraints, schedule);
  }, [startDate, stages, constraints, schedule]);

  // Derived Stats for Dashboard
  const totalSessions = stages.reduce((acc, s) => acc + (s.sessionsRequired || 0), 0);
  const finishDate = calculatedTimeline.length > 0 ? calculatedTimeline[calculatedTimeline.length - 1].endDate : new Date(startDate);

  // Safe calculation for duration
  const startObj = new Date(startDate);
  const finishObj = new Date(finishDate);

  let totalDurationDays = 0;
  if (!isNaN(startObj.getTime()) && !isNaN(finishObj.getTime())) {
    totalDurationDays = Math.ceil((finishObj.getTime() - startObj.getTime()) / (1000 * 3600 * 24));
  }

  const safeDate = addDays(finishDate, Math.ceil(totalDurationDays * 0.15));

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tout le programme ?")) {
      setProgramName('Programme Correctionnel Alpha');
      setIntervenantName('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setSchedule(defaultSchedule);
      setStages(defaultStages);
      setConstraints([]);
      // Clear all keys
      const keys = ['programName', 'intervenantName', 'startDate', 'schedule', 'stages', 'constraints'];
      keys.forEach(k => localStorage.removeItem(STORAGE_KEY + '_' + k));
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 print:bg-white print:pb-0 font-sans">
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-700 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Clock className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">ChronoSuivi</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Gestion de délais</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isSaved ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
               <span className={`w-1.5 h-1.5 rounded-full ${isSaved ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
               {isSaved ? 'Enregistré' : 'Sauvegarde...'}
            </span>
             <button onClick={() => window.print()} className="btn-secondary p-2 ml-2 flex items-center gap-2" title="Imprimer">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Exporter</span>
            </button>
            <button onClick={handleReset} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Réinitialiser">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* HERO DASHBOARD - THE BIG BLUE BLOCK (GROS DASHBOARD BLEU) */}
        {/* Made full width on mobile, and spans full 12 cols on large screen inside a dedicated row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 print:hidden">

           {/* GROS DASHBOARD BLEU: Spans 8 columns (2/3) */}
           <div className="md:col-span-8 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <CalendarRange className="w-48 h-48 transform rotate-12" />
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-2">Fin Optimale Estimée</p>
                  <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-sm">
                    {formatDateFr(finishDate)}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                   <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 flex items-center gap-3">
                     <div className="bg-white/20 p-2 rounded-md">
                       <ArrowRight className="w-5 h-5 text-white" />
                     </div>
                     <div>
                       <p className="text-xs text-blue-200 font-semibold uppercase">Durée Totale</p>
                       <p className="text-xl font-bold">{totalDurationDays} jours</p>
                     </div>
                   </div>

                   <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 flex items-center gap-3">
                     <div className="bg-white/20 p-2 rounded-md">
                       <Shield className="w-5 h-5 text-white" />
                     </div>
                     <div>
                       <p className="text-xs text-blue-200 font-semibold uppercase">Date de Sécurité (+15%)</p>
                       <p className="text-xl font-bold">{formatDateFr(safeDate)}</p>
                     </div>
                   </div>
                </div>
              </div>
           </div>

           {/* Metrics Column: Spans 4 columns (1/3) */}
           <div className="md:col-span-4 flex flex-col gap-4">
             {/* Card 2: Volume */}
             <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center hover:border-blue-300 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors"><Layers className="w-6 h-6" /></div>
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Volume Total</span>
                   </div>
                   <span className="text-4xl font-bold text-slate-800">{totalSessions}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-right text-xs text-slate-400 mt-2 font-medium">Séances requises</p>
             </div>

             {/* Card 3: Constraints */}
             <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center hover:border-amber-300 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors"><AlertTriangle className="w-6 h-6" /></div>
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Contraintes</span>
                   </div>
                   <span className="text-4xl font-bold text-slate-800">{constraints.length}</span>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   Jours fériés, congés et contraintes logistiques impactant le calendrier.
                </p>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Configuration */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. Program Identity */}
            <section className="card p-5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</span>
                Identité
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nom du Programme</label>
                  <input
                    type="text"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    className="input-field font-medium"
                    placeholder="Ex: Programme Alpha"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Date de démarrage</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Intervenant (Optionnel)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Nom..."
                      value={intervenantName}
                      onChange={(e) => setIntervenantName(e.target.value)}
                      className="input-field pl-9"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Schedule */}
            <div className="print:hidden">
               <ScheduleManager schedule={schedule} setSchedule={setSchedule} />
            </div>

            {/* 3. Stages */}
            <StageBuilder stages={stages} setStages={setStages} />

            {/* 4. Constraints */}
            <ConstraintManager constraints={constraints} setConstraints={setConstraints} />
          </div>

          {/* Right Column: Timeline Visualization */}
          <div className="lg:col-span-8">
             <div className="print-only mb-6 hidden">
                <h1 className="text-2xl font-bold mb-2">{programName}</h1>
                <p>Date de début : {formatDateFr(new Date(startDate))}</p>
             </div>

             <Timeline calculatedStages={calculatedTimeline} />

             <div className="mt-4 text-center print:hidden">
               <p className="text-xs text-slate-400">
                 Le calcul exclut automatiquement les week-ends (sauf si activés) et les dates bloquées par des contraintes.
               </p>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
