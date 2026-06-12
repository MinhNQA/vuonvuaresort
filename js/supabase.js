const SUPABASE_URL = 'https://tzoonwlaxggpmanfvktv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6b29ud2xheGdncG1hbmZ2a3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDM2NjMsImV4cCI6MjA5MzQ3OTY2M30.33165vW_59tgz-gawHDdpJPF3gd74HUVhiRvDtVYmCo';

function getSupabaseHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

async function supabaseRest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: getSupabaseHeaders(options.headers || {}),
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase error ${response.status}: ${details}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function supabaseAuth(path, body) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.msg || 'Auth failed');
  return data;
}

function getStoredSession() {
  try {
    const raw = localStorage.getItem('vv_auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeSession(session) {
  if (session) localStorage.setItem('vv_auth', JSON.stringify(session));
  else localStorage.removeItem('vv_auth');
}

function authHeaders() {
  const session = getStoredSession();
  const token = session?.access_token || SUPABASE_ANON_KEY;
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token}`,
  };
}

async function authRest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase error ${response.status}: ${details}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
