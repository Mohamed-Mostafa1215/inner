import { supabase } from "./supabase";

// local storage keys
const KEYS = {
  PROTOCOL_PROGRESS: "protocol-progress",
  ASSESSMENT_ANSWERS: "assessment-answers",
  ASSESSMENT_HISTORY: "assessment-history",
  JOURNAL_ENTRIES: "journal-entries",
  DECISION_RECORDS: "decision-records",
  EXERCISE_LOG: "exercise-log",
  IDENTITY_ACTIVATIONS: "identity-activations",
  WEEKLY_LOG: "weekly-log",
} as const;

/**
 * 1. Sync Protocol Progress (Record<number, boolean>)
 */
async function syncProtocolProgress() {
  try {
    const localRaw = localStorage.getItem(KEYS.PROTOCOL_PROGRESS);
    const localData: Record<number, boolean> = localRaw ? JSON.parse(localRaw) : {};

    // Fetch from Supabase
    const { data: dbData, error } = await supabase
      .from("protocol_progress")
      .select("day, completed");

    if (error) throw error;

    const merged = { ...localData };
    if (dbData) {
      dbData.forEach((row: { day: number; completed: boolean }) => {
        if (row.completed) {
          merged[row.day] = true;
        }
      });
    }

    // Save merged to local storage
    localStorage.setItem(KEYS.PROTOCOL_PROGRESS, JSON.stringify(merged));

    // Upload local-only completions to Supabase
    const upsertRows = Object.entries(merged)
      .filter(([_, completed]) => completed)
      .map(([day, completed]) => ({
        day: parseInt(day),
        completed,
      }));

    if (upsertRows.length > 0) {
      await supabase.from("protocol_progress").upsert(upsertRows, { onConflict: "day" });
    }
  } catch (err) {
    console.error("Error syncing protocol progress:", err);
  }
}

/**
 * 2. Sync Assessment Answers (Record<number, number>)
 */
async function syncAssessmentAnswers() {
  try {
    const localRaw = localStorage.getItem(KEYS.ASSESSMENT_ANSWERS);
    const localData: Record<number, number> = localRaw ? JSON.parse(localRaw) : {};

    // Fetch from Supabase (row with id = 1)
    const { data, error } = await supabase
      .from("assessment_answers")
      .select("answers")
      .eq("id", 1)
      .maybeSingle();

    let merged = { ...localData };

    if (error) {
      throw error;
    }

    if (data && data.answers) {
      // Merge: take whichever answers dictionary has more keys (more progress)
      const dbAnswers = data.answers as Record<number, number>;
      if (Object.keys(dbAnswers).length > Object.keys(localData).length) {
        merged = { ...dbAnswers };
      }
    }

    // Save to local storage
    localStorage.setItem(KEYS.ASSESSMENT_ANSWERS, JSON.stringify(merged));

    // Upload to Supabase
    await supabase.from("assessment_answers").upsert({
      id: 1,
      answers: merged,
    }, { onConflict: "id" });
  } catch (err) {
    console.error("Error syncing assessment answers:", err);
  }
}

/**
 * 3. Sync Assessment History
 */
async function syncAssessmentHistory() {
  try {
    const localRaw = localStorage.getItem(KEYS.ASSESSMENT_HISTORY);
    const localData: any[] = localRaw ? JSON.parse(localRaw) : [];

    const { data: dbData, error } = await supabase
      .from("assessment_history")
      .select("id, date_text, scores");

    if (error) throw error;

    const mergedMap = new Map<string, any>();
    // Add local ones first
    localData.forEach((item) => mergedMap.set(item.id, item));
    // Add DB ones (will override or add)
    if (dbData) {
      dbData.forEach((row: any) => {
        mergedMap.set(row.id, {
          id: row.id,
          date: row.date_text,
          scores: row.scores,
        });
      });
    }

    const merged = Array.from(mergedMap.values());
    localStorage.setItem(KEYS.ASSESSMENT_HISTORY, JSON.stringify(merged));

    // Upload local ones to DB
    if (merged.length > 0) {
      const upsertRows = merged.map((item) => ({
        id: item.id,
        date_text: item.date,
        scores: item.scores,
      }));
      await supabase.from("assessment_history").upsert(upsertRows, { onConflict: "id" });
    }
  } catch (err) {
    console.error("Error syncing assessment history:", err);
  }
}

