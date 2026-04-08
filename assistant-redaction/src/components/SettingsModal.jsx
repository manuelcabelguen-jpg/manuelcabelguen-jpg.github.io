import React, { useState } from 'react';
import { X, Save, Settings } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, config, onSave }) {
    const [localConfig, setLocalConfig] = useState(config);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-600"/> Configuration IA
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mode de génération</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={localConfig.mode}
                            onChange={(e) => setLocalConfig({...localConfig, mode: e.target.value})}
                        >
                            <option value="simulation">Simulation (Démo)</option>
                            <option value="openai">OpenAI (GPT-4)</option>
                            <option value="local">Local (Ollama)</option>
                        </select>
                    </div>

                    {localConfig.mode !== 'simulation' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Clé API / URL</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder={localConfig.mode === 'openai' ? "sk-..." : "http://localhost:11434"}
                                value={localConfig.apiKey || ''}
                                onChange={(e) => setLocalConfig({...localConfig, apiKey: e.target.value})}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {localConfig.mode === 'openai' ? "Clé API OpenAI requise." : "URL du serveur Ollama."}
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium">Annuler</button>
                    <button onClick={() => { onSave(localConfig); onClose(); }} className="px-4 py-2 bg-[#0078D4] text-white hover:bg-[#106EBE] rounded text-sm font-medium flex items-center gap-2">
                        <Save className="w-4 h-4"/> Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
}
