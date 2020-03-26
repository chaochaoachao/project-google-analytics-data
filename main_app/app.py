# import necessary libraries
from  sqlalchemy.engine import create_engine
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

@app.route("/index")
def index(): 
    return render_template("index.html")

if __name__ == "__main__":
    app.run()