/**
 * 4. Sync Journal Entries
 */
async function syncJournalEntries() {
  try {
    const localRaw = localStorage.getItem(KEYS.JOURNAL_ENTRIES);
    const localData: any[] = localRaw ? JSON.parse(localRaw) : [];

    const { data: dbData, error } = await supabase
      .from("journal_entries")
      .select("id, date, mood, dog, decision, reflection, exercise, identity");

    if (error) throw error;

    const mergedMap = new Map<string, any>();
    localData.forEach((item) => mergedMap.set(item.id, item));
    if (dbData) {
      dbData.forEach((row: any) => {
        mergedMap.set(row.id, {
          id: row.id,
          date: row.date,
          mood: row.mood,
          dog: row.dog,
          decision: row.decision || "",
          reflection: row.reflection || "",
          exercise: row.exercise || "",
          identity: row.identity || "",
        });
      });
    }

    // Sort by date descending (newest first)
    const merged = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    localStorage.setItem(KEYS.JOURNAL_ENTRIES, JSON.stringify(merged));

    // Upload to DB
    if (merged.length > 0) {
      const upsertRows = merged.map((item) => ({
        id: item.id,
        date: item.date,
        mood: item.mood,
        dog: item.dog,
        decision: item.decision,
        reflection: item.reflection,
        exercise: item.exercise,
        identity: item.identity,
      }));
      await supabase.from("journal_entries").upsert(upsertRows, { onConflict: "id" });
    }
  } catch (err) {
    console.error("Error syncing journal entries:", err);
  }
}

/**
 * 5. Sync Decision Records
 */
async function syncDecisionRecords() {
  try {
    const localRaw = localStorage.getItem(KEYS.DECISION_RECORDS);
    const localData: any[] = localRaw ? JSON.parse(localRaw) : [];

    const { data: dbData, error } = await supabase
      .from("decision_records")
      .select("id, date_text, context, intuition_scan, alternatives, active_instinct, first_action, emotional_impact");

    if (error) throw error;

    const mergedMap = new Map<string, any>();
    localData.forEach((item) => mergedMap.set(item.id, item));
    if (dbData) {
      dbData.forEach((row: any) => {
        mergedMap.set(row.id, {
          id: row.id,
          date: row.date_text,
          context: row.context,
          intuitionScan: row.intuition_scan,
          alternatives: row.alternatives,
          activeInstinct: row.active_instinct,
          firstAction: row.first_action,
          emotionalImpact: row.emotional_impact,
        });
      });
    }

    const merged = Array.from(mergedMap.values());
    localStorage.setItem(KEYS.DECISION_RECORDS, JSON.stringify(merged));

    // Upload to DB
    if (merged.length > 0) {
      const upsertRows = merged.map((item) => ({
        id: item.id,
        date_text: item.date,
        context: item.context,
        intuition_scan: item.intuitionScan,
        alternatives: item.alternatives,
        active_instinct: item.activeInstinct,
        first_action: item.firstAction,
        emotional_impact: item.emotionalImpact,
      }));
      await supabase.from("decision_records").upsert(upsertRows, { onConflict: "id" });
    }
  } catch (err) {
    console.error("Error syncing decision records:", err);
  }
}

/**
 * 6. Sync Exercise Log
 */
