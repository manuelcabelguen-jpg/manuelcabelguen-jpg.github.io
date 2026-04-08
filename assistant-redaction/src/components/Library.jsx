import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, FileSearch, Upload, X, Calendar, User, BookTemplate, FilePlus, CheckCircle } from 'lucide-react';
import { SourceType } from '../constants';

export function Library({
    sources,
    promptTemplates,
    activeSection,
    onAddSource,
    onDeleteSource,
    previewSourceId,
    setPreviewSourceId,
    activeSourceData,
    showHiddenLogic,
    showSavePrompt,
    setShowSavePrompt,
    newTemplateName,
    setNewTemplateName,
    handleSaveCurrentPromptAsTemplate,
    handleTemplateSelect,
    onUpdateSectionPrompt
}) {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const newSource = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    title: file.name,
                    type: file.type.startsWith('image/') ? SourceType.IMAGE : SourceType.TEXT,
                    content: "Contenu extrait...",
                    docType: "Document Uploadé",
                    author: "Utilisateur",
                    date: new Date().toISOString().split('T')[0],
                    createdAt: Date.now()
                };
                onAddSource(newSource);
            };
            reader.readAsText(file);
        });
    }, [onAddSource]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    if (previewSourceId && activeSourceData) {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] border-l border-[#E1DFDD] animate-in slide-in-from-right-10 duration-200">
                <div className="h-10 border-b border-[#E1DFDD] bg-white flex items-center justify-between px-4 shrink-0">
                    <span className="text-xs font-bold text-[#605E5C] uppercase flex items-center gap-2"><FileSearch className="w-4 h-4"/> Source</span>
                    <button onClick={() => setPreviewSourceId(null)} className="text-[#605E5C] hover:text-black"><X className="w-4 h-4"/></button>
                </div>
                <div className="bg-white px-8 pt-6 pb-2 border-b border-dashed border-[#E1DFDD] shrink-0">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{activeSourceData.docType}</h3>
                    <div className="flex items-center gap-4 text-xs text-[#605E5C]"><User className="w-3 h-3" /> {activeSourceData.author} • <Calendar className="w-3 h-3" /> {activeSourceData.date}</div>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="bg-white border border-[#E1DFDD] shadow-sm p-8 min-h-[400px]">
                        <p className="font-mono text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{activeSourceData.content}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white border-l border-[#E1DFDD] z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
            <div className="p-4 border-b border-[#E1DFDD] bg-[#FAF9F8] flex justify-between items-center shrink-0">
                <h3 className="text-sm font-semibold text-[#323130]">Bibliothèque</h3>
                <div {...getRootProps()} className="cursor-pointer">
                    <input {...getInputProps()} />
                    <button className="p-1 hover:bg-gray-200 rounded text-[#0078D4]" title="Uploader ou glisser-déposer">
                        <Upload className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isDragActive && (
                <div className="p-4 bg-blue-50 text-blue-600 text-xs text-center border-b border-blue-100">
                    Déposez les fichiers ici...
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {sources.map(source => (
                    <div key={source.id} onClick={() => setPreviewSourceId(source.id)} className="group p-3 border border-[#E1DFDD] rounded bg-white hover:border-[#0078D4] hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-[#0078D4]">
                                {source.type === SourceType.IMAGE ? <FileSearch className="w-4 h-4"/> : <FileText className="w-4 h-4"/>}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between">
                                    <p className="text-xs font-semibold text-[#323130] group-hover:text-[#0078D4] truncate">{source.title}</p>
                                    <button onClick={(e) => { e.stopPropagation(); onDeleteSource(source.id); }} className="hidden group-hover:block text-gray-400 hover:text-red-500">
                                        <X className="w-3 h-3"/>
                                    </button>
                                </div>
                                <div className="text-[10px] text-gray-500 mt-1">{source.docType}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* GESTIONNAIRE DE PROMPTS & TEMPLATES */}
            {showHiddenLogic && activeSection && activeSection.type === 'dynamic' && (
                <div className="p-4 bg-[#252423] text-white border-t border-[#484644] shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[#A19F9D] text-[10px] font-bold uppercase">
                            <BookTemplate className="w-3 h-3"/> Modèles & Structures
                        </div>
                        {showSavePrompt ? (
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={newTemplateName}
                                    onChange={(e) => setNewTemplateName(e.target.value)}
                                    className="text-xs text-black p-1 rounded w-24"
                                    placeholder="Nom du modèle"
                                />
                                <button onClick={handleSaveCurrentPromptAsTemplate} className="text-green-400 hover:text-green-300"><CheckCircle className="w-3 h-3"/></button>
                                <button onClick={() => setShowSavePrompt(false)} className="text-red-400 hover:text-red-300"><X className="w-3 h-3"/></button>
                            </div>
                        ) : (
                            <button onClick={() => setShowSavePrompt(true)} className="text-xs text-[#0078D4] hover:text-[#106EBE] flex items-center gap-1"><FilePlus className="w-3 h-3"/> Sauvegarder ce prompt</button>
                        )}
                    </div>

                    <select
                        onChange={handleTemplateSelect}
                        className="w-full bg-[#3B3A39] text-white text-xs p-2 rounded border border-[#484644] mb-3 focus:border-[#0078D4] outline-none"
                    >
                        <option value="">-- Choisir une action --</option>
                        <optgroup label="Insérer du texte fixe">
                            {promptTemplates.filter(t => t.isStructure).map(t => (
                                <option key={t.id} value={t.id}>Insérer : {t.label}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Changer le prompt IA">
                            {promptTemplates.filter(t => !t.isStructure).map(t => (
                                <option key={t.id} value={t.id}>Appliquer : {t.label}</option>
                            ))}
                        </optgroup>
                    </select>

                    <div className="text-[10px] uppercase font-bold text-[#A19F9D] mb-1">
                        Prompt spécifique pour : <span className="text-white">"{activeSection.title}"</span>
                    </div>
                    <textarea
                        className="w-full h-32 font-mono text-[10px] text-green-400 p-2 bg-black/30 rounded border border-[#484644] focus:border-[#0078D4] outline-none resize-y"
                        value={activeSection.prompt || ''}
                        onChange={onUpdateSectionPrompt}
                        placeholder="Instruction spécifique pour cette section..."
                    />
                </div>
            )}
        </div>
    );
}
