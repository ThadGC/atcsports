import { chromium } from 'playwright'

const OUT = '/private/tmp/claude-501/-Users-thadeusgous-Documents-ATCsports/45d853b9-94e3-472d-841a-b97fe9c1df2c/scratchpad/shots'
const BASE = process.env.BASE || 'http://localhost:5173'
const email = `parent.${Date.now()}@example.com`
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } })
const page = await ctx.newPage()
const errs = []
page.on('pageerror', (e) => errs.push(e.message))
const step = (m) => console.log(`  ${m}`)

// --- 1. client-side validation blocks a bad submit
await page.goto(`${BASE}/register`, { waitUntil: 'networkidle' })
await page.click('button[type="submit"]')
await page.waitForTimeout(400)
const inlineErrors = await page.locator('[role="alert"]').count()
step(`inline validation errors shown: ${inlineErrors} ${inlineErrors >= 3 ? '✓' : '✗'}`)

// --- 2. email typo suggestion
await page.fill('#firstName', 'Alex')
await page.fill('#lastName', 'Morgan')
await page.fill('#email', 'alex@gmial.com')
await page.locator('#email').blur()
await page.waitForTimeout(400)
const typo = await page.locator('text=Did you mean').count()
step(`gmial.com typo caught: ${typo ? '✓' : '✗'}`)
if (typo) await page.click('text=Did you mean')
step(`email corrected to: ${await page.inputValue('#email')}`)

// --- 3. password strength meter
await page.fill('#email', email)
await page.fill('#password', 'abc')
await page.waitForTimeout(200)
await page.fill('#password', 'Str0ng-Pass!phrase')
await page.waitForTimeout(400)
const strength = await page.locator('text=/Weak|Okay|Good|Strong|Very strong/').first().textContent().catch(() => null)
step(`strength meter: ${strength || 'not shown'} ${strength ? '✓' : '✗'}`)

// --- 4. show/hide password
const before = await page.getAttribute('#password', 'type')
await page.click('button[aria-label="Show password"]')
const after = await page.getAttribute('#password', 'type')
step(`password reveal ${before} -> ${after} ${before === 'password' && after === 'text' ? '✓' : '✗'}`)

// --- 5. real signup
await page.click('button[type="submit"]')
await page.waitForURL('**/account', { timeout: 15000 })
step(`redirected to account ✓  (${page.url().replace(`${BASE}`, '')})`)
await page.waitForTimeout(1200)
step(`greeting: "${(await page.locator('h1').first().textContent()).trim()}"`)
await page.screenshot({ path: `${OUT}/mobile-account-empty.png` })

// --- 6. add an athlete
await page.click('text=Add your first athlete')
await page.fill('#firstName', 'Riley')
await page.fill('#lastName', 'Morgan')
// the division picker is a custom listbox now, not a native select
await page.locator('[role="combobox"]').first().click()
await page.waitForTimeout(400)
const divisionOption = page.locator('[role="option"]').nth(3)
const chosenDivision = (await divisionOption.textContent()).trim()
await divisionOption.click()
await page.waitForTimeout(400)
await page.fill('#notes', 'Would like to play with Sam Carter')
await page.click('button:has-text("Save athlete")')
await page.waitForTimeout(1500)
const athleteVisible = await page.locator('text=Riley Morgan').count()
step(`division picked via custom listbox: "${chosenDivision}" ${chosenDivision ? '✓' : '✗'}`)
step(`athlete saved & listed: ${athleteVisible ? '✓' : '✗'}`)
const successMsg = await page.locator('[role="status"]').first().textContent().catch(() => null)
step(`success message: "${successMsg?.trim() || 'none'}" ${successMsg ? '✓' : '✗'}`)
await page.screenshot({ path: `${OUT}/mobile-account.png` })

// --- 7. session survives a reload
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
step(`session persists after reload: ${(await page.locator('text=Riley Morgan').count()) ? '✓' : '✗'}`)

// --- 8. protected route after logout
await page.locator('main button:has-text("Log out")').first().click()
await page.waitForURL(`${BASE}/`, { timeout: 10000 })
step('logged out, redirected home ✓')
await page.goto(`${BASE}/account`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
step(`/account while logged out -> ${page.url().replace(`${BASE}`, '')} ${page.url().includes('/login') ? '✓' : '✗'}`)

// --- 9. log back in
await page.fill('#email', email)
await page.fill('#password', 'Str0ng-Pass!phrase')
await page.click('button[type="submit"]')
await page.waitForURL('**/account', { timeout: 15000 })
await page.waitForTimeout(1200)
step(`log back in, athlete still there: ${(await page.locator('text=Riley Morgan').count()) ? '✓' : '✗'}`)

// --- 10. wrong password shows a server error
await page.locator('main button:has-text("Log out")').first().click()
await page.waitForTimeout(800)
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await page.fill('#email', email)
await page.fill('#password', 'definitely-wrong')
await page.click('button[type="submit"]')
await page.waitForTimeout(1500)
const loginErr = await page.locator('[role="alert"]').first().textContent().catch(() => null)
step(`wrong password error: "${loginErr?.trim() || 'none'}" ${loginErr ? '✓' : '✗'}`)

// --- 11. contact form success state
await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' })
await page.fill('#name', 'Pat Nguyen')
await page.fill('#email', 'pat@example.com')
await page.fill('#message', 'My son is in 2nd grade and has never played. Which division suits him?')
await page.click('button:has-text("Send message")')
await page.waitForTimeout(1800)
const sent = await page.locator('text=Message sent').count()
step(`contact form success state: ${sent ? '✓' : '✗'}`)
await page.screenshot({ path: `${OUT}/mobile-contact-sent.png` })

console.log(`\n  JS errors: ${errs.length ? errs.join(' | ') : 'none ✓'}`)
await b.close()
