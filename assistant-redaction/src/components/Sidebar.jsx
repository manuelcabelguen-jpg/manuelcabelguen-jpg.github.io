import React from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, Trash, Plus, Lock, Layout, UserCheck } from 'lucide-react';
import clsx from 'clsx';

export function Sidebar({
    sections,
    activeSectionId,
    setActiveSectionId,
    onAddSection,
    onDeleteSection,
    securityLevel,
    isOpen,
    onToggle
}) {
    if (!isOpen) {
        return (
            <div className="w-12 bg-white border-r border-[#E1DFDD] flex flex-col shadow-sm z-20 items-center py-4">
                <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded mb-4" title="Ouvrir le menu">
                    <Layout className="w-5 h-5 text-gray-600"/>
                </button>
                <div className="flex-1 overflow-y-auto w-full flex flex-col items-center gap-2">
                    {sections.map(s => (
                        <div
                            key={s.id}
                            onClick={() => setActiveSectionId(s.id)}
                            className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all",
                                activeSectionId === s.id ? "bg-[#0078D4] text-white" : "hover:bg-gray-100 text-gray-500"
                            )}
                            title={s.title}
                        >
                            {s.status === 'verified' ? <CheckCircle className="w-4 h-4"/> :
                             s.status === 'review_needed' ? <AlertTriangle className="w-4 h-4"/> :
                             <span className="text-xs font-bold">{s.id.slice(-1)}</span>}
                        </div>
                    ))}
                </div>
                <button onClick={onAddSection} className="mt-2 p-2 text-[#0078D4] hover:bg-[#EFF6FC] rounded-full">
                    <Plus className="w-5 h-5"/>
                </button>
            </div>
        );
    }

    return (
        <div className="w-64 bg-white border-r border-[#E1DFDD] flex flex-col shadow-sm z-20 h-full transition-all duration-300">
            <div className="h-14 bg-[#002050] flex items-center justify-between px-4 shadow-md shrink-0">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-white w-5 h-5"/>
                    <span className="font-semibold text-white text-xs tracking-wide uppercase">Gestion de Cas</span>
                </div>
                <button onClick={onToggle} className="text-white/80 hover:text-white">
                    <Layout className="w-4 h-4"/>
                </button>
            </div>

            <div className="p-4 bg-[#F8F8F8] border-b border-[#E1DFDD] shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0078D4] text-white rounded-full flex items-center justify-center font-bold">JD</div>
                    <div><div className="font-bold text-sm">DOE, John</div><div className="text-xs text-[#605E5C]">FPS: 123456A</div></div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
                {sections.map((section) => (
                    <div key={section.id}
                         className={clsx(
                             "group w-full flex items-center justify-between text-left px-4 py-3 text-sm border-l-4 transition-all cursor-pointer",
                             activeSectionId === section.id
                                ? "bg-[#E1DFDD] border-[#0078D4] font-semibold"
                                : "border-transparent text-[#323130] hover:bg-[#F3F2F1]"
                         )}
                         onClick={() => setActiveSectionId(section.id)}>
                        <span className="truncate flex-1">{section.title}</span>
                        <div className="flex items-center gap-2">
                            {section.status === 'verified' && <CheckCircle className="text-green-600 w-3 h-3"/>}
                            {section.status === 'review_needed' && <AlertTriangle className="text-orange-500 w-3 h-3"/>}
                            <button onClick={(e) => onDeleteSection(section.id, e)} className="hidden group-hover:block p-1 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded">
                                <Trash className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-2 border-t border-[#E1DFDD] shrink-0">
                <button onClick={onAddSection} className="w-full flex items-center justify-center gap-2 py-2 text-[#0078D4] hover:bg-[#EFF6FC] rounded transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" /> Nouvelle Section
                </button>
            </div>

            <div className="p-4 border-t border-[#E1DFDD] shrink-0">
                <button className={clsx(
                    "w-full flex items-center justify-between p-2 rounded border text-xs font-bold",
                    securityLevel === 'Protégé B' ? 'bg-[#FFF4CE] border-[#FDE7D9] text-[#8A6D3B]' : 'bg-white'
                )}>
                    <div className="flex items-center gap-2"><Lock className="w-3 h-3" /> {securityLevel}</div>
                </button>
            </div>
        </div>
    );
}
