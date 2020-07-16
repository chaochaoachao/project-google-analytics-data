from  sqlalchemy.engine import create_engine
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from flask_mail import Mail, Message

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
    MAIL_PASSWORD = 'wjraoggfdptjmhzi',
    MAIL_DEFAULT_SENDER ='di.qu@mail.utoronto.ca'
)

var email_group = [{email: "di.qu@mail.utoronto.ca",id:"1957458976293878000"},
{email:"756621114@qq.com", id: "7634897085866546000"},
{email:"dq177000@gmail.com", id: "9894955795481014000"}];

mail = Mail(app)

@app.route("/")
def start():
    return render_template("scattergraph.html")

@app.route("/lasso")
def lasso():
    return render_template("lasso.html")

@app.route("/send_mail/<user_email>", methods=["POST", "GET"])
def email(user_email):
        try:
            msg = Message('Hi', 
            sender = 'dq177000@gmail.com',
            recipients = [user_email])
            with app.open_resource("static/images/2.jpg") as fp:
                msg.attach("2.jpg", "image/jpg", fp.read())
            mail.send(msg)
            return jsonify({"status": "success"})

        except:
            return redirect("/error")



if __name__ == "__main__":
    app.run()


