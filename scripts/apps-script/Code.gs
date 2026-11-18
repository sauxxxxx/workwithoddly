/**
 * ODDLY project brief → Google Sheet + email.
 *
 * The site's "Start a project" form posts here. Each brief is saved as a row
 * in the spreadsheet this script belongs to, and an email goes to NOTIFY with
 * the visitor as the reply-to address. Setup: scripts/apps-script/README.md.
 */

const NOTIFY = "info@workwithoddly.com";
const SHEET_NAME = "Briefs";
const HEADERS = ["Received", "Name", "Email", "Interested in", "Project", "Page"];

/** The form submission (application/x-www-form-urlencoded). */
function doPost(e) {
  const p = (e && e.parameter) || {};

  // Spam trap: the "company" field is hidden from people; bots fill it in.
  if (p.company) return json_({ ok: true });

  const name = clean_(p.name, 120);
  const email = clean_(p.email, 200);
  const need = clean_(p.discipline, 80);
  const message = clean_(p.message, 5000);
  const page = clean_(p.page, 200);
  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json_({ ok: false, error: "Please fill in your name, a valid email and your project." });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date(), safe_(name), safe_(email), safe_(need), safe_(message), safe_(page)]);
  } finally {
    lock.releaseLock();
  }

  // The brief is already saved; a failed email (say, the daily limit) must not
  // tell the visitor it was lost.
  try {
    MailApp.sendEmail({
      to: NOTIFY,
      replyTo: email,
      name: "ODDLY website",
      subject: "New project brief: " + name,
      body:
        "A new project brief from workwithoddly.com\n\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Interested in: " + need + "\n" +
        "Sent from: " + page + "\n\n" +
        message + "\n\n" +
        "Reply to this email to answer them directly.",
    });
  } catch (error) {
    console.error("Brief saved, but the email failed: " + error);
  }

  return json_({ ok: true });
}

/** Opening the web app address in a browser shows that it is running. */
function doGet() {
  return json_({ ok: true, service: "ODDLY project brief" });
}

/** The "Briefs" sheet, created with its header row on first use. */
function sheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Trimmed text, cut to a sensible length. */
function clean_(value, max) {
  return String(value || "").trim().slice(0, max);
}

/** Text that a spreadsheet will never read as a formula. */
function safe_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
