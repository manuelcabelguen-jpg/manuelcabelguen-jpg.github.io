import React from 'react';
import { Users, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

const Dashboard = ({ participants, stages }) => {
    // 1. Calculate Stats
    const total = participants.length;
    const active = participants.filter(p => p.status === 'active').length;
    const completed = participants.filter(p => p.status === 'completed').length;
    const abandoned = participants.filter(p => p.status === 'abandoned').length;

    const retentionRate = (completed + active + abandoned) > 0
        ? Math.round(((completed + active) / (completed + active + abandoned)) * 100)
        : 100;

    // 2. Group by Stage (Kanban)
    const participantsByStage = stages.reduce((acc, stage) => {
        acc[stage.id] = [];
        return acc;
    }, {});
    participantsByStage['done'] = [];

    participants.forEach(p => {
        if (p.status !== 'active') return;

        // Find first incomplete stage
        const currentStageIndex = stages.findIndex(s => !p.completedStageIds.includes(s.id));
        if (currentStageIndex === -1) {
            participantsByStage['done'].push(p);
        } else {
            const stageId = stages[currentStageIndex].id;
            if (participantsByStage[stageId]) {
                participantsByStage[stageId].push(p);
            }
        }
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-6 h-6"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Total</p><p className="text-2xl font-bold">{total}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Activity className="w-6 h-6"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Actifs</p><p className="text-2xl font-bold">{active}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><CheckCircle2 className="w-6 h-6"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Complétés</p><p className="text-2xl font-bold">{completed}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle className="w-6 h-6"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Rétention</p><p className="text-2xl font-bold">{retentionRate}%</p></div>
                </div>
            </div>

            {/* Kanban Board */}
            <div>
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-blue-600"/> Répartition par Étape (Kanban)</h3>
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <div className="flex gap-4 min-w-max">
                        {stages.map((stage, idx) => (
                            <div key={stage.id} className="w-64 flex-shrink-0 flex flex-col">
                                <div className="mb-2 flex items-center justify-between px-1">
                                    <span className="font-bold text-xs text-slate-500 uppercase truncate max-w-[180px]" title={stage.name}>{idx + 1}. {stage.name}</span>
                                    <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{participantsByStage[stage.id]?.length || 0}</span>
                                </div>
                                <div className="bg-slate-100/50 border border-slate-200 rounded-lg p-2 min-h-[150px] flex flex-col gap-2">
                                    {participantsByStage[stage.id]?.map(p => (
                                        <div key={p.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-mono font-bold text-blue-600 text-xs bg-blue-50 px-1 rounded">{p.code}</span>
                                            </div>
                                            <div className="text-sm font-medium text-slate-800 truncate">{p.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {/* Done Column */}
                        <div className="w-64 flex-shrink-0 flex flex-col">
                            <div className="mb-2 flex items-center justify-between px-1">
                                <span className="font-bold text-xs text-green-600 uppercase">Terminé</span>
                                <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{participantsByStage['done']?.length || 0}</span>
                            </div>
                            <div className="bg-green-50/30 border border-green-100 rounded-lg p-2 min-h-[150px] flex flex-col gap-2">
                                {participantsByStage['done']?.map(p => (
                                    <div key={p.id} className="bg-white p-3 rounded-lg border border-green-200 shadow-sm opacity-75">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-mono font-bold text-green-600 text-xs bg-green-50 px-1 rounded">{p.code}</span>
                                        </div>
                                        <div className="text-sm font-medium text-slate-800 truncate">{p.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
