# project-google-analytics-data
**Steps:**
Note: this repo is ready to be git clone to app engine, there would be some errors due to app engine is very picky with lines written in the VS code

1. Used flask(python) to build an interactive web app,  deployed on Google App Engine

2. Extracted the web traffic data from the Google BigQuery public data source(make sure use your own bigquery credentials for bigquery part)

3. Visualized customer demographics with built-in filter options by JavaScript D3 and plotly

4. Performed path analysis of the site traffic using D3 Sankey diagram

5. Embedded a google data studio dynamic report to the web application 


**Future work(will be done in the final proejct by end of March 2020)**
1. customer segmentation analysis perferly by KNN or K-means
2. Allow users to select customer groups by drawing on the scatter plot using plotly lasso or D3 lasso
3. create a email-sending micro service to let user send email to different groups
4. customer life time value prediction (baseline:logistic regression, will be compared with logLightGBM model)

optional: add user sign-in microservice and profile page

