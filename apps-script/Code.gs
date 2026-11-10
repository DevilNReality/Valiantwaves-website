/**
 * Valiantwaves "Book a demo" form → email.
 * Paste this whole file into a Google Apps Script project (script.google.com),
 * edit RECIPIENTS below, then deploy as a Web app (steps in README.md).
 */

// ===== EDIT HERE: the three inboxes that receive every demo request =====
var RECIPIENTS = [
  "consulting@valiantwaves.com",
  "vignesh.r@valiantwaves.com",
  "karthikeyan.v@valiantwaves.com"
];
// ========================================================================

var SENDER_NAME = "Valiantwaves Website";
var PRODUCTS = ["BioSync OS", "Medical AI", "New product"];

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    // Basic cleaning and limits (never trust the browser)
    var name = clean_(d.name, 120), phone = clean_(d.phone, 24), email = clean_(d.email, 160),
        product = clean_(d.product, 40), message = clean_(d.message, 3000);

    if (name.length < 2 || message.length < 10) return out_({ ok: false });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return out_({ ok: false });
    if (!/^[+\d\s().-]{7,24}$/.test(phone)) return out_({ ok: false });
    if (PRODUCTS.indexOf(product) === -1) return out_({ ok: false });

    // Stop the same email address from flooding the inbox (1 request per minute)
    var cache = CacheService.getScriptCache(), key = "rl_" + email.toLowerCase();
    if (cache.get(key)) return out_({ ok: true });
    cache.put(key, "1", 60);

    var subject = "New demo request: " + product + " (" + name + ")";
    var text = "Name: " + name + "\nPhone: " + phone + "\nEmail: " + email +
               "\nInterested in: " + product + "\n\nRequirements:\n" + message;
    var html = "<h3>New demo request</h3>" +
      "<p><b>Name:</b> " + esc_(name) + "<br><b>Phone:</b> " + esc_(phone) +
      "<br><b>Email:</b> " + esc_(email) + "<br><b>Interested in:</b> " + esc_(product) + "</p>" +
      "<p><b>Requirements:</b><br>" + esc_(message).replace(/\n/g, "<br>") + "</p>";

    MailApp.sendEmail({
      to: RECIPIENTS.join(","),
      replyTo: email,          // "Reply" in your mail app goes straight to the customer
      subject: subject,
      body: text,
      htmlBody: html,
      name: SENDER_NAME
    });
    return out_({ ok: true });
  } catch (err) {
    console.error(err);
    return out_({ ok: false });
  }
}

// Opening the Web app URL in a browser shows this, so you can confirm it is live.
function doGet() { return out_({ ok: true, status: "Valiantwaves form endpoint is live" }); }

// Run this ONCE from the editor (▶ Run) to grant email permission and send a test mail.
function testSend() {
  MailApp.sendEmail({ to: RECIPIENTS.join(","), subject: "Valiantwaves form: test email",
    body: "If you can read this, the demo form email setup works.", name: SENDER_NAME });
}

function clean_(v, max) { return String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max); }
function esc_(v) { return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
