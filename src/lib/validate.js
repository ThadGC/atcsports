// Shared client-side rules. The server re-validates everything; this is UX, not security.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

const TYPOS = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
}

export function emailTypo(email) {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain && TYPOS[domain] ? `${email.split('@')[0]}@${TYPOS[domain]}` : null
}

export function validateEmail(v) {
  if (!v.trim()) return 'Enter your email address.'
  if (!EMAIL_RE.test(v.trim())) return 'That email address does not look right.'
  return null
}

export function validatePassword(v) {
  if (!v) return 'Choose a password.'
  if (v.length < 8) return 'Use at least 8 characters.'
  return null
}

export function validateName(v, label = 'name') {
  if (!v.trim()) return `Enter your ${label}.`
  if (v.trim().length < 2) return `That ${label} looks too short.`
  return null
}

export function passwordStrength(v) {
  if (!v) return { score: 0, label: '' }
  let score = 0
  if (v.length >= 8) score++
  if (v.length >= 12) score++
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++
  if (/\d/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  const labels = ['Too short', 'Weak', 'Okay', 'Good', 'Strong', 'Very strong']
  return { score, label: labels[Math.min(score, 5)] }
}
