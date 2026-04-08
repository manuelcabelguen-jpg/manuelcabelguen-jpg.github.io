import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Clock, RotateCcw, Printer, ArrowRight, Shield, Layers, AlertTriangle,
    Settings, Upload, FileJson, FileSpreadsheet, LayoutTemplate, Users,
    FileText, Undo, Redo, LayoutDashboard, List, Archive
} from 'lucide-react';
import { PROGRAM_TEMPLATES } from './data/templates';
import { calculateTimeline, generateFederalHolidays } from './utils/calculation';
import { parseDate, addDays, formatDateFr, formatDateShort, generateUUID } from './utils/helpers';
import { useUndoRedo } from './hooks/useUndoRedo';

// Components
import SectionCard from './components/SectionCard';
import ParticipantManager from './components/ParticipantManager';
import ParticipantEventManager from './components/ParticipantEventManager';
import ScheduleManager from './components/ScheduleManager';
import ScheduleChangeManager from './components/ScheduleChangeManager';
import StageBuilder from './components/StageBuilder';
import ConstraintManager from './components/ConstraintManager';
import Timeline from './components/Timeline';
import ManagementReport from './components/ManagementReport';
import ParticipantReport from './components/ParticipantReport';
import Dashboard from './components/Dashboard';
import ArchiveManager from './components/ArchiveManager';

const STORAGE_KEY = 'chronosuivi_v590_react';

const loadState = (key, defaultValue) => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY + '_' + key);
        return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) { return defaultValue; }
};

const defaultScheduleNew = [
    { dayIndex: 1, label: 'Lun', am: true, pm: true },
    { dayIndex: 2, label: 'Mar', am: true, pm: true },
    { dayIndex: 3, label: 'Mer', am: true, pm: true },
    { dayIndex: 4, label: 'Jeu', am: true, pm: true },
    { dayIndex: 5, label: 'Ven', am: true, pm: true },
    { dayIndex: 6, label: 'Sam', am: false, pm: false },
    { dayIndex: 0, label: 'Dim', am: false, pm: false },
];

