export const PROGRAM_TEMPLATES = [
    {
        id: 'mpci',
        label: 'Programme MPCI-DS-IÉ (Complet)',
        defaultName: 'Programme MPCI-DS-IÉ',
        defaultParticipants: 10,
        stages: [
            { id: '1', name: 'Signature des consentements', type: 'milestone', phase: 'avant', calcMode: 'fixed', schedulingMode: 'any_weekday', duration: 0, description: 'Point de départ (SCC 1288)' },
            { id: '2', name: 'Analyse et rédaction', type: 'work', phase: 'avant', calcMode: 'linear_1d', schedulingMode: 'any_weekday', duration: 1, description: '1 jour/participant (Lecture dossiers, Frames, Objectifs)' },
            { id: '3', name: 'Rencontres individuelles pré-programme', type: 'work', phase: 'avant', calcMode: 'linear_0.5d', schedulingMode: 'any_weekday', duration: 1, description: '1 entrevue par demi-journée (2/jour)' },
            { id: '4', name: 'Préparation logistique', type: 'work', phase: 'avant', calcMode: 'fixed', schedulingMode: 'any_weekday', duration: 1, description: 'Impression manuels et cahiers (1 jour)' },
            { id: '5', name: 'Module 1', type: 'work', phase: 'pendant', calcMode: 'fixed_sessions', schedulingMode: 'program_schedule', duration: 13, description: '13 Séances de groupe' },
            { id: '6', name: 'Entrevue M1', type: 'work', phase: 'pendant', calcMode: 'capacity_4d', schedulingMode: 'any_weekday', duration: 1, description: '1 entrevue (4/jour)' },
            { id: '7', name: 'Module 2', type: 'work', phase: 'pendant', calcMode: 'fixed_sessions', schedulingMode: 'program_schedule', duration: 26, description: '26 Séances de groupe' },
            { id: '8', name: 'Entrevues M2', type: 'work', phase: 'pendant', calcMode: 'linear_0.5d', schedulingMode: 'any_weekday', duration: 1, description: '2 entrevues/participant (0.5j/p)' },
            { id: '9', name: 'Module 3', type: 'work', phase: 'pendant', calcMode: 'fixed_sessions', schedulingMode: 'program_schedule', duration: 25, description: '25 Séances de groupe' },
            { id: '10', name: 'Entrevues M3', type: 'work', phase: 'pendant', calcMode: 'linear_0.5d', schedulingMode: 'any_weekday', duration: 1, description: '2 entrevues/participant (0.5j/p)' },
            { id: '11', name: 'Module 4', type: 'work', phase: 'pendant', calcMode: 'fixed_sessions', schedulingMode: 'program_schedule', duration: 22, description: '22 Séances de groupe' },
            { id: '11b', name: 'Entrevue M4', type: 'work', phase: 'pendant', calcMode: 'linear_0.5d', schedulingMode: 'any_weekday', duration: 1, description: '1 entrevue (0.5j/p)' },
            { id: '12', name: 'Module 5', type: 'work', phase: 'pendant', calcMode: 'fixed_sessions', schedulingMode: 'program_schedule', duration: 13, description: '13 Séances individuelles' },
            { id: '13', name: 'Séance individuelle finale', type: 'work', phase: 'pendant', calcMode: 'linear_0.5d', schedulingMode: 'any_weekday', duration: 1, description: 'Bilan (0.5j/p) - Déclencheur Rapport' },
            { id: '14', name: 'Rapport final', type: 'work', phase: 'apres', calcMode: 'linear_1d', schedulingMode: 'any_weekday', duration: 1, description: 'Rédaction (1j/participant)' },
        ]
    },
    {
        id: 'maintien',
        label: 'Programme de Maintien',
        defaultName: 'Maintien des Acquis',
        defaultParticipants: 8,
        stages: [
            { id: '1', name: 'Entrevue accueil', type: 'work', phase: 'avant', calcMode: 'linear_0.5d', schedulingMode: 'any_weekday', duration: 1, description: '0.5j/p' },
            { id: '2', name: 'Séances de maintien', type: 'work', phase: 'pendant', calcMode: 'fixed_sessions', schedulingMode: 'program_schedule', duration: 12, description: '1 séance/mois' },
            { id: '3', name: 'Bilan de sortie', type: 'work', phase: 'apres', calcMode: 'linear_0.5d', schedulingMode: 'any_weekday', duration: 1, description: '0.5j/p' }
        ]
    },
    {
        id: 'custom',
        label: 'Modèle Vierge',
        defaultName: 'Nouveau Programme',
        defaultParticipants: 10,
        stages: []
    }
];
