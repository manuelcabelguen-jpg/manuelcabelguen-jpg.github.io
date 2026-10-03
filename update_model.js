const fs = require('fs');

const newEntries = `
        // ==========================================
        // CATÉGORIE 6 : IDENTITÉS AFFECTIVES (40 dispositions, Z=6, |X|+|Y|=10)
        // ==========================================
        { id: 6, name: 'Saisie / Saisissement', x: 0, y: 0, z: 6, category: 6, group: 'Saisie', code: 'X0/Y0/Z6', type: 'operator', desc: 'Opérateur central de la strate Z=6 (0,0,6).' },
        // Axiaux
        { id: 88, name: 'Élan', x: 0, y: 10, z: 6, category: 6, group: 'Joie', code: 'X0/Y+10/Z6', type: 'axial', desc: 'Groupe Joie (axial)' },
        { id: 89, name: 'Inertie', x: 0, y: -10, z: 6, category: 6, group: 'Tristesse', code: 'X0/Y-10/Z6', type: 'axial', desc: 'Groupe Tristesse (axial)' },
        { id: 90, name: 'Effacement', x: -10, y: 0, z: 6, category: 6, group: 'Peur', code: 'X-10/Y0/Z6', type: 'axial', desc: 'Groupe Peur (axial)' },
        { id: 91, name: 'Affirmation', x: 10, y: 0, z: 6, category: 6, group: 'Courage', code: 'X+10/Y0/Z6', type: 'axial', desc: 'Groupe Courage (axial)' },
        // Latéraux Joie (8)
        { id: 92, name: 'Ardeur', x: 3, y: 7, z: 6, category: 6, group: 'Joie', code: 'X+3/Y+7/Z6', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 93, name: 'Angoisse', x: -3, y: 7, z: 6, category: 6, group: 'Joie', code: 'X-3/Y+7/Z6', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 94, name: 'Allégresse', x: 4, y: 6, z: 6, category: 6, group: 'Joie', code: 'X+4/Y+6/Z6', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 95, name: 'Fureur', x: -4, y: 6, z: 6, category: 6, group: 'Joie', code: 'X-4/Y+6/Z6', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 96, name: 'Ivresse', x: 2, y: 8, z: 6, category: 6, group: 'Joie', code: 'X+2/Y+8/Z6', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 97, name: 'Affolement', x: -2, y: 8, z: 6, category: 6, group: 'Joie', code: 'X-2/Y+8/Z6', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 98, name: 'Jubilation', x: 1, y: 9, z: 6, category: 6, group: 'Joie', code: 'X+1/Y+9/Z6', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 99, name: 'Terreur', x: -1, y: 9, z: 6, category: 6, group: 'Joie', code: 'X-1/Y+9/Z6', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        // Latéraux Tristesse (8)
        { id: 100, name: 'Béatitude', x: 3, y: -7, z: 6, category: 6, group: 'Tristesse', code: 'X+3/Y-7/Z6', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 101, name: 'Accablement', x: -3, y: -7, z: 6, category: 6, group: 'Tristesse', code: 'X-3/Y-7/Z6', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 102, name: 'Apaisement', x: 4, y: -6, z: 6, category: 6, group: 'Tristesse', code: 'X+4/Y-6/Z6', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 103, name: 'Morosité', x: -4, y: -6, z: 6, category: 6, group: 'Tristesse', code: 'X-4/Y-6/Z6', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 104, name: 'Contemplation', x: 2, y: -8, z: 6, category: 6, group: 'Tristesse', code: 'X+2/Y-8/Z6', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 105, name: 'Prostration', x: -2, y: -8, z: 6, category: 6, group: 'Tristesse', code: 'X-2/Y-8/Z6', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 106, name: 'Félicité', x: 1, y: -9, z: 6, category: 6, group: 'Tristesse', code: 'X+1/Y-9/Z6', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 107, name: 'Désolation', x: -1, y: -9, z: 6, category: 6, group: 'Tristesse', code: 'X-1/Y-9/Z6', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        // Latéraux Peur (8)
        { id: 108, name: 'Irritation', x: -6, y: 4, z: 6, category: 6, group: 'Peur', code: 'X-6/Y+4/Z6', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 109, name: 'Amertume', x: -6, y: -4, z: 6, category: 6, group: 'Peur', code: 'X-6/Y-4/Z6', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 110, name: 'Affolement (Peur)', x: -7, y: 3, z: 6, category: 6, group: 'Peur', code: 'X-7/Y+3/Z6', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 111, name: 'Écrasement', x: -7, y: -3, z: 6, category: 6, group: 'Peur', code: 'X-7/Y-3/Z6', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 112, name: 'Agonie', x: -8, y: 2, z: 6, category: 6, group: 'Peur', code: 'X-8/Y+2/Z6', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 113, name: 'Anéantissement', x: -8, y: -2, z: 6, category: 6, group: 'Peur', code: 'X-8/Y-2/Z6', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 114, name: 'Désarroi', x: -9, y: 1, z: 6, category: 6, group: 'Peur', code: 'X-9/Y+1/Z6', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 115, name: 'Lassitude', x: -9, y: -1, z: 6, category: 6, group: 'Peur', code: 'X-9/Y-1/Z6', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        // Latéraux Courage (8)
        { id: 116, name: 'Entrain', x: 6, y: 4, z: 6, category: 6, group: 'Courage', code: 'X+6/Y+4/Z6', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 117, name: 'Placidité', x: 6, y: -4, z: 6, category: 6, group: 'Courage', code: 'X+6/Y-4/Z6', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 118, name: 'Liesse', x: 7, y: 3, z: 6, category: 6, group: 'Courage', code: 'X+7/Y+3/Z6', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 119, name: 'Limpidité', x: 7, y: -3, z: 6, category: 6, group: 'Courage', code: 'X+7/Y-3/Z6', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 120, name: 'Extase', x: 8, y: 2, z: 6, category: 6, group: 'Courage', code: 'X+8/Y+2/Z6', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 121, name: 'Équanimité', x: 8, y: -2, z: 6, category: 6, group: 'Courage', code: 'X+8/Y-2/Z6', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 122, name: 'Exultation', x: 9, y: 1, z: 6, category: 6, group: 'Courage', code: 'X+9/Y+1/Z6', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 123, name: 'Harmonie', x: 9, y: -1, z: 6, category: 6, group: 'Courage', code: 'X+9/Y-1/Z6', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        // Diagonaux
        { id: 124, name: 'Tourment', x: -5, y: 5, z: 6, category: 6, group: 'Colère', code: 'X-5/Y+5/Z6', type: 'diagonal', desc: 'Groupe Colère (diagonal)' },
        { id: 125, name: 'Ataraxie', x: 5, y: -5, z: 6, category: 6, group: 'Calme', code: 'X+5/Y-5/Z6', type: 'diagonal', desc: 'Groupe Calme (diagonal)' },
        { id: 126, name: 'Triomphe', x: 5, y: 5, z: 6, category: 6, group: 'Désir', code: 'X+5/Y+5/Z6', type: 'diagonal', desc: 'Groupe Désir (diagonal)' },
        { id: 127, name: 'Abattement', x: -5, y: -5, z: 6, category: 6, group: 'Dégoût', code: 'X-5/Y-5/Z6', type: 'diagonal', desc: 'Groupe Dégoût (diagonal)' },

        // ==========================================
        // CATÉGORIE 7 : SENTIMENTS TRANSCENDANTAUX (48 sentiments, Z=7, |X|+|Y|=12)
        // ==========================================
        { id: 7, name: 'Suspension', x: 0, y: 0, z: 7, category: 7, group: 'Suspension', code: 'X0/Y0/Z7', type: 'operator', desc: 'Opérateur central de la strate Z=7 (0,0,7).' },
        // Axiaux
        { id: 128, name: 'Infini', x: 0, y: 12, z: 7, category: 7, group: 'Joie', code: 'X0/Y+12/Z7', type: 'axial', desc: 'Groupe Joie (axial)' },
        { id: 129, name: 'Néant', x: 0, y: -12, z: 7, category: 7, group: 'Tristesse', code: 'X0/Y-12/Z7', type: 'axial', desc: 'Groupe Tristesse (axial)' },
        { id: 130, name: 'Déréliction', x: -12, y: 0, z: 7, category: 7, group: 'Peur', code: 'X-12/Y0/Z7', type: 'axial', desc: 'Groupe Peur (axial)' },
        { id: 131, name: 'Communion', x: 12, y: 0, z: 7, category: 7, group: 'Courage', code: 'X+12/Y0/Z7', type: 'axial', desc: 'Groupe Courage (axial)' },
        // Latéraux Joie (10)
        { id: 132, name: 'Transcendance', x: 2, y: 10, z: 7, category: 7, group: 'Joie', code: 'X+2/Y+10/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 133, name: 'Déchirement', x: -2, y: 10, z: 7, category: 7, group: 'Joie', code: 'X-2/Y+10/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 134, name: 'Exubérance', x: 4, y: 8, z: 7, category: 7, group: 'Joie', code: 'X+4/Y+8/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 135, name: 'Horreur', x: -4, y: 8, z: 7, category: 7, group: 'Joie', code: 'X-4/Y+8/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 136, name: 'Grâce', x: 1, y: 11, z: 7, category: 7, group: 'Joie', code: 'X+1/Y+11/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 137, name: 'Pérennité', x: -1, y: 11, z: 7, category: 7, group: 'Joie', code: 'X-1/Y+11/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 138, name: 'Élévation', x: 3, y: 9, z: 7, category: 7, group: 'Joie', code: 'X+3/Y+9/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 139, name: 'Détresse', x: -3, y: 9, z: 7, category: 7, group: 'Joie', code: 'X-3/Y+9/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 140, name: 'Enivrement', x: 5, y: 7, z: 7, category: 7, group: 'Joie', code: 'X+5/Y+7/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        { id: 141, name: 'Révolte', x: -5, y: 7, z: 7, category: 7, group: 'Joie', code: 'X-5/Y+7/Z7', type: 'lateral', desc: 'Groupe Joie (latéral)' },
        // Latéraux Tristesse (10)
        { id: 142, name: 'Nirvana', x: 2, y: -10, z: 7, category: 7, group: 'Tristesse', code: 'X+2/Y-10/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 143, name: 'Perdition', x: -2, y: -10, z: 7, category: 7, group: 'Tristesse', code: 'X-2/Y-10/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 144, name: 'Paix', x: 4, y: -8, z: 7, category: 7, group: 'Tristesse', code: 'X+4/Y-8/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 145, name: 'Oppression', x: -4, y: -8, z: 7, category: 7, group: 'Tristesse', code: 'X-4/Y-8/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 146, name: 'Vertige', x: 1, y: -11, z: 7, category: 7, group: 'Tristesse', code: 'X+1/Y-11/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 147, name: 'Abîme', x: -1, y: -11, z: 7, category: 7, group: 'Tristesse', code: 'X-1/Y-11/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 148, name: 'Abandon', x: 3, y: -9, z: 7, category: 7, group: 'Tristesse', code: 'X+3/Y-9/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 149, name: 'Damnation', x: -3, y: -9, z: 7, category: 7, group: 'Tristesse', code: 'X-3/Y-9/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 150, name: 'Silence', x: 5, y: -7, z: 7, category: 7, group: 'Tristesse', code: 'X+5/Y-7/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        { id: 151, name: 'Résignation', x: -5, y: -7, z: 7, category: 7, group: 'Tristesse', code: 'X-5/Y-7/Z7', type: 'lateral', desc: 'Groupe Tristesse (latéral)' },
        // Latéraux Peur (10)
        { id: 152, name: 'Frayeur', x: -10, y: 2, z: 7, category: 7, group: 'Peur', code: 'X-10/Y+2/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 153, name: 'Isolement', x: -10, y: -2, z: 7, category: 7, group: 'Peur', code: 'X-10/Y-2/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 154, name: 'Affliction', x: -8, y: 4, z: 7, category: 7, group: 'Peur', code: 'X-8/Y+4/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 155, name: 'Mélancolie', x: -8, y: -4, z: 7, category: 7, group: 'Peur', code: 'X-8/Y-4/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 156, name: 'Épouvante', x: -11, y: 1, z: 7, category: 7, group: 'Peur', code: 'X-11/Y+1/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 157, name: 'Extinction', x: -11, y: -1, z: 7, category: 7, group: 'Peur', code: 'X-11/Y-1/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 158, name: 'Sidération', x: -9, y: 3, z: 7, category: 7, group: 'Peur', code: 'X-9/Y+3/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 159, name: 'Engloutissement', x: -9, y: -3, z: 7, category: 7, group: 'Peur', code: 'X-9/Y-3/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 160, name: 'Tumulte', x: -7, y: 5, z: 7, category: 7, group: 'Peur', code: 'X-7/Y+5/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        { id: 161, name: 'Pétrification', x: -7, y: -5, z: 7, category: 7, group: 'Peur', code: 'X-7/Y-5/Z7', type: 'lateral', desc: 'Groupe Peur (latéral)' },
        // Latéraux Courage (10)
        { id: 162, name: 'Éblouissement', x: 10, y: 2, z: 7, category: 7, group: 'Courage', code: 'X+10/Y+2/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 163, name: 'Recueillement', x: 10, y: -2, z: 7, category: 7, group: 'Courage', code: 'X+10/Y-2/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 164, name: 'Rayonnement', x: 8, y: 4, z: 7, category: 7, group: 'Courage', code: 'X+8/Y+4/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 165, name: 'Contentement', x: 8, y: -4, z: 7, category: 7, group: 'Courage', code: 'X+8/Y-4/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 166, name: 'Ravissement', x: 11, y: 1, z: 7, category: 7, group: 'Courage', code: 'X+11/Y+1/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 167, name: 'Épiphanie', x: 11, y: -1, z: 7, category: 7, group: 'Courage', code: 'X+11/Y-1/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 168, name: 'Louange', x: 9, y: 3, z: 7, category: 7, group: 'Courage', code: 'X+9/Y+3/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 169, name: 'Lucidité', x: 9, y: -3, z: 7, category: 7, group: 'Courage', code: 'X+9/Y-3/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 170, name: 'Effusion', x: 7, y: 5, z: 7, category: 7, group: 'Courage', code: 'X+7/Y+5/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        { id: 171, name: 'Consentement', x: 7, y: -5, z: 7, category: 7, group: 'Courage', code: 'X+7/Y-5/Z7', type: 'lateral', desc: 'Groupe Courage (latéral)' },
        // Diagonaux
        { id: 172, name: 'Effondrement', x: -6, y: 6, z: 7, category: 7, group: 'Colère', code: 'X-6/Y+6/Z7', type: 'diagonal', desc: 'Groupe Colère (diagonal)' },
        { id: 173, name: 'Impassibilité', x: 6, y: -6, z: 7, category: 7, group: 'Calme', code: 'X+6/Y-6/Z7', type: 'diagonal', desc: 'Groupe Calme (diagonal)' },
        { id: 174, name: 'Sublimation', x: 6, y: 6, z: 7, category: 7, group: 'Désir', code: 'X+6/Y+6/Z7', type: 'diagonal', desc: 'Groupe Désir (diagonal)' },
        { id: 175, name: 'Dissolution', x: -6, y: -6, z: 7, category: 7, group: 'Dégoût', code: 'X-6/Y-6/Z7', type: 'diagonal', desc: 'Groupe Dégoût (diagonal)' }
    ];

const additionalAxial = \`
        // Groupe 6
        ['Élan', 'Inertie'],           // X0/Y+10/Z6 <-> X0/Y-10/Z6
        ['Affirmation', 'Effacement'], // X+10/Y0/Z6 <-> X-10/Y0/Z6
        // Groupe 7
        ['Infini', 'Néant'],           // X0/Y+12/Z7 <-> X0/Y-12/Z7
        ['Communion', 'Déréliction']   // X+12/Y0/Z7 <-> X-12/Y0/Z7
    ];\`;

const additionalDiagonal = \`
        // Groupe 6
        ['Tourment', 'Ataraxie'],         // X-5/Y+5/Z6 <-> X+5/Y-5/Z6
        ['Triomphe', 'Abattement'],       // X+5/Y+5/Z6 <-> X-5/Y-5/Z6
        // Groupe 7
        ['Effondrement', 'Impassibilité'],// X-6/Y+6/Z7 <-> X+6/Y-6/Z7
        ['Sublimation', 'Dissolution']    // X+6/Y+6/Z7 <-> X-6/Y-6/Z7
    ];\`;

const additionalControlateral = \`
        // Groupe 6 (Z=6)
        ['Ardeur', 'Écrasement'],
        ['Béatitude', 'Affolement'],
        ['Angoisse', 'Limpidité'],
        ['Accablement', 'Liesse'],
        ['Allégresse', 'Amertume'],
        ['Apaisement', 'Irritation'],
        ['Fureur', 'Placidité'],
        ['Morosité', 'Entrain'],
        ['Ivresse', 'Anéantissement'],
        ['Contemplation', 'Agonie'],
        ['Affolement (Peur)', 'Équanimité'], // Note: 'Affolement' in Z=6 Peur was changed to 'Affolement (Peur)' to avoid duplicate id/name
        ['Prostration', 'Extase'],
        ['Jubilation', 'Lassitude'],
        ['Félicité', 'Désarroi'],
        ['Terreur', 'Harmonie'],
        ['Désolation', 'Exultation'],

        // Groupe 7 (Z=7)
        ['Transcendance', 'Isolement'],
        ['Nirvana', 'Frayeur'],
        ['Déchirement', 'Recueillement'],
        ['Perdition', 'Éblouissement'],
        ['Exubérance', 'Mélancolie'],
        ['Paix', 'Affliction'],
        ['Horreur', 'Contentement'],
        ['Oppression', 'Rayonnement'],
        ['Grâce', 'Extinction'],
        ['Vertige', 'Épouvante'],
        ['Pérennité', 'Abîme'],
        ['Abîme', 'Ravissement'], // Note: 'Abîme' issue (might need Abîme (Tristesse) vs Abîme (Peur) if duplicate, but wait: 'Abîme' is only in Tristesse. Ravissement is Courage. Wait, in PDF: Axe Ravissement (X+11/Y+1/Z7)/Abîme (X-1/Y-11/Z7).)
        ['Élévation', 'Engloutissement'],
        ['Abandon', 'Sidération'],
        ['Détresse', 'Lucidité'],
        ['Damnation', 'Louange'],
        ['Enivrement', 'Pétrification'],
        ['Silence', 'Tumulte'],
        ['Révolte', 'Consentement'],
        ['Résignation', 'Effusion']
    ];\`;

let code = fs.readFileSync('cartograffect_model.js', 'utf8');

const replacementStrata = \`{ z: 6, budget: 10, count: 40, name: "Identités Affectives", operator: "Saisie / Saisissement", title: "Strate Z=6 : 40 Identités affectives (|X|+|Y|=10)", desc: "Saisie centrale (0,0,6). Affects de grande profondeur." },
        { z: 7, budget: 12, count: 48, name: "Sentiments transcendantaux", operator: "Suspension", title: "Strate Z=7 : 48 Sentiments transcendantaux (|X|+|Y|=12)", desc: "Suspension centrale (0,0,7). Arrêt du modèle face à l'incommensurable." }
    ];\`;

// 1. Strata array update
if (!code.includes("Strate Z=6")) {
    code = code.replace(/    \];\n\n    \/\/ Inventaire complet des 176 entrées/, replacementStrata + '\\n\\n    // Inventaire complet des 176 entrées');
    
    // 2. Emotions array update
    code = code.replace(/        { id: 87, name: "Désintérêt".*?}\n    \];\n\n    \];/, "        { id: 87, name: 'Désintérêt', x: -4, y: -4, z: 5, category: 5, group: 'Dégoût', code: 'X-4/Y-4/Z5', type: 'diagonal', desc: 'Groupe Dégoût (diagonal) : atonie et délaissement complet sans animosité.' }\\n" + newEntries + "    ];");
    code = code.replace(/        { id: 87, name: "Désintérêt".*?}\n    \];/, "        { id: 87, name: 'Désintérêt', x: -4, y: -4, z: 5, category: 5, group: 'Dégoût', code: 'X-4/Y-4/Z5', type: 'diagonal', desc: 'Groupe Dégoût (diagonal) : atonie et délaissement complet sans animosité.' }\\n" + newEntries + "    ];");
    
    // 3. Axial pairs update
    code = code.replace(/        \["Confiance", "Méfiance"\]     \/\/ X\+8\/Y0\/Z5 <-> X-8\/Y0\/Z5\n    \];/, '        ["Confiance", "Méfiance"],     // X+8/Y0/Z5 <-> X-8/Y0/Z5\\n' + additionalAxial);
    
    // 4. Diagonal pairs update
    code = code.replace(/        \["Satisfaction", "Insatisfaction"\] \/\/ X\+4\/Y-4\/Z5 <-> X-4\/Y\+4\/Z5\n    \];/, '        ["Satisfaction", "Insatisfaction"], // X+4/Y-4/Z5 <-> X-4/Y+4/Z5\\n' + additionalDiagonal);
    
    // 5. Controlateral pairs update
    code = code.replace(/        \["Désespoir", "Espoir"\]              \/\/ X-1\/Y-7\/Z5 <-> X\+7\/Y\+1\/Z5\n    \];/, '        ["Désespoir", "Espoir"],              // X-1/Y-7/Z5 <-> X+7/Y+1/Z5\\n' + additionalControlateral);
    
    fs.writeFileSync('cartograffect_model.js', code);
    console.log("cartograffect_model.js updated successfully.");
} else {
    console.log("Already updated?");
}