function App() {
    const fileInputRef = useRef(null);

    // Initial State Construction
    const getInitialState = () => ({
        programName: loadState('programName', 'Programme MPCI-DS-IÉ'),
        intervenantName: loadState('intervenantName', ''),
        participantCount: loadState('participantCount', 10),
        marginPercent: loadState('marginPercent', 15),
        startDate: loadState('startDate', new Date().toISOString().split('T')[0]),
        schedule: loadState('schedule', defaultScheduleNew),
        scheduleChanges: loadState('scheduleChanges', []),
        stages: loadState('stages', PROGRAM_TEMPLATES[0].stages),
        constraints: loadState('constraints', generateFederalHolidays()),
        participantEvents: loadState('participantEvents', []),
        participants: loadState('participants', [])
    });

    const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo(getInitialState());

    // Destructure state
    const {
        programName, intervenantName, participantCount, marginPercent, startDate,
        schedule, scheduleChanges, stages, constraints, participantEvents, participants
    } = state;

    // UI State
    const [selectedTemplate, setSelectedTemplate] = useState('mpci');
    const [showReport, setShowReport] = useState(false);
    const [selectedParticipantForReport, setSelectedParticipantForReport] = useState(null);
    const [showArchives, setShowArchives] = useState(false);
    const [isSaved, setIsSaved] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'dashboard'

    // Helpers
    const updateState = (key, value) => setState({ ...state, [key]: value });

    const setProgramName = (v) => updateState('programName', v);
    const setParticipantCount = (v) => updateState('participantCount', v);
    const setMarginPercent = (v) => updateState('marginPercent', v);
    const setStartDate = (v) => updateState('startDate', v);
    const setSchedule = (v) => updateState('schedule', v);
    const setScheduleChanges = (v) => updateState('scheduleChanges', v);
    const setStages = (v) => updateState('stages', v);
    const setConstraints = (v) => updateState('constraints', v);
    const setParticipantEvents = (v) => updateState('participantEvents', v);
    const setParticipants = (v) => updateState('participants', v);

    // Persistence
    useEffect(() => {
        setIsSaved(false);
        const timer = setTimeout(() => {
            Object.keys(state).forEach(key => {
                localStorage.setItem(STORAGE_KEY + '_' + key, JSON.stringify(state[key]));
            });
            setIsSaved(true);
        }, 800);
        return () => clearTimeout(timer);
    }, [state]);

    // Sync participant count
    useEffect(() => {
        if (participants.length > 0) {
            const activeCount = participants.filter(p => p.status === 'active').length;
            if (activeCount > 0 && activeCount !== participantCount) {
                setParticipantCount(activeCount);
            }
        }
    }, [participants]);

    // Calculation
    const calculatedTimeline = useMemo(() => {
        return calculateTimeline(startDate, stages, constraints, schedule, participantCount, participantEvents, scheduleChanges);
    }, [startDate, stages, constraints, schedule, participantCount, participantEvents, scheduleChanges]);

    const totalSessions = calculatedTimeline.filter(s => s.type === 'work').reduce((acc, s) => acc + (s.effectiveWorkDays || 0), 0);
    const finishDate = calculatedTimeline.length > 0 ? calculatedTimeline[calculatedTimeline.length - 1].endDate : parseDate(startDate);
    const startObj = parseDate(startDate);
    let totalDurationDays = 0;
    if (!isNaN(startObj.getTime()) && !isNaN(finishDate.getTime())) totalDurationDays = Math.ceil((finishDate.getTime() - startObj.getTime()) / (1000 * 3600 * 24));
    const safeDate = addDays(finishDate, Math.ceil(totalDurationDays * (marginPercent / 100)));

    // Actions
    const handleApplyTemplate = () => {
        if (window.confirm("Attention : Appliquer ce modèle remplacera toutes les étapes actuelles. Continuer ?")) {
            const tpl = PROGRAM_TEMPLATES.find(t => t.id === selectedTemplate);
            if (tpl) {
                setState({
                    ...state,
                    programName: tpl.defaultName,
                    participantCount: tpl.defaultParticipants,
                    stages: tpl.stages.map(s => ({ ...s, id: generateUUID() }))
                });
            }
        }
    };

    const handleReset = () => {
        if (window.confirm("Tout réinitialiser ?")) {
            const keys = Object.keys(state);
            keys.forEach(k => localStorage.removeItem(STORAGE_KEY + '_' + k));
            window.location.reload();
        }
    };

    const handleExportJSON = () => {
        const data = { ...state, version: "5.9" };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `config_chrono_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                setState({ ...state, ...data });
                alert("Configuration chargée !");
            } catch (err) { alert("Erreur fichier."); }
        };
        reader.readAsText(file); e.target.value = '';
    };

    const handleExportCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,Phase,Type,Mode,Étape,Description,Durée,Participants Actifs,Date Début,Date Fin,Tâches Admin\n";
        calculatedTimeline.forEach(s => {
            const adminSummary = s.adminTasks ? s.adminTasks.map(t => `${t.label}`).join('; ') : '';
            csvContent += `${s.phase},${s.type},${s.schedulingMode},"${s.name}","${s.description}",${s.effectiveWorkDays}j,${s.usedParticipantCount},${formatDateShort(s.startDate)},${formatDateShort(s.endDate)},"${adminSummary}"\n`;
        });
        const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "export.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-slate-100 pb-20 print:bg-white print:pb-0 font-sans">
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />

            {/* Modals */}
            {showReport && (
                <ManagementReport onClose={() => setShowReport(false)} data={{ ...state, calculatedTimeline }} />
            )}
            {selectedParticipantForReport && (
                <ParticipantReport
                    participant={selectedParticipantForReport}
                    calculatedTimeline={calculatedTimeline}
                    events={participantEvents}
                    onClose={() => setSelectedParticipantForReport(null)}
                />
            )}
            {showArchives && (
                <ArchiveManager
                    currentState={state}
                    onLoadState={(data) => setState(data)}
                    onClose={() => setShowArchives(false)}
                />
            )}

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 print:hidden shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-blue-700 to-blue-600 p-2 rounded-lg shadow-md shadow-blue-500/20"><Clock className="text-white w-6 h-6" /></div>
                        <div><h1 className="text-xl font-bold text-slate-800 leading-none">ChronoSuivi</h1><p className="text-[10px] uppercase font-bold text-blue-500 tracking-wider mt-0.5">Gestion de délais</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2 border border-slate-200">
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`} title="Vue Liste"><List className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('dashboard')} className={`p-1.5 rounded transition-all ${viewMode === 'dashboard' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`} title="Tableau de Bord"><LayoutDashboard className="w-4 h-4" /></button>
                        </div>

                        {/* Undo/Redo Controls */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2 border border-slate-200">
                            <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded hover:bg-white hover:shadow text-slate-500 disabled:opacity-30 transition-all" title="Annuler"><Undo className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-300 mx-1"></div>
                            <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded hover:bg-white hover:shadow text-slate-500 disabled:opacity-30 transition-all" title="Rétablir"><Redo className="w-4 h-4" /></button>
                        </div>

                        <span className={`hidden md:flex text-xs font-bold items-center gap-1.5 px-3 py-1.5 rounded-full ${isSaved ? 'text-green-700 bg-green-50 border border-green-100' : 'text-amber-700 bg-amber-50 border border-amber-100'}`}><span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>{isSaved ? 'Enregistré' : '...'}</span>
                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowArchives(true)} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-all" title="Gérer les Archives (Dossier Local)"><Archive className="w-5 h-5 text-indigo-600" /></button>
                            <div className="w-px h-8 bg-slate-200 mx-1"></div>
                            <button onClick={() => setShowReport(true)} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-all" title="Rapport de Gestion"><FileText className="w-5 h-5 text-blue-600" /></button>
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-all" title="Importer Configuration"><Upload className="w-5 h-5" /></button>
                            <button onClick={handleExportJSON} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-all" title="Sauvegarder"><FileJson className="w-5 h-5" /></button>
                            <button onClick={handleExportCSV} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-all" title="Excel"><FileSpreadsheet className="w-5 h-5" /></button>
                            <button onClick={() => window.print()} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all" title="Imprimer"><Printer className="w-5 h-5" /></button>
                        </div>
                        <button onClick={handleReset} className="ml-2 text-slate-400 hover:text-red-600 p-2 rounded-lg transition-colors hover:bg-red-50"><RotateCcw className="w-5 h-5" /></button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* DASHBOARD HEADER */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 print:hidden">
                    <div className="md:col-span-8 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <div className="absolute -top-10 -right-10 p-10 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-700"><CalendarRange className="w-64 h-64" /></div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div><p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-1 opacity-80">Fin Optimale Estimée</p><h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-8 text-white drop-shadow-sm">{formatDateFr(finishDate)}</h2></div>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 flex items-center gap-4 hover:bg-white/20 transition-colors">
                                    <div className="bg-white/20 p-2.5 rounded-lg"><ArrowRight className="w-5 h-5 text-white" /></div>
                                    <div><p className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">Durée Totale</p><p className="text-xl font-bold">{totalDurationDays} jours</p></div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 flex items-center gap-4 hover:bg-white/20 transition-colors">
                                    <div className="bg-white/20 p-2.5 rounded-lg"><Shield className="w-5 h-5 text-white" /></div>
                                    <div><p className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">Sécurité (+{marginPercent}%)</p><p className="text-xl font-bold">{formatDateFr(safeDate)}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-4 flex flex-col gap-4">
                        <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center group hover:border-blue-200 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4"><div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><Layers className="w-6 h-6" /></div><span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Jours de Travail</span></div>
                                <span className="text-4xl font-bold text-slate-800">{totalSessions}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }}></div></div>
                            <p className="text-right text-xs text-slate-400 mt-2 font-medium">Jours ouvrés requis</p>
                        </div>
                        <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center group hover:border-amber-200 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4"><div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all"><AlertTriangle className="w-6 h-6" /></div><span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Contraintes</span></div>
                                <span className="text-4xl font-bold text-slate-800">{constraints.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                {viewMode === 'dashboard' ? (
                    <Dashboard participants={participants} stages={stages} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-4 space-y-6">
                            <SectionCard title="Paramètres du Programme" icon={Settings}>
                                <div className="space-y-4">
                                    {/* TEMPLATE SELECTOR */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-2">
                                        <label className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1 block flex items-center gap-1"><LayoutTemplate className="w-3 h-3" /> Modèle de Programme</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedTemplate}
                                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                                className="flex-1 text-xs border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {PROGRAM_TEMPLATES.map(tpl => (
                                                    <option key={tpl.id} value={tpl.id}>{tpl.label}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleApplyTemplate}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm transition-colors"
                                            >
                                                Appliquer
                                            </button>
                                        </div>
                                    </div>

                                    <div><label className="block text-xs font-semibold text-slate-500 mb-1">Nom du Programme</label><input type="text" value={programName} onChange={(e) => setProgramName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ex: Programme Alpha" /></div>
                                    <div><label className="block text-xs font-semibold text-slate-500 mb-1">Date de démarrage</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none" /></div>
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-600 mb-1">Nombre de Participants (Actifs)</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-2.5 text-blue-400 w-4 h-4" />
                                            <input type="number" min="1" value={participantCount} onChange={(e) => setParticipantCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-blue-50 border border-blue-200 rounded-lg pl-9 pr-3 py-2 text-sm font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">Calculé automatiquement si des participants sont ajoutés.</p>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100">
                                        <div className="flex justify-between items-center mb-1"><label className="block text-xs font-semibold text-slate-500">Marge de sécurité</label><span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{marginPercent}%</span></div>
                                        <input type="range" min="0" max="50" step="5" value={marginPercent} onChange={(e) => setMarginPercent(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                                    </div>
                                </div>
                            </SectionCard>

                            <ParticipantManager
                                participants={participants}
                                setParticipants={setParticipants}
                                onAddEvent={setParticipantEvents}
                                calculatedTimeline={calculatedTimeline}
                                onShowReport={setSelectedParticipantForReport}
                            />
                            <ParticipantEventManager events={participantEvents} setEvents={setParticipantEvents} participants={participants} />

                            <div className="print:hidden"><ScheduleManager schedule={schedule} setSchedule={setSchedule} /></div>
                            <div className="print:hidden"><ScheduleChangeManager changes={scheduleChanges} setChanges={setScheduleChanges} initialSchedule={schedule} /></div>

                            <StageBuilder stages={stages} setStages={setStages} participantCount={participantCount} />
                            <ConstraintManager constraints={constraints} setConstraints={setConstraints} />
                        </div>
                        <div className="lg:col-span-8">
                            <div className="print-only mb-6 hidden"><h1 className="text-2xl font-bold mb-2">{programName}</h1><p>Date de début : {formatDateFr(new Date(startDate))}</p><p>Participants : {participantCount}</p></div>
                            <Timeline calculatedStages={calculatedTimeline} />
                            <div className="mt-4 text-center print:hidden"><p className="text-xs text-slate-400">Le calcul exclut les jours non travaillés et les contraintes.</p></div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
