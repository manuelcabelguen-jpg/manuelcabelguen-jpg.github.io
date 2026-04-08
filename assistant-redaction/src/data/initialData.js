import { SourceType } from '../constants';

export const INITIAL_PROMPT_TEMPLATES = [
    {
        id: 'tpl_struct',
        label: 'Structure Standard (Squelette)',
        isStructure: true,
        content: "**Contexte de l'évaluation :**\n[Insérer contexte ici]\n\n**Analyse des faits :**\n\n**Conclusion :**\n"
    },
    {
        id: 'tpl_secu',
        label: 'Analyse des Incidents (Sécurité)',
        content: "Agis comme un analyste de sécurité correctionnelle. Utilise les sources sélectionnées pour lister les incidents. Pour chaque incident, précise la date, la nature et l'intervention. Cite les sources."
    },
    {
        id: 'tpl_psy',
        label: 'Synthèse Clinique',
        content: "Agis comme un psychologue. À partir des rapports cliniques, résume l'état mental, les facteurs de risque et les progrès réalisés. Utilise un ton professionnel et neutre."
    },
    {
        id: 'tpl_prog',
        label: 'Participation aux Programmes',
        content: "Résume la participation aux programmes. Mets l'accent sur l'assiduité et le comportement observé par les intervenants."
    }
];

export const INITIAL_SOURCES = [
    { id: 'src_01', title: "Rapport_Incident_2024-10.pdf", docType: "Rapport d'observation", author: "Pierre Tremblay", date: "2024-10-12", content: "DETAILS INCIDENT...", type: SourceType.SHAREPOINT, createdAt: Date.now() },
    { id: 'src_02', title: "Evaluation_Psy_Janvier.docx", docType: "Rapport MPCI", author: "Dr. Jeanne Moreau", date: "2025-01-15", content: "EVALUATION PSY...", type: SourceType.SHAREPOINT, createdAt: Date.now() },
    { id: 'src_03', title: "Presence_Atelier_Travail.xlsx", docType: "Rapport de rendement", author: "Marc Lavoie", date: "2025-02-28", content: "RAPPORT ATELIER...", type: SourceType.EXCEL, createdAt: Date.now() }
];

export const INITIAL_SECTIONS = [
    { id: 'sect_1', title: "1. Identification & Statut", type: 'fixed', content: "Nom: DOE, John\nFPS: 123456A\nDate d'admission: 2023-05-12\n\nCe rapport a pour but d'évaluer le risque...", status: 'verified', selectedSourceIds: [] },
    { id: 'sect_2', title: "2. Analyse Hybride (Fixe + IA)", type: 'dynamic', content: "**Observations de l'agent :**\nLe comportement en unité est généralement calme. Le détenu respecte les consignes.\n\n", prompt: INITIAL_PROMPT_TEMPLATES[1].content, selectedSourceIds: ['src_01'], status: 'draft' }
];
