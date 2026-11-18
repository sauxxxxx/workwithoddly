# Project brief form: Google Apps Script

The "Start a project" form on the site sends each brief to a Google Apps
Script web app ([Code.gs](Code.gs)). The script saves it as a row in a Google
Sheet and emails it to `info@workwithoddly.com`, with the visitor as the
reply-to address.

Until the web app's address is set in `content/site.ts`, the form falls back to
the Gmail / email app / copy options, so nothing is lost either way.

## Set it up (about 5 minutes, once)

1. Sign in to the Google account that should own the briefs (ideally the one
   for info@workwithoddly.com).
2. Create a new Google Sheet, for example "ODDLY project briefs".
3. In the sheet: **Extensions → Apps Script**. Delete the sample code, paste
   the whole of [Code.gs](Code.gs), and press **Save**.
4. **Deploy → New deployment**. Click the gear next to "Select type" and pick
   **Web app**. Set:
   - Description: `Project brief form`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Press **Deploy**, then **Authorize access** and allow the permissions it
   asks for (to add rows to your sheet and send email as you).
6. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/…/exec`.
7. In `content/site.ts`, set `formEndpoint` to that URL, then build and deploy
   the site.

## Check it

- Open the web app URL in a browser: it should show
  `{"ok":true,"service":"ODDLY project brief"}`.
- Send a test brief from the site's Contact page: a row appears in the
  "Briefs" sheet and the email arrives.

## Changing the script later

Edit the code in Apps Script, then **Deploy → Manage deployments → Edit (pencil)
→ Version: New version → Deploy**. Keeping the same deployment keeps the same
URL, so the site does not need changing.

## Limits

A free Google account can send about 100 emails a day from Apps Script; a
Google Workspace account about 1,500. Every brief is saved to the sheet even
if the email limit is reached.
