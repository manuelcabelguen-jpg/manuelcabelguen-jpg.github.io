import React, { useState, useRef } from 'react';
import { Stage } from '../types';
import { Plus, Trash2, GripVertical, Layers } from 'lucide-react';

interface StageBuilderProps {
  stages: Stage[];
  setStages: React.Dispatch<React.SetStateAction<Stage[]>>;
}

export const StageBuilder: React.FC<StageBuilderProps> = ({ stages, setStages }) => {
  const [newName, setNewName] = useState('');
  const [newSessions, setNewSessions] = useState<number>(5);

  // Refs for Drag and Drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const addStage = () => {
    if (!newName.trim()) return;
    const newStage: Stage = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: newName,
      sessionsRequired: newSessions,
      order: stages.length + 1,
    };
    setStages([...stages, newStage]);
    setNewName('');
    setNewSessions(5);
  };

  const removeStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _stages = [...stages];
    const draggedItemContent = _stages.splice(dragItem.current, 1)[0];
    _stages.splice(dragOverItem.current, 0, draggedItemContent);
    const reorderedStages = _stages.map((s, index) => ({ ...s, order: index + 1 }));
    setStages(reorderedStages);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="card p-6 relative group hover:shadow-md transition-shadow duration-300">
      <div className="absolute -left-3 top-6 w-1.5 h-12 bg-blue-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2.5">
        <span className="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 text-sm font-bold rounded-lg shadow-sm print:hidden">3</span>
        Étapes du Programme
      </h3>

      <div className="space-y-3 mb-6 min-h-[100px]">
        {stages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Layers className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500 font-medium">Aucune étape définie</p>
            <p className="text-xs text-slate-400">Ajoutez des étapes ci-dessous</p>
          </div>
        )}
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            draggable
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-move transition-all group/item print:border-none print:shadow-none print:p-1"
          >
            <div className="cursor-grab active:cursor-grabbing text-slate-300 group-hover/item:text-blue-400 p-1 rounded hover:bg-slate-50 transition-colors print:hidden">
               <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-500 border border-slate-200 print:hidden">
              {index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 truncate">
                <span className="hidden print:inline mr-1">{index + 1}.</span>
                {stage.name}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 print:bg-transparent print:border-none print:text-slate-600">
              <span className="text-blue-400 font-normal print:hidden">Volume:</span>
              <strong className="text-base">{stage.sessionsRequired}</strong>
              <span className="opacity-70">séance{stage.sessionsRequired > 1 ? 's' : ''}</span>
            </div>

            <button
              onClick={() => removeStage(stage.id)}
              className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/item:opacity-100 print:hidden"
              title="Supprimer l'étape"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-200/60 no-print-inputs print:hidden">
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Nom de l'étape</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addStage()}
            placeholder="Ex: Évaluation Initiale"
            className="input-field"
          />
        </div>
        <div className="w-full sm:w-32">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Séances</label>
          <input
            type="number"
            min="1"
            value={newSessions}
            onChange={(e) => setNewSessions(parseInt(e.target.value) || 0)}
            onKeyDown={(e) => e.key === 'Enter' && addStage()}
            className="input-field text-center font-bold"
          />
        </div>
        <button
          onClick={addStage}
          disabled={!newName.trim()}
          className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>
    </div>
  );
};
