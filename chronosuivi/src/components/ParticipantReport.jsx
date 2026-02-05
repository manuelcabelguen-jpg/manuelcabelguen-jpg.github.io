import React from 'react';
import { X, Layers, CheckCircle2, UserMinus } from 'lucide-react';
import { formatDateShort, parseDate } from '../utils/helpers';
import { calculateParticipantStatus } from '../utils/recommendations';

const ParticipantReport = ({ participant, calculatedTimeline, events, onClose }) => {
    if (!participant) return null;

    const workStages = calculatedTimeline.filter(s => s.type !== 'delay');
    const totalWorkStages = workStages.length;
    const completedCount = participant.completedStageIds.filter(id => calculatedTimeline.find(s => s.id === id && s.type !== 'delay')).length;
    const progress = totalWorkStages > 0 ? Math.round((completedCount / totalWorkStages) * 100) : 0;

    const participantEvents = events.filter(ev => ev.participantName.includes(participant.code) || ev.participantName.includes(participant.name));

    // Calculate Recommendation
    const recommendation = calculateParticipantStatus(participant, calculatedTimeline);

    const getMentionLabel = (key) => {
        switch(key) {
            case 'full_attendance': return 'Présent à toutes les séances';
            case 'success': return 'Réussite';
            case 'released': return 'Libéré';
            case 'other': return 'Autre';
            default: return '-';
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 print:p-0 report-modal-open">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl print:max-h-none print:rounded-none print:shadow-none modal-content">
                <div className="bg-slate-900 text-white p-6 print:bg-white print:text-black print:border-b-2 print:border-black flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">Dossier Participant</h2>
                        <p className="text-blue-200 print:text-slate-600 font-medium text-lg">{participant.code} - {participant.name}</p>
                    </div>
                    <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${participant.status === 'active' ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-200'}`}>{participant.status}</span>
                        {participant.status === 'completed' && participant.completionDetail && (
                            <div className="mt-2 text-xs text-blue-200 font-medium">Mention : {getMentionLabel(participant.completionDetail)}</div>
                        )}
                        <button onClick={onClose} className="block mt-4 ml-auto bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded text-sm print:hidden"><X className="w-4 h-4 inline mr-1"/> Fermer</button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Recommendation Section (Prominent) */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Recommandation / Statut</h3>
                        <p className="text-lg text-slate-800 font-medium">{recommendation}</p>
                    </div>

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Progression Globale</h3>
                            <div className="bg-slate-100 rounded-full h-4 overflow-hidden mb-2">
                                <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                                <span>{completedCount} étapes complétées</span>
                                <span>{progress}%</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Résumé Profil</h3>
                            <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-700 italic min-h-[80px]">
                                {participant.profileSummary || "Aucune note de profil."}
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-blue-600"/> Suivi des Étapes</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600 uppercase text-xs">
                                        <th className="p-3 border-b border-slate-200 w-16">Statut</th>
                                        <th className="p-3 border-b border-slate-200">Étape</th>
                                        <th className="p-3 border-b border-slate-200">Dates Prévues (Prog.)</th>
                                        <th className="p-3 border-b border-slate-200 text-right">Durée</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calculatedTimeline.map((stage, idx) => {
                                        const isCompleted = participant.completedStageIds.includes(stage.id);
                                        const isDelay = stage.type === 'delay';

                                        return (
                                            <tr key={stage.id} className={`border-b border-slate-50 ${isCompleted ? 'bg-green-50/50' : 'hover:bg-slate-50'}`}>
                                                <td className="p-3">
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <div className={`font-medium ${isCompleted ? 'text-green-900' : 'text-slate-800'}`}>{idx + 1}. {stage.name}</div>
                                                    {isDelay && <span className="text-[10px] uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Attente</span>}
                                                </td>
                                                <td className="p-3 font-mono text-slate-600 text-xs">
                                                    {formatDateShort(stage.startDate)} - {formatDateShort(stage.endDate)}
                                                </td>
                                                <td className="p-3 text-right text-slate-500">
                                                    {stage.type === 'work' ? `${stage.effectiveWorkDays}j` : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {participantEvents.length > 0 && (
                        <section className="break-inside-avoid">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2"><UserMinus className="w-5 h-5 text-red-600"/> Historique des Mouvements</h3>
                            <ul className="space-y-2">
                                {participantEvents.map(ev => (
                                    <li key={ev.id} className="flex gap-4 text-sm p-3 bg-slate-50 rounded border border-slate-100">
                                        <span className="font-mono font-bold text-slate-600">{formatDateShort(parseDate(ev.date))}</span>
                                        <span className="font-bold text-red-700 uppercase">{ev.type}</span>
                                        <span className="text-slate-500 italic">Impact global: {ev.change}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParticipantReport;
