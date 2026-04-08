export const calculateParticipantStatus = (participant, stages) => {
    const { status, completedStageIds, lastSessionCompleted, completionDetail } = participant;

    // Find current stage (first not completed)
    // Note: stages is the full ordered list.
    const currentStageIndex = stages.findIndex(s => !completedStageIds.includes(s.id));
    const currentStage = currentStageIndex !== -1 ? stages[currentStageIndex] : null;
    const isAllCompleted = currentStageIndex === -1;

    let recommendation = "";

    if (status === 'completed' || isAllCompleted) {
        if (completionDetail === 'success' || completionDetail === 'full_attendance' || completionDetail === 'released') {
            recommendation = "Poursuite en maintien des acquis";
        } else {
            recommendation = "Programme terminé";
        }
    } else if (status === 'active') {
        if (currentStage) {
            if (lastSessionCompleted && lastSessionCompleted > 0) {
                if (currentStage.calcMode === 'fixed_sessions' && lastSessionCompleted < currentStage.duration) {
                    recommendation = `Poursuivre ${currentStage.name}, Séance ${lastSessionCompleted + 1}`;
                } else if (currentStage.calcMode === 'fixed_sessions' && lastSessionCompleted >= currentStage.duration) {
                    recommendation = `Terminer ${currentStage.name} (Marquer comme complété)`;
                } else {
                    recommendation = `En cours : ${currentStage.name}`;
                }
            } else {
                recommendation = `Débuter ${currentStage.name}`;
            }
        }
    } else {
        // Suspended, Abandoned, Transferred
        if (currentStage) {
            const resumePoint = lastSessionCompleted > 0 ? `, Séance ${lastSessionCompleted + 1}` : '';
            recommendation = `Reprendre à partir du module inachevé : ${currentStage.name}${resumePoint}`;
        } else {
            recommendation = "Reprendre le programme";
        }
    }

    return recommendation;
};
