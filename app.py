# import necessary libraries
from  sqlalchemy.engine import create_engine
import json
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import plotly.graph_objects as go
import pandas as pd




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
engine = create_engine('bigquery://project-1-257523/bigquery-public-data',
                       credentials_path='BigQueryCreds.json')

StartDate='20170701'
EndDate='20170703'

create_temp_sql= f'SELECT vistorId,transactions, FROM `bigquery-public-data.google_analytics_sample.ga_sessions_{input}'


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


@app.route("/api/filtered_data/<startdate>/<enddate>")
def Data(startdate, enddate):
    query =f"""
    SELECT 
        date,
        SUM ( totals.transactions ) AS total_transactions
        FROM
        `bigquery-public-data.google_analytics_sample.ga_sessions_*`
        WHERE
        _TABLE_SUFFIX BETWEEN '""" + startdate +"""'
        AND '""" + enddate + """'
        GROUP BY
        date
        ORDER BY
        date ASC 
        """
    rows = engine.execute(query).fetchall()
    data = [] 
    for row in rows: 
        data.append(dict(zip(row.keys(), row)))
    output = {"data": data}
    return jsonify(output)

if __name__ == "__main__":
    app.run()

