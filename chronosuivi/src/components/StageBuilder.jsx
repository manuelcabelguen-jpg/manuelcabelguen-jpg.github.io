import React, { useState, useRef } from 'react';
import { Layers, Plus, Settings, Trash2, Download, Upload, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SectionCard from './SectionCard';
import { generateUUID } from '../utils/helpers';

const SortableStageItem = ({ stage, index, participantCount, onEdit, onDelete, isEditing, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stage.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white border border-slate-200 rounded-lg shadow-sm group mb-2 touch-none">
            <div className="p-3 flex items-center gap-3">
                {/* Drag Handle */}
                <div {...attributes} {...listeners} className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1">
                    <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 cursor-pointer" onClick={() => onEdit(stage.id)}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{index + 1}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${stage.phase === 'avant' ? 'bg-indigo-50 text-indigo-600' : stage.phase === 'pendant' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{stage.phase}</span>
                        <span className="font-bold text-sm text-slate-700">{stage.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex gap-2">
                        <span>{stage.type === 'work' ? 'Travail' : stage.type === 'milestone' ? 'Jalon' : 'Attente'}</span>
                        <span>•</span>
                        <span>{stage.duration} {stage.calcMode === 'fixed_sessions' ? 'séances' : 'jours'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={() => onEdit(stage.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Settings className="w-4 h-4" /></button>
                     <button onClick={() => onDelete(stage.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>
            {children}
        </div>
    );
};

const StageBuilder = ({ stages, setStages, participantCount }) => {
    const [isEditing, setIsEditing] = useState(null);
    const fileInputRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = stages.findIndex((i) => i.id === active.id);
            const newIndex = stages.findIndex((i) => i.id === over.id);
            setStages(arrayMove(stages, oldIndex, newIndex));
        }
    };

    const addStage = () => {
        const newStage = {
            id: generateUUID(),
            name: "Nouvelle étape",
            type: "work",
            phase: "pendant",
            calcMode: "fixed",
            schedulingMode: "program_schedule",
            duration: 1,
            description: "",
            participantOverride: 0
        };
        setStages([...stages, newStage]);
        setIsEditing(newStage.id);
    };

    const updateStage = (id, field, value) => {
        setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeStage = (id) => {
        if (confirm("Supprimer cette étape ?")) {
            setStages(stages.filter(s => s.id !== id));
        }
    };

    const handleExportModel = () => {
        const data = { stages, version: "5.9", type: "model" };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `modele_stages_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const handleImportModel = (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.stages && Array.isArray(data.stages)) {
                    if(confirm(`Importer ${data.stages.length} étapes ? Cela remplacera les étapes actuelles.`)) {
                        const newStages = data.stages.map(s => ({...s, id: generateUUID()}));
                        setStages(newStages);
                    }
                } else {
                    alert("Format de modèle invalide.");
                }
            } catch (err) { alert("Erreur fichier."); }
        };
        reader.readAsText(file); e.target.value = '';
    };

    return (
        <SectionCard title="Configuration des Étapes" icon={Layers} actions={
            <div className="flex gap-1">
                <button onClick={handleExportModel} className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50" title="Exporter le modèle"><Download className="w-4 h-4" /></button>
                <button onClick={() => fileInputRef.current?.click()} className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50" title="Importer un modèle"><Upload className="w-4 h-4" /></button>
                <input type="file" ref={fileInputRef} onChange={handleImportModel} className="hidden" accept=".json" />
            </div>
        }>
            <div className="mb-4">
                <button onClick={addStage} className="w-full py-2 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 font-bold text-xs hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Ajouter une étape
                </button>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar p-1">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        {stages.map((stage, index) => (
                            <SortableStageItem
                                key={stage.id}
                                stage={stage}
                                index={index}
                                participantCount={participantCount}
                                onEdit={(id) => setIsEditing(isEditing === id ? null : id)}
                                onDelete={removeStage}
                                isEditing={isEditing === stage.id}
                            >
                                {isEditing === stage.id && (
                                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-8">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nom de l'étape</label>
                                                <input type="text" value={stage.name} onChange={(e) => updateStage(stage.id, 'name', e.target.value)} className="w-full text-xs border-slate-200 rounded" />
                                            </div>
                                            <div className="col-span-4">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Phase</label>
                                                <select value={stage.phase} onChange={(e) => updateStage(stage.id, 'phase', e.target.value)} className="w-full text-xs border-slate-200 rounded">
                                                    <option value="avant">Avant</option>
                                                    <option value="pendant">Pendant</option>
                                                    <option value="apres">Après</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-4">
                                                 <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Type</label>
                                                 <select value={stage.type} onChange={(e) => updateStage(stage.id, 'type', e.target.value)} className="w-full text-xs border-slate-200 rounded">
                                                    <option value="work">Travail</option>
                                                    <option value="milestone">Jalon (Date fixe)</option>
                                                    <option value="delay">Attente (Délai)</option>
                                                </select>
                                            </div>
                                            <div className="col-span-4">
                                                 <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Durée / Qté</label>
                                                 <input type="number" min="0" step="0.5" value={stage.duration} onChange={(e) => updateStage(stage.id, 'duration', parseFloat(e.target.value))} className="w-full text-xs border-slate-200 rounded" />
                                            </div>
                                            <div className="col-span-4">
                                                 <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mode Calcul</label>
                                                 <select value={stage.calcMode} onChange={(e) => updateStage(stage.id, 'calcMode', e.target.value)} disabled={stage.type !== 'work'} className="w-full text-xs border-slate-200 rounded disabled:opacity-50">
                                                    <option value="fixed">Fixe (Jours)</option>
                                                    <option value="fixed_sessions">Fixe (Séances)</option>
                                                    <option value="linear_1d">Linéaire (1j/p)</option>
                                                    <option value="linear_0.5d">Linéaire (0.5j/p)</option>
                                                    <option value="capacity_4d">Capacité (4/j)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-6">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Planification</label>
                                                <select value={stage.schedulingMode} onChange={(e) => updateStage(stage.id, 'schedulingMode', e.target.value)} disabled={stage.type !== 'work'} className="w-full text-xs border-slate-200 rounded disabled:opacity-50">
                                                    <option value="any_weekday">Jours ouvrables (Lun-Ven)</option>
                                                    <option value="program_schedule">Selon Horaire Programme</option>
                                                </select>
                                            </div>
                                            <div className="col-span-6">
                                                 <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Participants (Override)</label>
                                                 <input type="number" min="0" placeholder={`Défaut: ${participantCount}`} value={stage.participantOverride || ''} onChange={(e) => updateStage(stage.id, 'participantOverride', parseInt(e.target.value) || 0)} className="w-full text-xs border-slate-200 rounded" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Description</label>
                                            <input type="text" value={stage.description} onChange={(e) => updateStage(stage.id, 'description', e.target.value)} className="w-full text-xs border-slate-200 rounded" />
                                        </div>
                                    </div>
                                )}
                            </SortableStageItem>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </SectionCard>
    );
};

export default StageBuilder;