async function syncExerciseLog() {
  try {
    const localRaw = localStorage.getItem(KEYS.EXERCISE_LOG);
    const localData: any[] = localRaw ? JSON.parse(localRaw) : [];

    const { data: dbData, error } = await supabase
      .from("exercise_log")
      .select("id, exercise_key, date");

    if (error) throw error;

    // Use exerciseKey + date as unique map key to avoid duplicates
    const mergedMap = new Map<string, any>();
    localData.forEach((item) => mergedMap.set(`${item.exerciseKey}-${item.date}`, item));
    if (dbData) {
      dbData.forEach((row: any) => {
        mergedMap.set(`${row.exercise_key}-${row.date}`, {
          exerciseKey: row.exercise_key,
          date: row.date,
        });
      });
    }

    const merged = Array.from(mergedMap.values());
    localStorage.setItem(KEYS.EXERCISE_LOG, JSON.stringify(merged));

    // Upload local ones to DB
    if (merged.length > 0) {
      const upsertRows = merged.map((item) => ({
        exercise_key: item.exerciseKey,
        date: item.date,
      }));
      // Note: we just insert, but we can avoid duplicates by using unique constraints or simple insert
      // In Supabase, we can clear and insert, or since it's simple, we can do a selective insert of local items
      // To keep it simple and robust, let's bulk insert local items that are not in the dbData list
      const dbKeys = new Set(dbData?.map((r) => `${r.exercise_key}-${r.date}`) || []);
      const localOnly = localData.filter((item) => !dbKeys.has(`${item.exerciseKey}-${item.date}`));

      if (localOnly.length > 0) {
        const insertRows = localOnly.map((item) => ({
          exercise_key: item.exerciseKey,
          date: item.date,
        }));
        await supabase.from("exercise_log").insert(insertRows);
      }
    }
  } catch (err) {
    console.error("Error syncing exercise log:", err);
  }
}

/**
 * 7. Sync Identity Activations
 */
async function syncIdentityActivations() {
  try {
    const localRaw = localStorage.getItem(KEYS.IDENTITY_ACTIVATIONS);
    const localData: any[] = localRaw ? JSON.parse(localRaw) : [];

    const { data: dbData, error } = await supabase
      .from("identity_activations")
      .select("id, identity_key, date");

    if (error) throw error;

    const mergedMap = new Map<string, any>();
    localData.forEach((item) => mergedMap.set(`${item.identityKey}-${item.date}`, item));
    if (dbData) {
      dbData.forEach((row: any) => {
        mergedMap.set(`${row.identity_key}-${row.date}`, {
          identityKey: row.identity_key,
          date: row.date,
        });
      });
    }

    const merged = Array.from(mergedMap.values());
    localStorage.setItem(KEYS.IDENTITY_ACTIVATIONS, JSON.stringify(merged));

    // Selective insert of local items not in DB
    const dbKeys = new Set(dbData?.map((r) => `${r.identity_key}-${r.date}`) || []);
    const localOnly = localData.filter((item) => !dbKeys.has(`${item.identityKey}-${item.date}`));

    if (localOnly.length > 0) {
      const insertRows = localOnly.map((item) => ({
        identity_key: item.identityKey,
        date: item.date,
      }));
      await supabase.from("identity_activations").insert(insertRows);
    }
  } catch (err) {
    console.error("Error syncing identity activations:", err);
  }
}

/**
 * 8. Sync Weekly Log
 */
async function syncWeeklyLog() {
  try {
    const localRaw = localStorage.getItem(KEYS.WEEKLY_LOG);
    const localData: Record<string, boolean> = localRaw ? JSON.parse(localRaw) : {};

    const { data: dbData, error } = await supabase
      .from("weekly_log")
      .select("log_key, completed");

    if (error) throw error;

    const merged = { ...localData };
    if (dbData) {
      dbData.forEach((row: { log_key: string; completed: boolean }) => {
        if (row.completed) {
          merged[row.log_key] = true;
        }
      });
    }

    localStorage.setItem(KEYS.WEEKLY_LOG, JSON.stringify(merged));

    // Upload local completions to DB
    const upsertRows = Object.entries(merged)
      .filter(([_, completed]) => completed)
      .map(([log_key, completed]) => ({
        log_key,
        completed,
      }));

    if (upsertRows.length > 0) {
      await supabase.from("weekly_log").upsert(upsertRows, { onConflict: "log_key" });
    }
  } catch (err) {
    console.error("Error syncing weekly log:", err);
  }
}

/**
 * Main function to sync all data. Run on app initialization.
 */
