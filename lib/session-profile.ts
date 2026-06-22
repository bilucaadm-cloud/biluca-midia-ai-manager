export type WorkspaceRole = "owner" | "admin" | "designer" | "social";

export type SessionProfile = {
  email: string;
  role: WorkspaceRole;
  name: string;
};

const STORAGE_KEY = "biluca-session-profile";

const defaultProfile: SessionProfile = {
  email: "biluca.adm@gmail.com",
  role: "owner",
  name: "Biluca Administrador",
};

export function getDefaultSessionProfile() {
  return defaultProfile;
}

export function readSessionProfile(): SessionProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultProfile;
    }

    return {
      ...defaultProfile,
      ...(JSON.parse(raw) as Partial<SessionProfile>),
    };
  } catch {
    return defaultProfile;
  }
}

export function saveSessionProfile(profile: SessionProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
