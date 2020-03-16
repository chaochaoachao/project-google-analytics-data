from  sqlalchemy.engine import create_engine
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)


app = Flask(__name__)


@app.route("/send_mail", methods=["GET", "POST"])
def email():
    if request.method == "POST":
        name = request.form["petName"]
        lat = request.form["petLat"]
        lon = request.form["petLon"]

        pet = Pet(name=name, lat=lat, lon=lon)
        db.session.add(pet)
        db.session.commit()
        return redirect("/", code=302)

    return render_template("email.html")


if __name__ == "__main__":
    app.run()


