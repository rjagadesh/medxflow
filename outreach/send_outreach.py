#!/usr/bin/env python3
"""
MedXFlow outreach mailer - sends personalized listicle/directory outreach emails,
one recipient at a time with a delay (good deliverability, not a blast).

Two transports, chosen automatically by the FROM address:
  * @medxflow.ai  -> Microsoft Graph (uses MS_TENANT_ID / MS_CLIENT_ID /
                     MS_CLIENT_SECRET from creds.json; the app's Mail.Send perm)
  * anything else -> SMTP (SMTP_HOST/PORT/USER/PASS from creds.json)

Credentials come from creds.json or env vars. Nothing is hardcoded. No pip deps.

Usage:
  python3 send_outreach.py --from jay@medxflow.ai --test you@example.com   # one test
  python3 send_outreach.py --from jay@medxflow.ai --dry-run                # print only
  python3 send_outreach.py --from jay@medxflow.ai                          # send recipients.csv
  python3 send_outreach.py --from jay@medxflow.ai --limit 5 --delay 90

recipients.csv columns:  email,first_name,article_title,site   (only email required)
A sent.log prevents double-sending across runs.
"""
import argparse, csv, json, os, smtplib, ssl, sys, time, urllib.request, urllib.parse, urllib.error
from email.message import EmailMessage
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent

FROM_NAME = "MedXFlow"
SUBJECT   = "A newer AI RCM vendor for your \"{article_title}\" roundup"
SUBJECT_FALLBACK = "A newer AI RCM vendor worth a look"
BODY = """Hi {first_name},

I came across your article on AI revenue cycle management / RCM software{article_ref} - genuinely one of the clearer overviews out there.

I wanted to flag MedXFlow as a newer entrant worth a look if you ever refresh the list. We're an AI-agent platform for revenue cycle management: our agents automate eligibility, prior authorization, coding, claims and denials end to end, with a human-in-the-loop model so staff only handle the exceptions. It works alongside Epic and athenahealth rather than replacing them.

If it's a fit, I'm happy to send a 2-line blurb, logo, and a couple of screenshots so it's zero work on your end. Either way - thanks for putting the resource together.

Best,
{sender_name}
MedXFlow · https://medxflow.ai{sender_phone}
"""

def cfg():
    c = {}
    p = ROOT / "creds.json"
    if p.exists():
        try: c = json.loads(p.read_text())
        except Exception: c = {}
    return lambda k: os.environ.get(k) or c.get(k)

G = cfg()

