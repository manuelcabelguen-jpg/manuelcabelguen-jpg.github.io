import React from 'react';
import { DaySchedule } from '../types';
import { Zap } from 'lucide-react';

interface ScheduleManagerProps {
  schedule: DaySchedule[];
  setSchedule: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({ schedule, setSchedule }) => {

  const updateSessions = (dayIndex: number, count: number) => {
    setSchedule(prev => prev.map(day =>
      day.dayIndex === dayIndex ? { ...day, sessionsCount: Math.max(0, Math.min(10, count)) } : day
    ));
  };

  const totalSessionsPerWeek = schedule.reduce((acc, curr) => acc + curr.sessionsCount, 0);

  return (
    <div className="card p-6 relative group hover:shadow-md transition-shadow duration-300">
      <div className="absolute -left-3 top-6 w-1.5 h-12 bg-purple-500 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 bg-purple-100 text-purple-700 text-sm font-bold rounded-lg shadow-sm">2</span>
          Rythme Hebdomadaire
        </h3>
        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
          {totalSessionsPerWeek} / sem.
        </span>
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-white p-3 rounded-lg border border-slate-100 mb-6 text-sm text-slate-600 flex items-start gap-3">
        <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-100 text-purple-600">
           <Zap className="w-4 h-4" />
        </div>
        <p className="leading-snug mt-0.5">
          Indiquez le nombre de séances données pour chaque jour de la semaine.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {schedule.map((day) => {
           const isActive = day.sessionsCount > 0;
           return (
            <div key={day.dayIndex} className="relative group/day">
              <div
                className={`
                  flex flex-col items-center justify-between p-2 sm:p-3 rounded-xl border transition-all duration-200 cursor-default h-full
                  ${isActive
                    ? 'bg-purple-50/50 border-purple-200 shadow-sm ring-1 ring-purple-500/10'
                    : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }
                `}
              >
                <span className={`text-[10px] uppercase font-bold tracking-wider mb-2 ${isActive ? 'text-purple-700' : 'text-slate-400'}`}>
                  {day.label}
                </span>

                <input
                  type="number"
                  min="0"
                  max="10"
                  value={day.sessionsCount}
                  onChange={(e) => updateSessions(day.dayIndex, parseInt(e.target.value) || 0)}
                  className={`
                    w-full text-center py-1 rounded-md font-bold text-xl outline-none bg-transparent transition-colors
                    ${isActive ? 'text-purple-700' : 'text-slate-300 group-hover/day:text-slate-400'}
                  `}
                />

                <div className={`h-1 w-8 rounded-full mt-2 transition-colors ${isActive ? 'bg-purple-400' : 'bg-slate-200'}`}></div>
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};
