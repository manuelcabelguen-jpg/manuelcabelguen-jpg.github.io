import React, { useState } from 'react';
import { Users, ChevronDown, FileText } from 'lucide-react';
import SectionCard from './SectionCard';
import { generateUUID } from '../utils/helpers';
import { calculateParticipantStatus } from '../utils/recommendations';

const ParticipantManager = ({ participants, setParticipants, onAddEvent, calculatedTimeline, onShowReport }) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);

    const addParticipant = () => {
        if(!code) return;
        const newId = generateUUID();
        setParticipants([...participants, {
            id: newId,
            code,
            name: name || `Participant ${code}`,
            status: 'active',
            profileSummary: '',
            completedStageIds: [],
            lastSessionCompleted: 0,
            completionDetail: ''
        }]);
        setCode(''); setName('');
    }

    const updateParticipant = (id, field, value) => {
        setParticipants(participants.map(p => p.id === id ? { ...p, [field]: value } : p));
    }

    const toggleStageCompletion = (participantId, stageId) => {
        const participant = participants.find(p => p.id === participantId);
        if (!participant) return;
        const newCompleted = participant.completedStageIds.includes(stageId)
            ? participant.completedStageIds.filter(id => id !== stageId)
            : [...participant.completedStageIds, stageId];
        updateParticipant(participantId, 'completedStageIds', newCompleted);
    };

    return (
            <SectionCard title="Gestion des Participants" icon={Users}>
            <div className="mb-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-4">
                        <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-3">
                            <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Code (ex: P-001)" className="text-xs w-full rounded border-slate-200" />
                        </div>
                        <div className="col-span-6">
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nom complet (Optionnel)" className="text-xs w-full rounded border-slate-200" />
                        </div>
                        <div className="col-span-3">
                            <button onClick={addParticipant} disabled={!code} className="w-full bg-blue-600 text-white text-xs font-bold py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">Inscrire</button>
                        </div>
                        </div>
                </div>

                {participants.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {participants.map(p => {
                            const recommendation = calculatedTimeline ? calculateParticipantStatus(p, calculatedTimeline) : "";

                            return (
                            <div key={p.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <div
                                    className="p-2 flex items-center justify-between bg-slate-50 cursor-pointer hover:bg-slate-100"
                                    onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1.5 rounded border border-blue-100 text-xs">{p.code}</span>
                                        <span className="text-sm font-medium text-slate-700">{p.name}</span>
                                        <span className={`text-[10px] px-1.5 rounded uppercase font-bold ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); onShowReport(p); }} className="p-1 text-slate-400 hover:text-blue-600" title="Rapport individuel"><FileText className="w-4 h-4" /></button>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${editingId === p.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {editingId === p.id && (
                                    <div className="p-3 border-t border-slate-100 bg-white">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Résumé de Profil</label>
                                                <textarea
                                                    className="w-full text-xs border-slate-200 rounded h-24 p-2 mb-2"
                                                    placeholder="Notes, observations, problématiques..."
                                                    value={p.profileSummary}
                                                    onChange={e => updateParticipant(p.id, 'profileSummary', e.target.value)}
                                                />
                                                {/* Recommendation Display */}
                                                <div className="bg-blue-50 border border-blue-100 rounded p-2 text-xs">
                                                    <span className="font-bold text-blue-700 uppercase block mb-1">Recommandation Calculée :</span>
                                                    <p className="text-slate-700 italic">{recommendation}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Progression & Statut</label>
                                                <div className="flex flex-col gap-2 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-600 w-16">Statut:</span>
                                                        <select
                                                            value={p.status}
                                                            onChange={e => updateParticipant(p.id, 'status', e.target.value)}
                                                            className="flex-1 text-xs border-slate-200 rounded py-1"
                                                        >
                                                            <option value="active">Actif</option>
                                                            <option value="completed">Complété</option>
                                                            <option value="suspended">Suspendu</option>
                                                            <option value="abandoned">Abandonné</option>
                                                            <option value="transferred">Transféré</option>
                                                        </select>
                                                    </div>

                                                    {p.status === 'completed' ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-slate-600 w-16">Mention:</span>
                                                            <select
                                                                value={p.completionDetail || ''}
                                                                onChange={e => updateParticipant(p.id, 'completionDetail', e.target.value)}
                                                                className="flex-1 text-xs border-slate-200 rounded py-1"
                                                            >
                                                                <option value="">-- Sélectionner --</option>
                                                                <option value="full_attendance">Présent à toutes les séances</option>
                                                                <option value="success">Réussite</option>
                                                                <option value="released">Libéré</option>
                                                                <option value="other">Autre</option>
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-slate-600 w-16">Dernière séance:</span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={p.lastSessionCompleted || 0}
                                                                onChange={e => updateParticipant(p.id, 'lastSessionCompleted', parseInt(e.target.value))}
                                                                className="w-16 text-xs border-slate-200 rounded py-1"
                                                            />
                                                            <span className="text-[10px] text-slate-400 italic">du module en cours</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-slate-400 mb-1">Cochez les étapes complétées :</div>
                                                <div className="max-h-20 overflow-y-auto border border-slate-100 rounded p-1 space-y-1">
                                                    {calculatedTimeline && calculatedTimeline.map((stage, idx) => (
                                                        <label key={stage.id} className="flex items-center gap-2 text-xs hover:bg-slate-50 p-1 rounded cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={p.completedStageIds.includes(stage.id)}
                                                                onChange={() => toggleStageCompletion(p.id, stage.id)}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className={p.completedStageIds.includes(stage.id) ? "text-slate-400 line-through" : "text-slate-700"}>
                                                                {idx + 1}. {stage.name}
                                                            </span>
                                                        </label>
                                                    ))}
                                                    {!calculatedTimeline && <div className="text-xs text-slate-400 italic">Configurez le programme d'abord.</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-4 text-slate-400 text-xs italic border border-dashed border-slate-200 rounded">Aucun participant inscrit.</div>
                )}
            </div>
            </SectionCard>
    );
};

export default ParticipantManager;
