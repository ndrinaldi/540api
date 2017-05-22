const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();


// --- PUT --- //
module.exports.post = (event, context, callback) => {
  const params = {
    TableName: 'Services',
    Item: JSON.parse(event.body)
  }

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }else{
      response = {
        statusCode: 201,
        body: JSON.stringify({"message":"Service was successfully created."})
      }
    }
    callback(null, response);
  });
}


// --- LIST --- //
module.exports.list = (event, context, callback) => {
  const params = {
    TableName: 'Services',
  }

  dynamoDb.scan(params, (error, result) => {
    if(error) {
      console.error(error);
      callback(new Error("An unexpected error occurred."));
      return;
    }else{
      response = {
        statusCode: 200,
        body: JSON.stringify({"message":"Success."})
      }
    }
    callback(null, response);
  });
}


// --- GET --- //
module.exports.get = (event, context, callback) => {
  const params = {
    TableName: 'Services',
    Key: {
      id: parseInt(event.pathParameters.id)
    }
  }

  dynamoDb.get(params, (error, result) => {
    if(error) {
      console.error(error);
      callback(new Error(error));
      return;
    }
    if(result.Item == undefined) {
      response = {
        statusCode: 404,
        body: JSON.stringify({"message":"Could not find Service " + event.pathParameters.id + "."})
      }
    }else{
      response = {
        statusCode: 200,
        body: JSON.stringify(result.Item)
      }
    }
    callback(null, response);
  });
}


// --- PUT --- //
module.exports.put = (event, context, callback) => {
  const params = {
    TableName: 'Services',
    Key: {
      id: parseInt(event.pathParameters.id)
    }
    Item: JSON.parse(event.body)
  }

  dynamoDb.putItem(params, (error, result) => {
    if(error) {
      console.error(error);
      callback(new Error(error));
      return;
    }
    if(result.Item == undefined) {
      response = {
        statusCode: 404,
        body: JSON.stringify({"message":"Could not find Service " + event.pathParameters.id + "."})
      }
    }else{
      response = {
        statusCode: 200,
        body: JSON.stringify({"message":"Service: " + event.pathParameters.id + " successfully replaced."})
      }
    }
    callback(null, response);
  });
}


// --- DELETE --- //
module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: 'Services',
    Key: {
      id: parseInt(event.pathParameters.id)
    }
  }

  dynamoDb.delete(params, (error, result) => {
    console.log(result);
    if(error) {
      console.error(error);
      callback(new Error(error));
      return;
    }else if(result.Item == undefined){
      response = {
        statusCode: 404,
        body: JSON.stringify({"message":"Could not find Service " + event.pathParameters.id + "."})
      }
    }else{
      response = {
        statusCode: 200,
        body: JSON.stringify({"message": "Service: " + event.pathParameters.id + " successfully deleted."})
      }
    }
    callback(null, response);
  });
}
