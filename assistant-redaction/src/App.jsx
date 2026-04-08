import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Library } from './components/Library';
import { useLocalStorage } from './hooks/usePersistence';
import { INITIAL_SECTIONS, INITIAL_SOURCES, INITIAL_PROMPT_TEMPLATES } from './data/initialData';
import { generateSectionContent } from './services/aiService';
import { SectionType } from './constants';
import { Save, Eye, CheckCircle, UserCheck, Download, Settings } from 'lucide-react';
import jsPDF from 'jspdf';
import { SettingsModal } from './components/SettingsModal';

function App() {
    const [sections, setSections] = useLocalStorage('sections', INITIAL_SECTIONS);
    const [sources, setSources] = useLocalStorage('sources', INITIAL_SOURCES);
    const [promptTemplates, setPromptTemplates] = useLocalStorage('templates', INITIAL_PROMPT_TEMPLATES);
    const [aiConfig, setAiConfig] = useLocalStorage('aiConfig', { mode: 'simulation', apiKey: '' });

    const [activeSectionId, setActiveSectionId] = useState(INITIAL_SECTIONS[0].id);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showHiddenLogic, setShowHiddenLogic] = useState(true);
    const [notification, setNotification] = useState(null);
    const [securityLevel] = useState('Protégé B');
    const [previewSourceId, setPreviewSourceId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // State pour la sauvegarde de prompt
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");

    const activeSection = sections.find(s => s.id === activeSectionId);
    const activeSourceData = previewSourceId ? sources.find(s => s.id === previewSourceId) : null;

    // --- Handlers ---
    const handleAddSection = () => {
        const newId = `sect_${Date.now()}`;
        const newSection = {
            id: newId,
            title: `Nouvelle Section`,
            type: SectionType.DYNAMIC,
            content: "",
            prompt: promptTemplates[1].content,
            status: 'draft',
            selectedSourceIds: []
        };
        setSections([...sections, newSection]);
        setActiveSectionId(newId);
    };

    const handleDeleteSection = (id, e) => {
        e.stopPropagation();
        if (sections.length <= 1) return;
        const newSections = sections.filter(s => s.id !== id);
        setSections(newSections);
        if (activeSectionId === id) setActiveSectionId(newSections[0].id);
    };

    const toggleSourceSelection = (sourceId) => {
        const currentSelected = (activeSection && activeSection.selectedSourceIds) || [];
        let newSelected = currentSelected.includes(sourceId)
            ? currentSelected.filter(id => id !== sourceId)
            : [...currentSelected, sourceId];
        setSections(sections.map(s => s.id === activeSectionId ? { ...s, selectedSourceIds: newSelected } : s));
    };

    // Sélection d'un template
    const handleTemplateSelect = (e) => {
        const templateId = e.target.value;
        const template = promptTemplates.find(t => t.id === templateId);

        if (template) {
            if (template.isStructure) {
                const newContent = (activeSection.content || "") + "\n" + template.content;
                setSections(sections.map(s => s.id === activeSectionId ? { ...s, content: newContent } : s));
                setNotification({ type: 'success', message: 'Structure fixe insérée.' });
            } else {
                setSections(sections.map(s => s.id === activeSectionId ? { ...s, prompt: template.content } : s));
                setNotification({ type: 'info', message: `Prompt "${template.label}" chargé.` });
            }
            setTimeout(() => setNotification(null), 2000);
        }
    };

    // Sauvegarder le prompt actuel comme nouveau modèle
    const handleSaveCurrentPromptAsTemplate = () => {
        if (!newTemplateName.trim()) return;

        const newTemplate = {
            id: `tpl_custom_${Date.now()}`,
            label: newTemplateName,
            content: activeSection.prompt,
            isStructure: false
        };

        setPromptTemplates([...promptTemplates, newTemplate]);
        setNewTemplateName("");
        setShowSavePrompt(false);
        setNotification({ type: 'success', message: `Modèle "${newTemplateName}" ajouté à la bibliothèque.` });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleToggleAiForFixed = () => {
        if (activeSection.type === SectionType.FIXED) {
            setSections(sections.map(s => s.id === activeSectionId ? { ...s, type: SectionType.DYNAMIC, prompt: promptTemplates[1].content } : s));
            setNotification({ type: 'info', message: 'Assistant IA activé pour cette section.' });
        }
    };

    const handleCopilotGenerate = async (mode = 'replace') => {
        if (!activeSection || !activeSection.prompt) return;
        setIsGenerating(true);

        const relevantSources = sources.filter(s => activeSection.selectedSourceIds && activeSection.selectedSourceIds.includes(s.id));
        const currentContent = activeSection.content || "";

        const generatedText = await generateSectionContent(activeSection.prompt, relevantSources, mode === 'append' ? currentContent : "", aiConfig);

        let finalContent = generatedText;
        if (mode === 'append') {
            finalContent = currentContent + generatedText;
        }

        setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, content: finalContent, status: 'review_needed' } : s));
        setIsGenerating(false);
        setNotification({ type: 'success', message: mode === 'append' ? 'Contenu ajouté à la suite.' : 'Contenu généré.' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleContentChange = (value) => {
        setSections(sections.map(s => s.id === activeSectionId ? { ...s, content: value, status: 'draft' } : s));
    };

    const toggleVerification = () => {
        const newStatus = (activeSection && activeSection.status) === 'verified' ? 'draft' : 'verified';
        setSections(sections.map(s => s.id === activeSectionId ? { ...s, status: newStatus } : s));
        if(newStatus === 'verified') setNotification({ type: 'success', message: 'Section validée par l\'agent.' });
    };

    const handleAddSource = (newSource) => {
        setSources(prev => [...prev, newSource]);
        setPreviewSourceId(newSource.id);
    };

    const handleDeleteSource = (id) => {
        setSources(sources.filter(s => s.id !== id));
        if (previewSourceId === id) setPreviewSourceId(null);
    };

    const handleExportPDF = async () => {
        const doc = new jsPDF();
        let yOffset = 10;

        doc.setFontSize(16);
        doc.text("Rapport Correctionnel", 10, yOffset);
        yOffset += 10;
        doc.setFontSize(10);
        doc.text(`Généré le ${new Date().toLocaleDateString()}`, 10, yOffset);
        yOffset += 20;

        // Simple text export for now as HTML to PDF is complex without rendering
        // We strip HTML tags for this simple export
        sections.forEach(section => {
            doc.setFontSize(14);
            doc.text(section.title, 10, yOffset);
            yOffset += 10;

            doc.setFontSize(12);
            const plainText = section.content.replace(/<[^>]+>/g, '');
            const lines = doc.splitTextToSize(plainText, 180);
            doc.text(lines, 10, yOffset);
            yOffset += (lines.length * 7) + 10;

            if (yOffset > 280) {
                doc.addPage();
                yOffset = 10;
            }
        });

        doc.save("rapport_correctionnel.pdf");
    };

    return (
        <div className="flex h-screen bg-[#F3F2F1] text-[#201F1E] font-sans overflow-hidden">
            <Sidebar
                sections={sections}
                activeSectionId={activeSectionId}
                setActiveSectionId={setActiveSectionId}
                onAddSection={handleAddSection}
                onDeleteSection={handleDeleteSection}
                securityLevel={securityLevel}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                 <header className="h-14 bg-white border-b border-[#E1DFDD] flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <input type="text" value={activeSection ? activeSection.title : ''} onChange={(e) => setSections(sections.map(s => s.id === activeSectionId ? { ...s, title: e.target.value } : s))} className="font-semibold text-[#201F1E] text-lg bg-transparent border-none outline-none focus:ring-2 focus:ring-[#0078D4] rounded px-1 w-full max-w-md"/>

                        <button onClick={toggleVerification} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${(activeSection && activeSection.status) === 'verified' ? 'bg-green-100 text-green-800 hover:bg-green-200' : (activeSection && activeSection.status) === 'review_needed' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {(activeSection && activeSection.status) === 'verified' ? <CheckCircle className="w-3 h-3"/> : <UserCheck className="w-3 h-3"/>}
                            {(activeSection && activeSection.status) === 'verified' ? 'Vérifié par l\'agent' : (activeSection && activeSection.status) === 'review_needed' ? 'Vérification requise' : 'Brouillon'}
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded hover:bg-gray-100 text-gray-600" title="Configuration IA"><Settings className="w-5 h-5"/></button>
                        <button onClick={handleExportPDF} className="p-2 rounded hover:bg-gray-100 text-gray-600" title="Exporter en PDF"><Download className="w-5 h-5"/></button>
                        <button onClick={() => setShowHiddenLogic(!showHiddenLogic)} className={`p-2 rounded transition-colors ${showHiddenLogic ? 'bg-gray-200 text-black' : 'text-[#605E5C] hover:bg-gray-100'}`} title="Afficher/Masquer Prompts"><Eye className="w-5 h-5"/></button>
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-[#0078D4] text-white text-sm font-medium rounded hover:bg-[#106EBE]"><Save className="w-4 h-4" /> Sauvegarder</button>
                    </div>
                </header>

                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    config={aiConfig}
                    onSave={setAiConfig}
                />

                <div className="flex flex-1 overflow-hidden">
                    <Editor
                        activeSection={activeSection}
                        onContentChange={handleContentChange}
                        isGenerating={isGenerating}
                        sources={sources}
                        toggleSourceSelection={toggleSourceSelection}
                        handleCopilotGenerate={handleCopilotGenerate}
                        handleToggleAiForFixed={handleToggleAiForFixed}
                        notification={notification}
                    />

                    <Library
                        sources={sources}
                        promptTemplates={promptTemplates}
                        activeSection={activeSection}
                        onSelectSource={(id) => setPreviewSourceId(id)}
                        onAddSource={handleAddSource}
                        onDeleteSource={handleDeleteSource}
                        previewSourceId={previewSourceId}
                        setPreviewSourceId={setPreviewSourceId}
                        activeSourceData={activeSourceData}
                        showHiddenLogic={showHiddenLogic}
                        showSavePrompt={showSavePrompt}
                        setShowSavePrompt={setShowSavePrompt}
                        newTemplateName={newTemplateName}
                        setNewTemplateName={setNewTemplateName}
                        handleSaveCurrentPromptAsTemplate={handleSaveCurrentPromptAsTemplate}
                        handleTemplateSelect={handleTemplateSelect}
                        onUpdateSectionPrompt={(e) => setSections(sections.map(s => s.id === activeSectionId ? { ...s, prompt: e.target.value } : s))}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