# ---------- Microsoft Graph transport ----------
_tok = {"v": None, "exp": 0}
def graph_token():
    if _tok["v"] and time.time() < _tok["exp"]:
        return _tok["v"]
    tenant, cid, secret = G("MS_TENANT_ID"), G("MS_CLIENT_ID"), G("MS_CLIENT_SECRET")
    if not (tenant and cid and secret):
        sys.exit("Graph transport needs MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET (creds.json).")
    data = urllib.parse.urlencode({
        "client_id": cid, "client_secret": secret,
        "scope": "https://graph.microsoft.com/.default", "grant_type": "client_credentials",
    }).encode()
    req = urllib.request.Request(f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token", data=data)
    try:
        d = json.loads(urllib.request.urlopen(req, timeout=30).read())
    except urllib.error.HTTPError as e:
        sys.exit(f"Graph token failed: {e.read().decode()[:200]}")
    _tok["v"], _tok["exp"] = d["access_token"], time.time() + int(d.get("expires_in", 3600)) - 60
    return _tok["v"]

def send_graph(sender, to, subject, body):
    token = graph_token()
    payload = json.dumps({
        "message": {
            "subject": subject,
            "body": {"contentType": "Text", "content": body},
            "toRecipients": [{"emailAddress": {"address": to}}],
            "from": {"emailAddress": {"address": sender}},
        },
        "saveToSentItems": True,
    }).encode()
    url = f"https://graph.microsoft.com/v1.0/users/{urllib.parse.quote(sender)}/sendMail"
    req = urllib.request.Request(url, data=payload, method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req, timeout=30)  # 202 Accepted, no body
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Graph sendMail {e.code}: {e.read().decode()[:300]}")

# ---------- SMTP transport ----------
def send_smtp(server, sender, to, subject, body):
    msg = EmailMessage()
    msg["From"] = f"{FROM_NAME} <{sender}>"
    msg["To"] = to
    msg["Subject"] = subject
    msg["Reply-To"] = sender
    msg.set_content(body)
    server.send_message(msg)

def smtp_connect():
    host, port = G("SMTP_HOST") or "smtp.gmail.com", int(G("SMTP_PORT") or 465)
    user, pw = G("SMTP_USER"), G("SMTP_PASS")
    if not (user and pw):
        sys.exit("SMTP transport needs SMTP_USER / SMTP_PASS (creds.json).")
    s = smtplib.SMTP_SSL(host, port, context=ssl.create_default_context())
    s.login(user, pw)
    return s

# ---------- recipients + log ----------
def read_recipients():
    path = HERE / "recipients.csv"
    if not path.exists():
        sys.exit(f"No recipient list. Create {path} with columns: email,first_name,article_title,site")
    rows = []
    with path.open(newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            e = (r.get("email") or "").strip()
            if e and "@" in e:
                rows.append({"email": e,
                    "first_name": (r.get("first_name") or "there").strip() or "there",
                    "article_title": (r.get("article_title") or "").strip()})
    return rows

def already_sent():
    log = HERE / "sent.log"
    return {l.split("\t")[0].strip().lower() for l in log.read_text().splitlines()} if log.exists() else set()

def mark_sent(email):
    with (HERE / "sent.log").open("a", encoding="utf-8") as f:
        f.write(f"{email.lower()}\t{time.strftime('%Y-%m-%d %H:%M:%S')}\n")

def render(r, sender_name, sender_phone):
    subject = SUBJECT.format(article_title=r["article_title"]) if r["article_title"] else SUBJECT_FALLBACK
    ref = f' ("{r["article_title"]}")' if r["article_title"] else ""
    body = BODY.format(first_name=r["first_name"], article_ref=ref,
        sender_name=sender_name, sender_phone=(f" · {sender_phone}" if sender_phone else ""))
    return subject, body

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="sender", default=os.environ.get("OUTREACH_FROM_EMAIL", "jay@medxflow.ai"),
        help="From address (medxflow.ai -> Graph, else SMTP)")
    ap.add_argument("--test", metavar="EMAIL", help="send one test email to this address and exit")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--delay", type=int, default=75)
    ap.add_argument("--sender-name", default=os.environ.get("OUTREACH_SENDER_NAME", "Jay"))
    ap.add_argument("--sender-phone", default=os.environ.get("OUTREACH_SENDER_PHONE", ""))
    args = ap.parse_args()

    use_graph = args.sender.lower().endswith("@medxflow.ai")
    transport = "Microsoft Graph" if use_graph else "SMTP"
    print(f"From: {FROM_NAME} <{args.sender}>  ·  transport: {transport}\n")

    def deliver(server, to, subject, body):
        if use_graph: send_graph(args.sender, to, subject, body)
        else: send_smtp(server, args.sender, to, subject, body)

    if args.test:
        subject, body = render({"first_name": "there", "article_title": "Best AI RCM Software 2026"},
                               args.sender_name, args.sender_phone)
        print(f" - TEST - To: {args.test}\n  Subject: {subject}\n\n{body}")
        if args.dry_run:
            print("(dry-run: not sent)"); return
        server = None if use_graph else smtp_connect()
        try: deliver(server, args.test, subject, body)
        finally:
            if server: server.quit()
        print(f"\n✓ Test accepted for delivery to {args.test}")
        if use_graph:
            print("  NOTE: Graph returns 'accepted' immediately - CHECK the inbox to confirm it wasn't bounced\n  by the tenant's external-mail block.")
        return

    recips = read_recipients()
    done = already_sent()
    todo = [r for r in recips if r["email"].lower() not in done]
    if args.limit: todo = todo[:args.limit]
    print(f"{len(recips)} in list · {len(recips)-len(todo)} already emailed · sending {len(todo)} now\n")
    if not todo: return

    server = None if (use_graph or args.dry_run) else smtp_connect()
    sent = 0
    try:
        for i, r in enumerate(todo):
            subject, body = render(r, args.sender_name, args.sender_phone)
            if args.dry_run:
                print(f"[{i+1}/{len(todo)}] DRY  → {r['email']}  ({subject})")
            else:
                deliver(server, r["email"], subject, body)
                mark_sent(r["email"]); sent += 1
                print(f"[{i+1}/{len(todo)}] sent → {r['email']}")
                if i < len(todo) - 1: time.sleep(args.delay)
    finally:
        if server: server.quit()
    print(f"\n✓ Done - {sent} sent." if not args.dry_run else "\n(dry-run complete)")

if __name__ == "__main__":
    main()
