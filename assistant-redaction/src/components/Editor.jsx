import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Bot, ArrowDown, Sparkles, FileText, FileSearch } from 'lucide-react';
import { SectionType, SourceType } from '../constants';

export function Editor({
    activeSection,
    onContentChange,
    isGenerating,
    sources,
    toggleSourceSelection,
    handleCopilotGenerate,
    handleToggleAiForFixed,
    notification
}) {
    // Custom toolbar for Quill
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['clean']
        ],
    };

    if (!activeSection) return <div className="flex-1 flex items-center justify-center text-gray-400">Sélectionnez une section</div>;

    return (
        <div className={`flex-1 flex flex-col p-8 h-full transition-all duration-300`}>
            <div className={`bg-white shadow-sm border border-[#E1DFDD] flex-1 rounded-lg flex flex-col relative overflow-hidden ${isGenerating ? 'generating-active' : ''}`}>
                {notification && (
                    <div className={`absolute top-0 left-0 right-0 p-2 text-xs font-medium text-center z-20 transition-all ${notification.type === 'info' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                        {notification.message}
                    </div>
                )}

                <div className="flex-1 overflow-auto flex flex-col">
                    <ReactQuill
                        theme="snow"
                        value={activeSection.content || ''}
                        onChange={onContentChange}
                        modules={modules}
                        className="flex-1 flex flex-col h-full"
                    />
                </div>

                {/* Action Bar (Footer) */}
                <div className="p-4 border-t border-[#E1DFDD] bg-[#FAF9F8] flex flex-col gap-3 shrink-0 z-10">

                    {/* Cas: Section Fixe -> Option pour activer l'IA */}
                    {activeSection.type === SectionType.FIXED && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 italic">Cette section est en mode texte simple.</span>
                            <button onClick={handleToggleAiForFixed} className="text-[#0078D4] text-xs font-medium hover:underline flex items-center gap-1"><Sparkles className="w-3 h-3"/> Activer l'Assistant IA</button>
                        </div>
                    )}

                    {/* Cas: Section Dynamique -> Outils IA */}
                    {activeSection.type === SectionType.DYNAMIC && !isGenerating && (
                        <div>
                            {/* Sélecteur de sources */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mb-2">
                                <span className="text-xs font-semibold text-[#605E5C] whitespace-nowrap mr-2">SOURCES UTILISÉES :</span>
                                {sources.map(src => {
                                    const isSelected = activeSection.selectedSourceIds && activeSection.selectedSourceIds.includes(src.id);
                                    return (
                                        <button key={src.id} onClick={() => toggleSourceSelection(src.id)} className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] border transition-all whitespace-nowrap ${isSelected ? 'bg-[#EFF6FC] border-[#0078D4] text-[#0078D4] font-medium' : 'bg-white border-[#E1DFDD] text-[#605E5C] hover:bg-gray-100'}`}>
                                            {src.type === SourceType.IMAGE ? <FileSearch className="w-3 h-3"/> : <FileText className="w-3 h-3"/>}
                                            {src.title}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-[#605E5C]">
                                    <Sparkles className="text-purple-600 w-4 h-4"/>
                                    <span>{((activeSection.selectedSourceIds && activeSection.selectedSourceIds.length) || 0) === 0 ? "Aucune source liée" : `${activeSection.selectedSourceIds && activeSection.selectedSourceIds.length} source(s) liée(s)`}</span>
                                </div>

                                {/* BOUTONS D'ACTION HYBRIDES */}
                                <div className="flex gap-2">
                                    {activeSection.content && activeSection.content.length > 0 && (
                                        <button
                                            onClick={() => handleCopilotGenerate('append')}
                                            disabled={!activeSection.prompt}
                                            className="px-3 py-2 bg-white border border-[#0078D4] text-[#0078D4] text-sm font-medium rounded hover:bg-[#EFF6FC] flex items-center gap-2 shadow-sm"
                                            title="Ajoute le texte généré à la suite de votre texte actuel"
                                        >
                                            <ArrowDown className="w-4 h-4"/> Compléter
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleCopilotGenerate('replace')}
                                        disabled={!activeSection.prompt}
                                        className="px-4 py-2 bg-[#0078D4] text-white text-sm font-medium rounded hover:bg-[#106EBE] flex items-center gap-2 shadow-sm"
                                        title={activeSection.content && activeSection.content.length > 0 ? "Remplace tout le contenu actuel" : "Générer le contenu"}
                                    >
                                        <Bot className="w-4 h-4"/> {activeSection.content && activeSection.content.length > 0 ? 'Régénérer' : 'Générer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {isGenerating && <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center rounded-lg backdrop-blur-[1px]"><div className="flex flex-col items-center"><div className="w-8 h-8 border-2 border-t-[#0078D4] border-gray-200 rounded-full animate-spin mb-2"></div><span className="text-xs text-[#0078D4] font-medium">Rédaction IA en cours...</span></div></div>}
            </div>
        </div>
    );
}
