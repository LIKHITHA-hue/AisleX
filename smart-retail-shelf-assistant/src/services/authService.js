// ─────────────────────────────────────────────────────────────────
// authService — mock/local authentication boundary. Replace the
// bodies of these functions with real API calls (e.g. POST
// /api/auth/login, /api/auth/signup) once a backend exists. Keep the
// same function names and return shapes and the rest of the app
// (AuthContext, ProtectedRoute, Login/SignUp pages) needs no changes.
//
// Storage layout (localStorage):
//   aislex_users     -> { [email]: { name, email, password } }  (demo only — never store plaintext passwords in production)
//   aislex_session    -> { email }  (currently logged-in user)
// ─────────────────────────────────────────────────────────────────

const USERS_KEY = 'aislex_users'
const SESSION_KEY = 'aislex_session'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) ?? {}
  } catch {
    return {}
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toPublicUser(user) {
  if (!user) return null
  const { password: _password, ...publicUser } = user
  return publicUser
}

/**
 * @param {{name: string, email: string, password: string}} details
 * @returns {Promise<{name:string, email:string}>}
 */
export async function signUp({ name, email, password }) {
  await wait(500)
  // TODO(backend): POST /api/auth/signup
  const users = readUsers()
  const key = email.trim().toLowerCase()
  if (users[key]) {
    throw new Error('An account with this email already exists.')
  }
  const user = { name: name.trim(), email: key, password }
  users[key] = user
  writeUsers(users)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: key }))
  return toPublicUser(user)
}

/**
 * @param {{email: string, password: string}} credentials
 * @returns {Promise<{name:string, email:string}>}
 */
export async function login({ email, password }) {
  await wait(500)
  // TODO(backend): POST /api/auth/login
  const users = readUsers()
  const key = email.trim().toLowerCase()
  const user = users[key]
  if (!user || user.password !== password) {
    throw new Error('Incorrect email or password.')
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: key }))
  return toPublicUser(user)
}

export async function logout() {
  await wait(150)
  // TODO(backend): POST /api/auth/logout (invalidate session/token)
  localStorage.removeItem(SESSION_KEY)
}

/**
 * Synchronously read the current session, if any. Used on app load to
 * restore auth state before the first render.
 * @returns {{name:string, email:string} | null}
 */
export function getCurrentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (!session?.email) return null
    const users = readUsers()
    return toPublicUser(users[session.email]) ?? null
  } catch {
    return null
  }
}
