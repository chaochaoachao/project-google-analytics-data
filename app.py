# import necessary libraries
import logging
import os
import sys
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

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/khaledkhatib/Documents/GitHub/project-google-analytics-data/BigQueryCreds.json"

client = bigquery.Client()

vistorId = []
transactions = []
StartDate='20170701'
EndDate='20170703'

initial_sql=f"""
    SELECT  visitorId,
            visitId,
            visitStartTime,
            date,
            totals.visits,
            totals.hits,
            totals.timeonsite,
            totals.bounces,
            totals.transactions, 
            totals.transactionrevenue,
            totals.newvisits,
            totals.timeonscreen,
            trafficsource.campaign,
            trafficsource.keyword,
            device.ismobile,
            device.operatingsystem,
            geonetwork.country,
            geonetwork.city,
            geonetwork.networkdomain 
            FROM 
            `bigquery-public-data.google_analytics_sample.ga_sessions_*`
            WHERE _TABLE_SUFFIX BETWEEN '20170701' AND '20170702pyt' """

#create_temp_sql= f'SELECT vistorId,transactions, FROM `bigquery-public-data.google_analytics_sample.ga_sessions_{input}'

# create route that renders index.html template


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
    print('---------')
    return render_template("index.html", data=result_1)


@app.route("/send", methods = ['GET', 'POST'])
def sendfromjs():
    #print("Hello world!")
    if request.method == "POST":
        return redirect("/",code=302)
    return render_template("index.html")



@app.route("/api/filtered_data")
def filtered_Data():
    filtered_query = client.query(initial_sql)
    results = filtered_query.result()
    print(results)
    visitorId = [result[0] for result in results]
    transactions = [result[1] for result in results]

    filtered_data = [{
        "visitorId": visitorId,
        "transactions": transactions,
    }]

    return jsonify({data: filtered_data})


if __name__ == "__main__":
    app.run(debug=True)
