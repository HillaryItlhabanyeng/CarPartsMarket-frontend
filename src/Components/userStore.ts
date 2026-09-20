// The marketplace's list of people: everyone who registers or logs in is kept here so the
// admin pages (Dashboard, Users) show real accounts. Stored under "marketplace_users".
export type UserRecord = {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  status?: string;
  joined?: string;
  initials?: string;
  registeredAt?: string;
  lastLogin?: string;
};

const USERS_KEY = "marketplace_users";

export function readUsers(): UserRecord[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeUsers(users: UserRecord[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const clean = (value?: string) => value?.trim() || undefined;

const initialsOf = (name: string) => {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

type UpsertInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  mobile?: string;
  // Only send a role when it should change (login). Registration leaves an existing role alone.
  role?: string;
  // true when this call is a login, so the time is recorded
  loggedIn?: boolean;
};

// Creates the user if their email is new, otherwise updates the existing record (matched by email).
export function upsertUser(input: UpsertInput): UserRecord {
  const email = input.email.trim().toLowerCase();
  const users = readUsers();
  const index = users.findIndex((user) => user.email?.toLowerCase() === email);
  const existing = index >= 0 ? users[index] : undefined;

  const firstName = clean(input.firstName) ?? existing?.firstName;
  const lastName = clean(input.lastName) ?? existing?.lastName;
  const name =
    `${firstName ?? ""} ${lastName ?? ""}`.trim() ||
    clean(input.name) ||
    existing?.name ||
    email.split("@")[0];
  const now = new Date();

  const record: UserRecord = {
    ...existing,
    id: existing?.id ?? Date.now(),
    firstName,
    lastName,
    name,
    email,
    mobile: clean(input.mobile) ?? existing?.mobile,
    role: input.role ?? existing?.role ?? "buyer",
    status: existing?.status ?? "Active",
    initials: initialsOf(name),
    joined:
      existing?.joined ??
      now.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }),
    registeredAt: existing?.registeredAt ?? now.toISOString(),
    lastLogin: input.loggedIn ? now.toISOString() : existing?.lastLogin,
  };

  if (index >= 0) users[index] = record;
  else users.push(record);
  writeUsers(users);

  return record;
}
