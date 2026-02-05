import { parseDate, addDays } from './helpers';

export const getConstraintStatus = (d, constraints) => {
    const t = d.getTime();
    let am = false;
    let pm = false;
    constraints.forEach(c => {
        const s = parseDate(c.startDate).getTime();
        const e = parseDate(c.endDate).getTime();
        const cType = c.type || 'full';
        if (t >= s && t <= e) {
            if (cType === 'full') { am = true; pm = true; }
            else if (cType === 'am') { am = true; }
            else if (cType === 'pm') { pm = true; }
        }
    });
    return { am, pm };
};

export const addWorkingDays = (date, daysToAdd, constraints) => {
    let currentDate = new Date(date);
    let added = 0;
    while (added < daysToAdd) {
        currentDate = addDays(currentDate, 1);
        const day = currentDate.getDay();
        const { am, pm } = getConstraintStatus(currentDate, constraints);
        const isFullyBlocked = am && pm;
        if (day !== 0 && day !== 6 && !isFullyBlocked) added++;
    }
    return currentDate;
};

const getEasterDate = (year) => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day, 12, 0, 0);
};

export const generateHolidaysForYear = (year) => {
    const fixed = [
        { name: "Jour de l'An", date: `${year}-01-01` },
        { name: "Fête nationale (QC)", date: `${year}-06-24` },
        { name: "Fête du Canada", date: `${year}-07-01` },
        { name: "Jrnée nle vérité/réconciliation", date: `${year}-09-30` },
        { name: "Jour du Souvenir", date: `${year}-11-11` },
        { name: "Noël", date: `${year}-12-25` },
        { name: "Lendemain de Noël", date: `${year}-12-26` }
    ];

    let date = new Date(year, 8, 1);
    while (date.getDay() !== 1) date.setDate(date.getDate() + 1);
    const feteTravail = date.toISOString().split('T')[0];

    date = new Date(year, 9, 1);
    while (date.getDay() !== 1) date.setDate(date.getDate() + 1);
    date.setDate(date.getDate() + 7);
    const actionGrace = date.toISOString().split('T')[0];

    date = new Date(year, 4, 25);
    while (date.getDay() !== 1) date.setDate(date.getDate() - 1);
    const patriotes = date.toISOString().split('T')[0];

    const easter = getEasterDate(year);
    const vendrediSaint = addDays(easter, -2);
    const lundiPaques = addDays(easter, 1);

    const holidays = [
        { name: "Jour de l'An", date: `${year}-01-01` },
        { name: "Vendredi Saint", date: vendrediSaint.toISOString().split('T')[0] },
        { name: "Lundi de Pâques", date: lundiPaques.toISOString().split('T')[0] },
        { name: "Jrnée nle des patriotes", date: patriotes },
        { name: "Fête nationale (QC)", date: `${year}-06-24` },
        { name: "Fête du Canada", date: `${year}-07-01` },
        { name: "Fête du Travail", date: feteTravail },
        { name: "Jrnée nle vérité/réconciliation", date: `${year}-09-30` },
        { name: "Action de grâce", date: actionGrace },
        { name: "Jour du Souvenir", date: `${year}-11-11` },
        { name: "Noël", date: `${year}-12-25` },
        { name: "Lendemain de Noël", date: `${year}-12-26` }
    ];

    return holidays.map((h, i) => ({ id: `gen_${year}_${i}`, name: h.name, startDate: h.date, endDate: h.date, type: 'full' }));
};

export const generateFederalHolidays = (startYear = 2025, years = 2) => {
    let all = [];
    for (let i = 0; i < years; i++) {
        all = [...all, ...generateHolidaysForYear(startYear + i)];
    }
    return all;
};

export const calculateEffectiveDuration = (stage, globalCount) => {
  if (stage.type !== 'work') return { duration: stage.duration, usedCount: 0 };
  const effectiveCount = (stage.participantOverride && stage.participantOverride > 0) ? stage.participantOverride : globalCount;
  switch (stage.calcMode) {
    case 'fixed_sessions': return { duration: stage.duration * 0.5, usedCount: 0 };
    case 'linear_1d': return { duration: Math.max(0.5, effectiveCount * 1.0), usedCount: effectiveCount };
    case 'linear_0.5d': return { duration: Math.max(0.5, effectiveCount * 0.5), usedCount: effectiveCount };
    case 'capacity_4d': return { duration: Math.ceil(effectiveCount / 2) * 0.5, usedCount: effectiveCount };
    case 'fixed': default: return { duration: stage.duration, usedCount: 0 };
  }
};

