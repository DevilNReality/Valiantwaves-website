# Valiantwaves website (preview)

Single-page site for valiantwaves.com, built to be pasted into Zoho Pages.

- `index.html` – the whole page (HTML, CSS and JS in one file)
- `shots/` – BioSync OS screenshots used by the showcase

## Edit contact details
In `index.html`, search for `EDIT HERE` (bottom `<script>`): `VW_CONTACT` holds the `email` shown in the Contact section.

## "Book a demo" form → email (Google Apps Script)
The form posts to a small Google Apps Script that emails your three team members. The three email IDs live in the script (`apps-script/Code.gs`), not on the website.

1. Go to https://script.google.com → **New project**. Delete the sample code and paste in everything from `apps-script/Code.gs`.
2. Edit `RECIPIENTS` at the top with the three email IDs. Save (Ctrl+S).
3. Select the function **testSend** in the toolbar and click **Run**. Google asks for permission: Review permissions → choose your account → Advanced → Go to project → Allow. The three inboxes should receive a test email.
4. Click **Deploy → New deployment**. Gear icon → **Web app**. Set *Execute as*: **Me**, *Who has access*: **Anyone**. Click Deploy and copy the **Web app URL** (it ends in `/exec`).
5. In `index.html`, search for `EDIT HERE` and paste that URL into `VW_FORM.endpoint`.

Later changes to the script (for example new recipients): **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The URL stays the same.

Notes: emails are sent from the Google account that deployed the script. A normal Google account can send about 100 emails/day (Workspace about 1,500). "Reply" on a request goes straight to the customer.

## Screenshots
Each showcase screen reads its image from `data-src`. Medical AI screenshots go in the hidden gallery (`id="vw-medgal"`); it appears automatically once a link is filled in.
