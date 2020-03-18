# import necessary libraries
from  sqlalchemy.engine import create_engine
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from flask_mail import Mail, Message
#import plotly.graph_objects as go
import pandas as pd

#################################################
# Flask Setup
#################################################
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
    MAIL_DEFAULT_SENDER ='dq177000@gmail.com'
)
mail = Mail(app)
#################################################
# Database Setup
#################################################

# create route that renders index.html template
from google.cloud import bigquery

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "static/js/BigQueryCreds.json"

client = bigquery.Client()
engine = create_engine('bigquery://project-1-257523/bigquery-public-data',
                       credentials_path='static/js/BigQueryCreds.json')

StartDate='20170701'
EndDate='20170703'


# Query the database and send the jsonified results
@app.route("/")
def send():
    filtered_query = bigquery.Client().query("""
        SELECT 
        date,
        SUM ( totals.transactions ) AS total_transactions
        FROM
        `bigquery-public-data.google_analytics_sample.ga_sessions_*`
        WHERE
        _TABLE_SUFFIX BETWEEN '""" + StartDate +"""'
        AND '""" + EndDate + """'
        GROUP BY
        date
        ORDER BY
        date ASC 
        """)
    results = filtered_query.result().to_dataframe()
    result_1=results.to_dict()
    return render_template("index.html", data=result_1)


@app.route("/send_mail", methods=["POST", "GET"])
def email():
    #print(email)
    if request.method == "POST":
        email = request.form["email"]
        print(email)
        try:
            msg = Message('Hi', 
            sender = 'dq177000@gmail.com',
            recipients = [email])
            mail.send(msg)
            return redirect("/")

        except:
            return redirect("/error")

    return render_template("email.html")

    


@app.route("/api/filtered_data/<startdate>/<enddate>")
def Data(startdate, enddate):
    query =f"""
    SELECT 
        date,
        SUM ( totals.transactions ) AS total_transactions
        FROM
        `bigquery-public-data.google_analytics_sample.ga_sessions_*`
        WHERE
        _TABLE_SUFFIX BETWEEN '""" +startdate +"""'
        AND '""" + enddate+"""'
        GROUP BY
        date
        ORDER BY
        date ASC 
        """
    print(query)
    print(startdate)
    rows = engine.execute(query).fetchall()
    data = [] 
    for row in rows: 
        data.append(dict(zip(row.keys(), row)))

    query_2 = f"""SELECT
        geonetwork.country as Country_name,
        COUNT (geonetwork.country) AS COUNTRY_count,
        FROM
        `bigquery-public-data.google_analytics_sample.ga_sessions_*`
        WHERE
        _TABLE_SUFFIX BETWEEN '""" +startdate +"""'
        AND '""" + enddate+"""'
        GROUP BY
        geonetwork.country
        ORDER BY
        COUNT (geonetwork.country) DESC
        """    
    geo_rows = engine.execute(query_2).fetchall()
    geodata = [] 
    for row in geo_rows: 
        geodata.append(dict(zip(row.keys(), row)))
    output = {"data": data,
    "geodata":geodata}
    return jsonify(output)

if __name__ == "__main__":
    app.run()

