// --- SERVICE IA ---
export const generateSectionContent = async (prompt, sources, existingContent = "", config = { mode: 'simulation' }) => {
    if (config.mode === 'simulation') {
        return new Promise((resolve) => {
            setTimeout(() => {
                const formatCitation = (s) => `(${s.docType || 'Doc'} de ${s.author || 'Inconnu'} datée du ${s.date || 'N/D'})`;

                let response = "";
                if (sources.length === 0) {
                    resolve("Erreur : Aucune source sélectionnée.");
                    return;
                }

                const isAppending = existingContent.length > 0;
                const intro = isAppending ? "<br/><br/><strong>[COMPLÉMENT IA] :</strong> " : "";

                const p = prompt.toLowerCase();

                if (p.includes('sécurité') || p.includes('incident')) {
                    response = `${intro}L'analyse complémentaire des incidents récents indique une gestion adaptée. `;
                    sources.forEach(s => {
                        if (s.title.includes('Incident')) response += `Notamment l'incident du 12 octobre qui a été résolu verbalement ${formatCitation(s)}. `;
                    });
                } else if (p.includes('psychologue') || p.includes('clinique')) {
                    response = `${intro}Sur le plan clinique, on observe une consolidation des acquis. `;
                    sources.forEach(s => {
                        if (s.title.includes('Psy')) response += `Le sujet maintient une bonne introspection ${formatCitation(s)}. `;
                    });
                } else {
                    response = `${intro}Données extraites des sources sélectionnées :<ul>`;
                    sources.forEach(s => response += `<li>Élément pertinent trouvé dans "${s.title}" ${formatCitation(s)}.</li>`);
                    response += "</ul>";
                }
                resolve(response);
            }, 1200);
        });
    } else {
        // Placeholder for Real API implementation
        // e.g., fetch('https://api.openai.com/v1/chat/completions', ...)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("Mode Réel non configuré (API Key manquante). Retour en mode simulation.");
            }, 1000);
        });
    }
};