export async function syncAllFromSupabase(): Promise<void> {
  console.log("Starting full data sync from Supabase...");
  await Promise.allSettled([
    syncProtocolProgress(),
    syncAssessmentAnswers(),
    syncAssessmentHistory(),
    syncJournalEntries(),
    syncDecisionRecords(),
    syncExerciseLog(),
    syncIdentityActivations(),
    syncWeeklyLog(),
  ]);
  console.log("Full data sync from Supabase completed.");
}

/**
 * Hook logic replacement: trigger background write to Supabase when localStorage changes.
 * This is used to keep Supabase updated dynamically as the user works.
 */
export async function syncValueToSupabase(key: string, value: any): Promise<void> {
  try {
    switch (key) {
      case KEYS.PROTOCOL_PROGRESS: {
        const upsertRows = Object.entries(value || {})
          .filter(([_, completed]) => completed)
          .map(([day, completed]) => ({
            day: parseInt(day),
            completed: !!completed,
          }));
        if (upsertRows.length > 0) {
          await supabase.from("protocol_progress").upsert(upsertRows, { onConflict: "day" });
        }
        break;
      }
      case KEYS.ASSESSMENT_ANSWERS: {
        await supabase.from("assessment_answers").upsert({
          id: 1,
          answers: value || {},
        }, { onConflict: "id" });
        break;
      }
      case KEYS.ASSESSMENT_HISTORY: {
        if (Array.isArray(value) && value.length > 0) {
          const upsertRows = value.map((item) => ({
            id: item.id,
            date_text: item.date,
            scores: item.scores,
          }));
          await supabase.from("assessment_history").upsert(upsertRows, { onConflict: "id" });
        }
        break;
      }
      case KEYS.JOURNAL_ENTRIES: {
        if (Array.isArray(value) && value.length > 0) {
          const upsertRows = value.map((item) => ({
            id: item.id,
            date: item.date,
            mood: item.mood,
            dog: item.dog,
            decision: item.decision || "",
            reflection: item.reflection || "",
            exercise: item.exercise || "",
            identity: item.identity || "",
          }));
          await supabase.from("journal_entries").upsert(upsertRows, { onConflict: "id" });
        }
        break;
      }
      case KEYS.DECISION_RECORDS: {
        if (Array.isArray(value) && value.length > 0) {
          const upsertRows = value.map((item) => ({
            id: item.id,
            date_text: item.date,
            context: item.context,
            intuition_scan: item.intuitionScan,
            alternatives: item.alternatives,
            active_instinct: item.activeInstinct,
            first_action: item.firstAction,
            emotional_impact: item.emotionalImpact,
          }));
          await supabase.from("decision_records").upsert(upsertRows, { onConflict: "id" });
        }
        break;
      }
      case KEYS.EXERCISE_LOG: {
        if (Array.isArray(value) && value.length > 0) {
          // Upload any logs that are new (we can just upsert or insert)
          const insertRows = value.map((item) => ({
            exercise_key: item.exerciseKey,
            date: item.date,
          }));
          // Note: we can't easily upsert without constraint on key+date, so we do insert or let sync handle it
          // A simple approach is just letting periodic sync handle it or write to table
          await supabase.from("exercise_log").insert(insertRows);
        }
        break;
      }
      case KEYS.IDENTITY_ACTIVATIONS: {
        if (Array.isArray(value) && value.length > 0) {
          const insertRows = value.map((item) => ({
            identity_key: item.identityKey,
            date: item.date,
          }));
          await supabase.from("identity_activations").insert(insertRows);
        }
        break;
      }
      case KEYS.WEEKLY_LOG: {
        const upsertRows = Object.entries(value || {})
          .filter(([_, completed]) => completed)
          .map(([log_key, completed]) => ({
            log_key,
            completed: !!completed,
          }));
        if (upsertRows.length > 0) {
          await supabase.from("weekly_log").upsert(upsertRows, { onConflict: "log_key" });
        }
        break;
      }
    }
  } catch (err) {
    console.error(`Error saving ${key} to Supabase:`, err);
  }
}
