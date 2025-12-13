import React, { useState } from 'react';
import { CalculatedStage } from '../types';
import { formatDateFr } from '../utils/dateUtils';
import { Calendar, AlertCircle, CheckCircle2, List, Table as TableIcon, MoreHorizontal } from 'lucide-react';

interface TimelineProps {
  calculatedStages: CalculatedStage[];
}

export const Timeline: React.FC<TimelineProps> = ({ calculatedStages }) => {
  const [viewMode, setViewMode] = useState<'SUMMARY' | 'DETAILED'>('SUMMARY');

  if (calculatedStages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300 shadow-sm">
        <div className="bg-slate-50 p-4 rounded-full mb-3">
          <Calendar className="w-8 h-8 opacity-40" />
        </div>
        <p className="font-medium">Configurez le programme pour voir les délais.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden timeline-container print:shadow-none print:border-none">

      {/* Header Section */}
      <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center print:border-b-2 print:border-slate-800 print:px-0">
        <h2 className="text-lg font-bold text-slate-800">Calendrier Détaillé</h2>

        {/* View Toggles (Hidden in Print) */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 print:hidden">
          <button
            onClick={() => setViewMode('SUMMARY')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-semibold ${viewMode === 'SUMMARY' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visuel</span>
          </button>
          <button
            onClick={() => setViewMode('DETAILED')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-semibold ${viewMode === 'DETAILED' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tableau</span>
          </button>
        </div>
      </div>

      <div className="relative print:px-0">

        {viewMode === 'SUMMARY' ? (
          /* SUMMARY VIEW (Timeline) */
          <div className="p-6 bg-slate-50/30 min-h-[400px]">
            {/* Vertical Line */}
            <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-slate-200 print:hidden"></div>

            <div className="space-y-6 print:space-y-4">
              {calculatedStages.map((stage, idx) => (
                <div key={stage.id} className="relative flex gap-6 group print:gap-4 print:block print:border-b print:border-slate-100 print:pb-4">
                  {/* Dot */}
                  <div className={`
                    w-5 h-5 rounded-full border-[3px] border-white shadow-md z-10 flex-shrink-0 mt-5 transition-transform group-hover:scale-110 print:hidden
                    ${stage.isDelayed ? 'bg-amber-500 ring-2 ring-amber-100' : 'bg-blue-600 ring-2 ring-blue-100'}
                  `}></div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-blue-300 transition-all duration-200 print:border-none print:p-0 print:shadow-none">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                         <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-slate-500 text-xs font-bold print:hidden">
                           {idx + 1}
                         </span>
                         <h4 className="font-bold text-slate-800 text-lg print:text-base">
                           <span className="hidden print:inline mr-2">{idx + 1}.</span>
                           {stage.name}
                         </h4>
                      </div>

                      {stage.isDelayed && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 print:border-none print:bg-transparent">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Impacté
                        </div>
                      )}
                    </div>

                    <div className="mb-4 pl-9 print:pl-0">
                       <span className="inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 print:bg-slate-100 print:text-slate-700">
                         {stage.sessionsRequired} séance{stage.sessionsRequired > 1 ? 's' : ''} requise{stage.sessionsRequired > 1 ? 's' : ''}
                       </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pl-9 print:pl-0 print:grid-cols-2">
                      <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100 print:bg-transparent print:border-none print:p-0">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Date de début</span>
                        <span className="font-semibold text-slate-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 print:hidden" />
                          {formatDateFr(stage.startDate)}
                        </span>
                      </div>
                      <div className="flex flex-col p-3 rounded-lg bg-blue-50/50 border border-blue-100/50 print:bg-transparent print:border-none print:p-0">
                        <span className="text-blue-400 text-[10px] uppercase font-bold tracking-wider mb-1">Échéance estimée</span>
                        <span className="font-bold text-blue-700 flex items-center gap-2 print:text-slate-900">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 print:hidden" />
                          {formatDateFr(stage.endDate)}
                        </span>
                      </div>
                    </div>

                    {stage.isDelayed && (
                      <div className="mt-4 ml-9 text-xs bg-amber-50/50 p-3 rounded-lg text-amber-800 border border-amber-100 flex items-start gap-2 print:border-none print:p-0 print:mt-1 print:italic print:ml-0">
                        <MoreHorizontal className="w-4 h-4 mt-0.5 opacity-50 flex-shrink-0" />
                        <span><strong className="font-semibold">Note :</strong> {stage.delayReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* DETAILED VIEW (Table) */
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider min-w-[140px]">Date</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Étape</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {calculatedStages.flatMap((stage, stageIdx) =>
                  stage.details.map((day, dayIdx) => (
                    <tr key={`${stage.id}-${dayIdx}`} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-3 whitespace-nowrap">
                         <span className={`font-medium ${day.status === 'WEEKEND' ? 'text-slate-400' : 'text-slate-700'}`}>
                           {formatDateFr(day.date)}
                         </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 border border-slate-200">
                            {stageIdx + 1}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded border whitespace-nowrap ${
                            day.status === 'SESSION'
                              ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
                              : 'bg-transparent border-transparent text-slate-400'
                          }`}>
                             {stage.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {day.status === 'SESSION' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Séance
                          </span>
                        )}
                        {day.status === 'HOLIDAY' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            Férié
                          </span>
                        )}
                         {day.status === 'CONSTRAINT' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Bloqué
                          </span>
                        )}
                        {day.status === 'WEEKEND' && (
                          <span className="text-slate-400 text-xs italic opacity-60">
                            Week-end
                          </span>
                        )}
                         {day.status === 'OFF' && (
                          <span className="text-slate-300 text-xs italic">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-slate-600 text-xs">
                        {day.description || <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
