# 540api

These files require serverless to deploy. Here is the installation guide
for serverless - https://serverless.com/framework/docs/providers/aws/guide/installation/

To delpoy these endpoints, simply type bash DeployAll.bash. Examine DepolyAll.bash to find how to
deploy single service (client, team member, etc)

Included witht he services is a swaager doc, json schema for the resources, and the resources themselves.
Pleasd ignore static_content_test, it was used for testing purposes

In each service file there is a serverless config file for aws, the node.js file to call dynamoDB functions, and
a serverless yamal file for deploying.

You can use cloudwatch in aws to catch any database errors that may occure.

node_modules is still a mystery to me. 
