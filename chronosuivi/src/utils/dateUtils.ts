import { Constraint, Stage, CalculatedStage, DaySchedule, DayDetail } from '../types';

export const formatDateFr = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    return 'Date invalide';
  }
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'short'
    }).format(date);
  } catch (e) {
    return 'Erreur date';
  }
};

export const parseDate = (dateStr: string): Date => {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  if (!d1 || !d2 || isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isWeekend = (date: Date): boolean => {
  if (!date || isNaN(date.getTime())) return false;
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

// --- Holiday Logic ---

// Helper: Calculate Easter Sunday (Meeus/Jones/Butcher algorithm)
const getEasterDate = (year: number): Date => {
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
  return new Date(year, month - 1, day);
};

// Helper: Move holiday to next working day if it falls on weekend (Standard Federal Rule)
const observeHoliday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  if (day === 0) return addDays(d, 1); // Sunday -> Monday
  if (day === 6) return addDays(d, 2); // Saturday -> Monday
  return d;
};

export const getFederalHolidaysQuebec = (year: number): Constraint[] => {
  const holidays: { date: Date; name: string }[] = [];

  // 1. Fixed Dates with simple observation rules (except Xmas/Boxing Day)
  const fixedHolidays = [
    { m: 0, d: 1, name: "Jour de l'An" },
    { m: 5, d: 24, name: "Saint-Jean-Baptiste (Fête nationale)" },
    { m: 6, d: 1, name: "Fête du Canada" },
    { m: 8, d: 30, name: "Journée nationale de la vérité et de la réconciliation" },
    { m: 10, d: 11, name: "Jour du Souvenir" },
  ];

  fixedHolidays.forEach(h => {
    const date = new Date(year, h.m, h.d);
    holidays.push({ date: observeHoliday(date), name: h.name });
  });

  // 2. Christmas & Boxing Day (Special overlap logic)
  const xmas = new Date(year, 11, 25);
  const boxing = new Date(year, 11, 26);
  let obsXmas = xmas;
  let obsBoxing = boxing;

  if (xmas.getDay() === 6) { // Sat
    obsXmas = new Date(year, 11, 27); // Mon
    obsBoxing = new Date(year, 11, 28); // Tue
  } else if (xmas.getDay() === 0) { // Sun
    obsXmas = new Date(year, 11, 27); // Tue (shifted because Boxing takes Mon)
    obsBoxing = new Date(year, 11, 26); // Mon
  } else if (boxing.getDay() === 6 || boxing.getDay() === 0) {
    obsBoxing = observeHoliday(boxing);
  }

  holidays.push({ date: obsXmas, name: "Noël" });
  holidays.push({ date: obsBoxing, name: "Lendemain de Noël" });

  // 3. Variable Dates (Easter based)
  const easter = getEasterDate(year);
  holidays.push({ date: addDays(easter, -2), name: "Vendredi Saint" });
  holidays.push({ date: addDays(easter, 1), name: "Lundi de Pâques" });

  // 4. Victoria Day / Patriotes (Monday before May 25)
  let victoria = new Date(year, 4, 25);
  while (victoria.getDay() !== 1) victoria = addDays(victoria, -1);
  holidays.push({ date: victoria, name: "Journée nationale des patriotes" });

  // 5. Labour Day (1st Monday of Sept)
  let labour = new Date(year, 8, 1);
  while (labour.getDay() !== 1) labour = addDays(labour, 1);
  holidays.push({ date: labour, name: "Fête du Travail" });

  // 6. Thanksgiving (2nd Monday of Oct)
  let thanks = new Date(year, 9, 1);
  while (thanks.getDay() !== 1) thanks = addDays(thanks, 1);
  thanks = addDays(thanks, 7); // Move to 2nd Monday
  holidays.push({ date: thanks, name: "Action de grâce" });

  // Convert to Constraints
  return holidays.map(h => ({
    id: `holiday-${year}-${h.name.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substr(2, 5)}`,
    date: h.date.toISOString().split('T')[0],
    description: h.name,
    type: 'HOLIDAY'
  }));
};

// --- End Holiday Logic ---

// Core logic: Calculate timeline based on SESSIONS required and WEEKLY SCHEDULE
export const calculateTimeline = (
  startDateStr: string,
  stages: Stage[],
  constraints: Constraint[],
  schedule: DaySchedule[]
): CalculatedStage[] => {
  let currentCursor = parseDate(startDateStr);
  const calculatedStages: CalculatedStage[] = [];

  // Sort stages by order
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  sortedStages.forEach((stage) => {
    const stageStart = new Date(currentCursor);
    let tempDate = new Date(stageStart);

    let sessionsCompleted = 0;
    // Defensive coding: If sessionsRequired is undefined or 0, default to 1 to avoid empty loops or errors, unless explicit 0 allowed.
    // However, usually a stage needs at least 1 session.
    let sessionsNeeded = (stage.sessionsRequired !== undefined && stage.sessionsRequired !== null) ? stage.sessionsRequired : 5;

    let delayReason = '';
    let isDelayed = false;
    let daysPassed = 0;
    const details: DayDetail[] = [];

    // Safety brake for infinite loops if schedule has 0 sessions total
    const totalWeeklySessions = schedule.reduce((acc, s) => acc + s.sessionsCount, 0);
    if (totalWeeklySessions === 0 && sessionsNeeded > 0) {
       // Cannot complete sessions if no days have sessions.
       // We'll just break the loop to avoid hanging the browser.
       sessionsNeeded = 0;
    }

    // Logic: We step day by day.
    while (sessionsCompleted < sessionsNeeded) {
      const isSatSun = isWeekend(tempDate);
      const dayIndex = tempDate.getDay(); // 0-6

      let dayStatus: DayDetail['status'] = 'OFF';
      let dayDescription = '';

      // Check for constraints
      const constraint = constraints.find(c => isSameDay(parseDate(c.date), tempDate));

      if (constraint) {
        // Day is blocked
        isDelayed = true;
        delayReason = constraint.description;
        dayStatus = constraint.type === 'HOLIDAY' ? 'HOLIDAY' : 'CONSTRAINT';
        dayDescription = constraint.description;
      } else if (isSatSun) {
        // Weekend
        dayStatus = 'WEEKEND';
        dayDescription = '';
      } else {
        // It's a weekday (Mon-Fri)
        // Check our schedule configuration
        const scheduleDay = schedule.find(s => s.dayIndex === dayIndex);

        if (scheduleDay && scheduleDay.sessionsCount > 0) {
          // We can perform sessions today
          const sessionsToday = Math.min(scheduleDay.sessionsCount, sessionsNeeded - sessionsCompleted);
          sessionsCompleted += sessionsToday;

          dayStatus = 'SESSION';
          dayDescription = `${sessionsToday} séance${sessionsToday > 1 ? 's' : ''} (Cumul: ${sessionsCompleted}/${sessionsNeeded})`;
        } else {
          dayStatus = 'OFF';
          dayDescription = '';
        }
      }

      details.push({
        date: new Date(tempDate),
        status: dayStatus,
        description: dayDescription
      });

      // If we haven't finished yet, move to next day
      if (sessionsCompleted < sessionsNeeded) {
        tempDate = addDays(tempDate, 1);
        daysPassed++;
      }

      // Safety brake for runaway loops (e.g. > 2 years for one stage)
      if (daysPassed > 730) {
         break;
      }
    }

    const stageEnd = tempDate;

    calculatedStages.push({
      ...stage,
      startDate: stageStart,
      endDate: stageEnd,
      isDelayed,
      delayReason,
      realDurationDays: daysPassed,
      details
    });

    // Set cursor for next stage (start checking the day AFTER this one ends)
    currentCursor = addDays(stageEnd, 1);
  });

  return calculatedStages;
};