export const getAdminTasksForStage = (stageName, stageStart, stageEnd, constraints, isLastModule) => {
    const tasks = [];
    const name = stageName.toLowerCase();
    if (name.includes("signature des consentements") || name.includes("obtention des consentements")) {
        tasks.push({ label: "Formulaire SCC 1288 (Consentement)", deadlineDescription: "À faire signer immédiatement", type: "form", dueDate: stageEnd });
        tasks.push({ label: "Avis d'entrevue", deadlineDescription: "Immédiat après identification", type: "note" });
    }
    if (name.includes("analyse") || name.includes("lecture")) {
        tasks.push({ label: "Constitution Frames & Objectifs", deadlineDescription: "Basé sur PC et Rapports antérieurs", type: "eval" });
    }
    if (name.includes("rencontres individuelles") || name.includes("entrevues individuelles")) {
        tasks.push({ label: "RDI (Résultat entrevue)", deadlineDescription: "1 jour ouvrable après", type: "rdi", dueDate: addWorkingDays(stageEnd, 1, constraints) });
        if (name.includes("pré-programme") || name.includes("initiales")) {
            tasks.push({ label: "Assignation finale des participants", deadlineDescription: "Liste finale à produire", type: "note", dueDate: stageEnd });
        }
    }
    if (name.includes("préparation") || name.includes("logistique")) {
        tasks.push({ label: "Impression Manuels & Cahiers", deadlineDescription: "Pour tous les participants", type: "note" });
    }
    if (name.includes("module")) {
        tasks.push({ label: "Notes évolutives", deadlineDescription: "Après chaque séance", type: "note" });

        tasks.push({ label: "Émission Certificat SGD", deadlineDescription: "Fin du module", type: "form", dueDate: stageEnd });

        if (name.includes("module 1")) {
            const seance2Date = addWorkingDays(stageStart, 5, constraints);
            tasks.push({ label: "Évaluations initiales (MGRP + Obj.)", deadlineDescription: "10j ouvrables post-Séance 2", type: "eval", dueDate: addWorkingDays(seance2Date, 10, constraints) });
        }

        if (name.includes("module 5")) {
             tasks.push({ label: "Émission Diplôme", deadlineDescription: "Fin de programme", type: "form", dueDate: stageEnd });
        }
    }
    if (name.includes("séance individuelle finale") || name.includes("séance finale") || isLastModule) {
            tasks.push({ label: "RDI (Séance ind. finale)", deadlineDescription: "1 jour ouvrable après", type: "rdi", dueDate: addWorkingDays(stageEnd, 1, constraints) });
            tasks.push({ label: "Cotation Finale (MGRP/Objectifs)", deadlineDescription: "10j ouvrables après dernière rencontre", type: "eval", dueDate: addWorkingDays(stageEnd, 10, constraints) });
            tasks.push({ label: "Cotation STABLE-2007 / AIGU-2007", deadlineDescription: "10j ouvrables après complétion", type: "eval", dueDate: addWorkingDays(stageEnd, 10, constraints) });
    }
    if (name.includes("rapport final")) {
        tasks.push({ label: "Transmission CQ GRP", deadlineDescription: "2j ouvrables après soumission", type: "rdi", dueDate: addWorkingDays(stageEnd, 2, constraints) });
    }
    return tasks;
};

const getEffectiveScheduleMap = (date, schedule, scheduleChanges) => {
    const t = date.getTime();
    let currentSched = schedule;
    const sortedScheduleChanges = [...scheduleChanges].sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
    for (const change of sortedScheduleChanges) {
        if (t >= parseDate(change.date).getTime()) {
            currentSched = change.newSchedule;
        }
    }
    return new Map(currentSched.map(s => [s.dayIndex, s]));
};

