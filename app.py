# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

# create route that renders index.html template
from google.cloud import bigquery

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "BigQueryCreds.json"

client = bigquery.Client()

vistorId = []
transactions = []
uinput = '20160807'

initial_sql=f'SELECT vistorId,transactions,date 
            FROM FROM `bigquery-public-data.google_analytics_sample.ga_sessions_*`
            WHERE
            _TABLE_SUFFIX BETWEEN '20170701'
            AND '20170731''


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        #capture the input date and return it as uinput
        uinput = request.form["input_date"]
        return redirect("/", code=302)
    return render_template("index.html")


@app.route("/api/filtered_data")
def filtered_Data():
    #Query bigquery with the date that the user has input
    create_temp_sql= f'SELECT vistorId,transactions, FROM `bigquery-public-data.google_analytics_sample.ga_sessions_{uinput}'
    filtered_query = client.query("""{create_temp_sql}""")
    results = filtered_query.results()
    visitorId = [result[0] for result in results]
    transactions = [result[1] for result in results]

    filtered_data = [{
        "visitorId": visitorId,
        "transactions": transactions,
    }]

    return jsonify(filtered_data)


if __name__ == "__main__":
    app.run()
