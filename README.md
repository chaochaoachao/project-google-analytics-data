# project-google-analytics-data

an interactive web app deplyed on google app engine

[App link](http://analyticsproject2020-03-27.appspot.com/)

This folder directory in app engine should look like the following
![appengine](/image/appengine.PNG)

**Stages:**

Stage I work:


1. Used flask(python) to build an interactive web app,  deployed on Google App Engine


2. Extracted the web traffic data from the [Google BigQuery public data source](https://console.cloud.google.com/marketplace/details/obfuscated-ga360-data/obfuscated-ga360-data?filter=solution-type:dataset&q=Store&id=45f150ac-81d3-4796-9abf-d7a4f98eb4c6)(make sure use your own bigquery credentials for bigquery part)

3. Visualized customer demographics with built-in filter options by JavaScript D3 and plotly


4. Embedded a [google data studio dynamic report](https://datastudio.google.com/embed/reporting/c955002d-42c0-4355-9575-df4a1d1cd9ca/page/ctxJB) to the web application 

Stage II work: 
1. customer segmentation analysis perferly by K-means
![kmeans](/image/kmean.PNG)

2. Allow users to select customer groups by drawing on the scatter plot using plotly lasso or D3 lasso
![lasso](/image/circle.PNG)

3. create a email-sending micro service to let user send email to user selected group in step 2.

4. customer life time value prediction with [lightgbm model](https://github.com/chaochaoachao/project-google-analytics-data/blob/master/BigQuery.ipynb)\
 as well as a revenue vs time prediction using facebook prophet model, add US hoildays to the seasonality

5. load the model and label encoding with the pickle on the prediction page, make the prediction after users' input 
![lasso](/image/predict.PNG)

