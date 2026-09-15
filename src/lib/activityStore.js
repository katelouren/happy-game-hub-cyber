import { migrateProfile } from "./competencies.mjs";
import { uniqueGames } from "./estimatedProgress.mjs";

const STORAGE_KEY = "happy-game-hub:activity:v1";
const ACTIVITY_EVENT = "happy-game-hub:activity-changed";

const EMPTY_ACTIVITY = {
  version: 1,
  profile: null,
  gameCompletions: [],
  gameInterests: [],
  assistantInteractions: [],
};

function cloneEmptyActivity() {
  return {
    ...EMPTY_ACTIVITY,
    gameCompletions: [],
    gameInterests: [],
    assistantInteractions: [],
  };
}

function normalizeActivity(value) {
  if (!value || typeof value !== "object") return cloneEmptyActivity();

  return {
    version: 1,
    gameCompletions: uniqueGames(value.gameCompletions),
    profile:
      migrateProfile(value.profile),
    gameInterests: uniqueGames(value.gameInterests).slice(0, 20),
    assistantInteractions: Array.isArray(value.assistantInteractions)
      ? value.assistantInteractions.slice(0, 20)
      : [],
  };
}

export function getEmptyActivity() {
  return cloneEmptyActivity();
}

export function readActivity() {
  if (typeof window === "undefined") return cloneEmptyActivity();

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    return storedValue
      ? normalizeActivity(JSON.parse(storedValue))
      : cloneEmptyActivity();
  } catch {
    return cloneEmptyActivity();
  }
}

function persistActivity(activity) {
  if (typeof window === "undefined") return activity;

  const normalizedActivity = normalizeActivity(activity);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedActivity));
  } catch {
    // A aplicação continua funcional quando o navegador bloqueia armazenamento.
  }

  window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT, { detail: normalizedActivity }));
  return normalizedActivity;
}

export function updateActivity(updater) {
  const currentActivity = readActivity();
  return persistActivity(updater(currentActivity));
}

export function savePlayerProfile(profile) {
  return updateActivity((activity) => ({
    ...activity,
    profile: {
      ...activity.profile,
      idade: profile.idade,
      objetivo: profile.objetivo,
      estilo: profile.estilo,
      updatedAt: new Date().toISOString(),
    },
  }));
}

export function toggleGameInterest(game) {
  let selected = false;

  const activity = updateActivity((currentActivity) => {
    const alreadySelected = currentActivity.gameInterests.some(
      (item) => String(item.id) === String(game.id),
    );
    selected = !alreadySelected;

    return {
      ...currentActivity,
      gameInterests: alreadySelected
        ? currentActivity.gameInterests.filter(
            (item) => String(item.id) !== String(game.id),
          )
        : [
            {
              id: game.id,
              title: game.title,
              genre: game.genre,
              platform: game.platform,
              competencyId: game.competencyId,
              selectedAt: new Date().toISOString(),
            },
            ...currentActivity.gameInterests,
          ].slice(0, 20),
    };
  });

  return { activity, selected };
}

export function recordAssistantInteraction(topic = "geral") {
  return updateActivity((activity) => ({
    ...activity,
    assistantInteractions: [
      {
        id: globalThis.crypto?.randomUUID?.() ?? `assistant-${Date.now()}`,
        topic,
        createdAt: new Date().toISOString(),
      },
      ...activity.assistantInteractions,
    ].slice(0, 20),
  }));
}

export function clearPersonalization() {
  return persistActivity(cloneEmptyActivity());
}

export function subscribeToActivity(callback) {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (event) => callback(event.detail ?? readActivity());
  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY) callback(readActivity());
  };

  window.addEventListener(ACTIVITY_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(ACTIVITY_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorage);
  };
}

// Completion is declared by the user, never inferred from an external link.
export function setGameCompleted(game, completed) {
  return updateActivity((activity) => ({
    ...activity,
    gameCompletions: completed
      ? uniqueGames([...activity.gameCompletions, game])
      : activity.gameCompletions.filter((item) => String(item.id) !== String(game.id)),
  }));
}
