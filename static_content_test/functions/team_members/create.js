const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  console.log("event: " + JSON.stringify(event));
  const params = {
    TableName: 'StaticContentTable',
    Item: JSON.parse(event.body)
  }

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Could not create team member.'));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    }
    callback(null, response);
  })
}
