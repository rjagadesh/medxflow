#!/usr/bin/env python3
"""
MedXFlow outreach mailer — sends personalized listicle/directory outreach emails
over SMTP, one recipient at a time with a delay (good deliverability, not a blast).

Credentials come from the project's creds.json (SMTP_HOST/PORT/USER/PASS) by
default, or from env vars of the same name. Nothing is hardcoded.

Usage:
  python3 send_outreach.py --test you@example.com        # send ONE test to yourself
  python3 send_outreach.py --dry-run                     # print, don't send
  python3 send_outreach.py                                # send to everyone in recipients.csv
  python3 send_outreach.py --limit 5 --delay 90          # first 5, 90s apart

Recipients CSV (recipients.csv, next to this file) columns:
  email,first_name,article_title,site
Only `email` is required; the rest personalize the template (blank is fine).

A log of who was emailed is kept in sent.log so re-runs never double-send.
"""
import argparse, csv, json, os, smtplib, ssl, sys, time
from email.message import EmailMessage
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent

# ---- editable content -------------------------------------------------------
FROM_NAME = "MedXFlow"                 # display name on the From header
SUBJECT   = "A newer AI RCM vendor for your \"{article_title}\" roundup"
SUBJECT_FALLBACK = "A newer AI RCM vendor worth a look"

BODY = """Hi {first_name},

I came across your article on AI revenue cycle management / RCM software{article_ref} — genuinely one of the clearer overviews out there.

I wanted to flag MedXFlow as a newer entrant worth a look if you ever refresh the list. We're an AI-agent platform for revenue cycle management: our agents automate eligibility, prior authorization, coding, claims and denials end to end, with a human-in-the-loop model so staff only handle the exceptions. It works alongside Epic and athenahealth rather than replacing them.

If it's a fit, I'm happy to send a 2-line blurb, logo, and a couple of screenshots so it's zero work on your end. Either way — thanks for putting the resource together.

Best,
{sender_name}
MedXFlow · https://medxflow.ai{sender_phone}
"""
# ----------------------------------------------------------------------------

def load_smtp():
    cfg = {}
    creds_path = ROOT / "creds.json"
    if creds_path.exists():
        try:
            cfg = json.loads(creds_path.read_text())
        except Exception:
            cfg = {}
    g = lambda k: os.environ.get(k) or cfg.get(k)
    smtp = {
        "host": g("SMTP_HOST") or "smtp.gmail.com",
        "port": int(g("SMTP_PORT") or 465),
        "user": g("SMTP_USER"),
        "password": g("SMTP_PASS"),
        "from_email": (g("OUTREACH_FROM_EMAIL") or g("SMTP_USER")),
    }
    if not smtp["user"] or not smtp["password"]:
        sys.exit("No SMTP credentials found. Set SMTP_USER and SMTP_PASS (env or creds.json).")
    return smtp

def read_recipients():
    path = HERE / "recipients.csv"
    if not path.exists():
        sys.exit(f"No recipient list. Create {path} with columns: email,first_name,article_title,site")
    rows = []
    with path.open(newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            email = (r.get("email") or "").strip()
            if email and "@" in email:
                rows.append({
                    "email": email,
                    "first_name": (r.get("first_name") or "there").strip() or "there",
                    "article_title": (r.get("article_title") or "").strip(),
                    "site": (r.get("site") or "").strip(),
                })
    return rows

def already_sent():
    log = HERE / "sent.log"
    if not log.exists():
        return set()
    return {l.split("\t")[0].strip().lower() for l in log.read_text().splitlines() if l.strip()}

def mark_sent(email):
    with (HERE / "sent.log").open("a", encoding="utf-8") as f:
        f.write(f"{email.lower()}\t{time.strftime('%Y-%m-%d %H:%M:%S')}\n")

def build_message(smtp, to_email, r, sender_name, sender_phone):
    subject = SUBJECT.format(article_title=r["article_title"]) if r["article_title"] else SUBJECT_FALLBACK
    article_ref = f' ("{r["article_title"]}")' if r["article_title"] else ""
    body = BODY.format(
        first_name=r["first_name"], article_ref=article_ref,
        sender_name=sender_name,
        sender_phone=(f" · {sender_phone}" if sender_phone else ""),
    )
    msg = EmailMessage()
    msg["From"] = f"{FROM_NAME} <{smtp['from_email']}>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg["Reply-To"] = smtp["from_email"]
    msg.set_content(body)
    return msg

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--test", metavar="EMAIL", help="send one test email to this address and exit")
    ap.add_argument("--dry-run", action="store_true", help="print emails, do not send")
    ap.add_argument("--limit", type=int, default=0, help="max emails to send this run (0 = all)")
    ap.add_argument("--delay", type=int, default=75, help="seconds between sends (default 75)")
    ap.add_argument("--sender-name", default=os.environ.get("OUTREACH_SENDER_NAME", "Jagadesh"))
    ap.add_argument("--sender-phone", default=os.environ.get("OUTREACH_SENDER_PHONE", ""))
    args = ap.parse_args()

    smtp = load_smtp()
    ctx = ssl.create_default_context()

    def connect():
        s = smtplib.SMTP_SSL(smtp["host"], smtp["port"], context=ctx)
        s.login(smtp["user"], smtp["password"])
        return s

    # Test mode: one email to yourself, then stop.
    if args.test:
        r = {"email": args.test, "first_name": "there", "article_title": "Best AI RCM Software 2026", "site": ""}
        msg = build_message(smtp, args.test, r, args.sender_name, args.sender_phone)
        print(f"— TEST — From: {msg['From']}\n  To: {args.test}\n  Subject: {msg['Subject']}\n")
        print(msg.get_content())
        if args.dry_run:
            print("(dry-run: not sent)"); return
        with connect() as s:
            s.send_message(msg)
        print(f"\n✓ Test sent to {args.test}")
        return

    recipients = read_recipients()
    done = already_sent()
    todo = [r for r in recipients if r["email"].lower() not in done]
    if args.limit:
        todo = todo[:args.limit]
    print(f"{len(recipients)} in list · {len(recipients)-len(todo)} already emailed · sending {len(todo)} now\n")
    if not todo:
        return

    sent = 0
    server = None if args.dry_run else connect()
    try:
        for i, r in enumerate(todo):
            msg = build_message(smtp, r["email"], r, args.sender_name, args.sender_phone)
            if args.dry_run:
                print(f"[{i+1}/{len(todo)}] DRY  → {r['email']}  ({msg['Subject']})")
            else:
                server.send_message(msg)
                mark_sent(r["email"])
                sent += 1
                print(f"[{i+1}/{len(todo)}] sent → {r['email']}")
                if i < len(todo) - 1:
                    time.sleep(args.delay)
    finally:
        if server:
            server.quit()
    print(f"\n✓ Done — {sent} emails sent." if not args.dry_run else "\n(dry-run complete)")

if __name__ == "__main__":
    main()
