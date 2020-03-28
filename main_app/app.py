from  sqlalchemy.engine import create_engine
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from flask_mail import Mail, Message
from password import key

app = Flask(__name__)
app.config.update(
    DEBUG = True,  
    #EMAIL SETTINGS
    TESTING = False,
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 465,
    MAIL_USE_SSL = True,
    MAIL_USE_TLS = False,
    MAIL_USERNAME = 'dq177000@gmail.com',
    MAIL_PASSWORD = key,
    MAIL_DEFAULT_SENDER ='dq177000@gmail.com'
)

mail = Mail(app)

@app.route("/")
def start():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("/dashboard.html")

@app.route("/segmentation")
def segmentation():
    return render_template("/segmentation.html")    

@app.route("/revpredict")
def revpredict():
    return render_template("/revpredict.html")  

@app.route("/timepredict")
def timepredict():
    return render_template("/timepredict.html") 

@app.route("/documentation")
def documentation():
    return render_template("/documentation.html")


@app.route("/send_mail/", methods=["POST", "GET"])
def email():
        try:
            msg = Message('Dear User', 
            sender = 'dq177000@gmail.com',
            recipients = [])
            print(user_email)
            with app.open_resource("static/images/favicon.png") as fp:
                msg.attach("favicon.png", "image/png", fp.read())
            mail.send(msg)
            return redirect("/")

        except:
            return redirect("/error")



if __name__ == "__main__":
    app.run()


