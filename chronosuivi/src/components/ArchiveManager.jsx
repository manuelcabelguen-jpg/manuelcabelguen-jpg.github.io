import React, { useState } from 'react';
import { FolderOpen, Save, FileJson, X, Download } from 'lucide-react';

const ArchiveManager = ({ currentState, onLoadState, onClose }) => {
    const [dirHandle, setDirHandle] = useState(null);
    const [archives, setArchives] = useState([]);
    const [error, setError] = useState(null);

    const handleSelectFolder = async () => {
        try {
            const handle = await window.showDirectoryPicker();
            setDirHandle(handle);
            await listFiles(handle);
            setError(null);
        } catch (err) {
            console.error(err);
            // Don't show error if user cancelled
            if (err.name !== 'AbortError') {
                setError("Impossible d'accéder au dossier.");
            }
        }
    };

    const listFiles = async (handle) => {
        try {
            const files = [];
            for await (const entry of handle.values()) {
                if (entry.kind === 'file' && entry.name.endsWith('.json')) {
                    files.push(entry);
                }
            }
            setArchives(files);
        } catch (err) {
            setError("Erreur lecture dossier.");
        }
    };

    const handleSaveArchive = async () => {
        if (!dirHandle) return;
        try {
            const dateStr = new Date().toISOString().split('T')[0];
            const safeName = (currentState.programName || 'programme').replace(/[^a-z0-9]/gi, '_');
            const name = `Archive_${safeName}_${dateStr}.json`;

            const fileHandle = await dirHandle.getFileHandle(name, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(currentState, null, 2));
            await writable.close();

            await listFiles(dirHandle);
            alert("Archive enregistrée : " + name);
        } catch (err) {
            setError("Erreur lors de l'écriture : " + err.message);
        }
    };

    const handleLoadArchive = async (fileHandle) => {
        if (confirm(`Charger l'archive "${fileHandle.name}" ? Cela remplacera les données actuelles.`)) {
            try {
                const file = await fileHandle.getFile();
                const text = await file.text();
                const data = JSON.parse(text);
                onLoadState(data);
                onClose();
            } catch (err) {
                setError("Erreur lecture : " + err.message);
            }
        }
    };

    // Browser check
    if (typeof window !== 'undefined' && !('showDirectoryPicker' in window)) {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg max-w-md text-center shadow-xl">
                    <h3 className="text-lg font-bold mb-2">Non Supporté</h3>
                    <p className="text-sm text-slate-500 mb-4">Votre navigateur ne supporte pas l'API d'accès aux fichiers (File System Access API). Utilisez Chrome, Edge ou un navigateur Chromium récent.</p>
                    <button onClick={onClose} className="bg-slate-100 px-4 py-2 rounded hover:bg-slate-200">Fermer</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 report-modal-open backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl modal-content flex flex-col max-h-[80vh] overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center gap-2"><FolderOpen className="w-5 h-5"/> Gestion des Archives</h2>
                    <button onClick={onClose}><X className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"/></button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {!dirHandle ? (
                        <div className="text-center py-10">
                            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FolderOpen className="w-10 h-10 text-blue-500"/>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Configurer la source</h3>
                            <p className="text-slate-500 mb-6 max-w-xs mx-auto text-sm">Sélectionnez un dossier local. C'est ici que vos archives seront sauvegardées et lues.</p>
                            <button onClick={handleSelectFolder} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-sm">
                                Sélectionner un dossier
                            </button>
                            {error && <p className="text-red-500 text-xs mt-4 bg-red-50 p-2 rounded">{error}</p>}
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Dossier Source</p>
                                    <p className="font-mono text-sm text-slate-800 font-bold flex items-center gap-2">
                                        <FolderOpen className="w-4 h-4 text-blue-500"/>
                                        {dirHandle.name}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleSelectFolder} className="text-xs text-slate-500 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-white transition-colors">Changer</button>
                                    <button onClick={handleSaveArchive} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm transition-all hover:scale-105 active:scale-95">
                                        <Save className="w-4 h-4"/> Créer une Archive
                                    </button>
                                </div>
                            </div>

                            {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded border border-red-100 flex items-center gap-2"><X className="w-4 h-4"/> {error}</div>}

                            <div>
                                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><FileJson className="w-4 h-4 text-slate-400"/> Archives Disponibles</h3>
                                {archives.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-lg">
                                        <p className="text-xs text-slate-400 italic">Aucune archive (.json) trouvée dans ce dossier.</p>
                                    </div>
                                ) : (
                                    <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-60 overflow-y-auto custom-scrollbar">
                                        {archives.map((file, i) => (
                                            <div key={i} className="p-3 hover:bg-slate-50 flex justify-between items-center transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 rounded text-slate-500"><FileJson className="w-4 h-4"/></div>
                                                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{file.name}</span>
                                                </div>
                                                <button onClick={() => handleLoadArchive(file)} className="text-xs border border-slate-200 px-3 py-1.5 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-1 font-medium">
                                                    <Download className="w-3 h-3"/> Charger
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArchiveManager;
