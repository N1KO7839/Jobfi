import os
from pathlib import Path
from dotenv import load_dotenv
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = BREVO_API_KEY
api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

TEMPLATES_DIR = Path(__file__).resolve().parent.parent.parent / "templates" / "emails"

SENDER = {"name": "Jobfi", "email": "nikodemkarla@gmail.com"} 

def send_verification_mail(user_mail: str, link: str):
    import datetime
    username = user_mail.split("@")[0]
    html = (TEMPLATES_DIR / "register_verification.html").read_text(encoding="utf-8")
    html = html.replace("{{ user.name }}", username)
    html = html.replace("{{ verification_url }}", link)
    html = html.replace("{{ frontend_url }}", "http://localhost:3000")
    html = html.replace("{{ current_year }}", str(datetime.datetime.now().year))
    
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": user_mail}],
        html_content=html,
        sender=SENDER,
        subject="Verify your Jobfi account"
    )
    try:
        return api_instance.send_transac_email(send_smtp_email)
    except ApiException as e:
        print(f"Exception when calling TransactionalEmailsApi->send_transac_email: {e}")
        raise e

def send_reset_password_mail(user_mail: str, link: str):
    import datetime
    username = user_mail.split("@")[0]
    html = (TEMPLATES_DIR / "reset_password.html").read_text(encoding="utf-8")
    html = html.replace("{{ user.name }}", username)
    html = html.replace("{{ reset_url }}", link)
    html = html.replace("{{ frontend_url }}", "http://localhost:3000")
    html = html.replace("{{ current_year }}", str(datetime.datetime.now().year))
    
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": user_mail}],
        html_content=html,
        sender=SENDER,
        subject="Reset your Jobfi password"
    )
    try:
        return api_instance.send_transac_email(send_smtp_email)
    except ApiException as e:
        print(f"Exception when calling TransactionalEmailsApi->send_transac_email: {e}")
        raise e

def send_login_mail(user_mail, frontend_url: str = "http://localhost:3000"):
    import datetime
    username = user_mail.split("@")[0]
    html = (TEMPLATES_DIR / "login_welcome.html").read_text(encoding="utf-8")
    html = html.replace("{{ user.name }}", username)
    html = html.replace("{{ frontend_url }}", frontend_url)
    html = html.replace("{{ current_year }}", str(datetime.datetime.now().year))
    
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": user_mail}],
        html_content=html,
        sender=SENDER,
        subject="Welcome back to Jobfi!"
    )
    try:
        return api_instance.send_transac_email(send_smtp_email)
    except ApiException as e:
        print(f"Exception when calling TransactionalEmailsApi->send_transac_email: {e}")
        raise e
