const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.put = (event, context, callback) => {
  const params = {
    TableName: 'StaticContentTable',
    Item: JSON.parse(event.body),
    Expected: {
      "id": parseInt(event.pathParameters.id),
      Exists: true
    }
  }

  dynamoDb.put(params, (error, result) => {
    if(error) {
      console.error(error);
      callback(new Error(error));
      return;
    }
/*    if(result.Item == undefined) {
      response = {
        statusCode: 404,
        body: JSON.stringify({"message":"Could not find Service " + event.pathParameters.id + "."})
      }*/
    else{
      response = {
        statusCode: 200,
        body: JSON.stringify({"message":"Service: " + event.pathParameters.id + " successfully replaced."})
      }
    }
    callback(null, response);
  });
}