export const calculateTimeline = (startStr, stages, constraints, schedule, globalParticipantCount, events, scheduleChanges) => {
  let currentDate = parseDate(startStr);
  let nextAvailableSlotDate = new Date(currentDate);
  let startIsPM = false;
  const results = [];
  const MAX_ITERATIONS = 365 * 5;

  const workStages = stages.filter(s => s.type === 'work');
  const lastWorkStageId = workStages.length > 0 ? workStages[workStages.length - 1].id : null;
  const sortedEvents = [...events].sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());

  stages.forEach((stage, idx) => {
    let stageStart = null;
    let stageEnd = null;

    const currentTimestamp = nextAvailableSlotDate.getTime();
    let activeParticipants = globalParticipantCount;
    sortedEvents.forEach(ev => {
        if (parseDate(ev.date).getTime() <= currentTimestamp) {
            activeParticipants += ev.change;
        }
    });
    activeParticipants = Math.max(0, activeParticipants);

    const { duration: effortNeeded, usedCount } = calculateEffectiveDuration(stage, activeParticipants);

    if (stage.type === 'milestone') {
      let checkDate = new Date(nextAvailableSlotDate);
      let iterations = 0;
      while (iterations < 60) {
         const { am, pm } = getConstraintStatus(checkDate, constraints);
         if (!(am && pm)) break;
         checkDate = addDays(checkDate, 1);
         startIsPM = false;
         iterations++;
      }
      stageStart = checkDate;
      stageEnd = checkDate;

    } else if (stage.type === 'delay') {
      stageStart = new Date(nextAvailableSlotDate);
      const daysToAdd = Math.max(0, Math.ceil(effortNeeded) - 1);
      stageEnd = addDays(stageStart, daysToAdd);
      nextAvailableSlotDate = addDays(stageEnd, 1);
      startIsPM = false;

    } else {
      // WORK
      let effortRemaining = effortNeeded;
      let currentCheck = new Date(nextAvailableSlotDate);
      let checkingPM = startIsPM;
      let iterations = 0;

      while (effortRemaining > 0 && iterations < MAX_ITERATIONS) {
        const dayIndex = currentCheck.getDay();
        const { am: amBlocked, pm: pmBlocked } = getConstraintStatus(currentCheck, constraints);
        let isAmAvailable = false;
        let isPmAvailable = false;

        if (stage.schedulingMode === 'any_weekday') {
            if (dayIndex >= 1 && dayIndex <= 5) { isAmAvailable = true; isPmAvailable = true; }
        } else {
            const daySched = getEffectiveScheduleMap(currentCheck, schedule, scheduleChanges).get(dayIndex);
            if (daySched) { isAmAvailable = daySched.am; isPmAvailable = daySched.pm; }
        }

        if (!checkingPM) {
          if (!amBlocked && isAmAvailable) {
             if (!stageStart) stageStart = new Date(currentCheck);
             effortRemaining -= 0.5;
             stageEnd = new Date(currentCheck);
          }
        }
        if (effortRemaining > 0) {
          if (!pmBlocked && isPmAvailable) {
             if (!stageStart) stageStart = new Date(currentCheck);
             effortRemaining -= 0.5;
             stageEnd = new Date(currentCheck);
          }
        }
        if (effortRemaining > 0) {
          currentCheck = addDays(currentCheck, 1);
          checkingPM = false;
        }
        iterations++;
      }
      if (!stageStart) stageStart = nextAvailableSlotDate;
      nextAvailableSlotDate = addDays(stageEnd, 1);
      startIsPM = false;
    }

    const isLastModule = stage.id === lastWorkStageId;
    const adminTasks = getAdminTasksForStage(stage.name, stageStart || new Date(), stageEnd || new Date(), constraints, isLastModule);
    const eventsDuring = sortedEvents.filter(ev => {
        const t = parseDate(ev.date).getTime();
        return t >= (stageStart?.getTime() || 0) && t <= (stageEnd?.getTime() || 0);
    });

    results.push({
      ...stage,
      startDate: stageStart,
      endDate: stageEnd,
      realDuration: Math.ceil((stageEnd.getTime() - stageStart.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      effectiveWorkDays: effortNeeded,
      usedParticipantCount: usedCount,
      adminTasks: adminTasks,
      eventsDuringStage: eventsDuring
    });
  });
  return results;
};

export const getParticipantRecommendation = (participant, calculatedTimeline) => {
    if (participant.status === 'completed') {
        if (participant.completionDetail === 'success' || participant.completionDetail === 'full_attendance') return "Poursuite en maintien des acquis";
        return "Terminé";
    }
    if (participant.status === 'released') return "Poursuite en maintien des acquis";

    if (['suspended', 'abandoned', 'transferred'].includes(participant.status)) {
        const nextStage = calculatedTimeline && calculatedTimeline.find(s => !participant.completedStageIds.includes(s.id) && s.type === 'work');
        if (nextStage) return `Reprendre à partir de : ${nextStage.name}`;
        return "Reprendre au début";
    }
    return "En cours";
};
