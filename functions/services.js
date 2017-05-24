const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();


// --- PUT --- //
module.exports.post = (event, context, callback) => {

  var valid = ValidateInput(event);
  
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


// --- GET ALL --- //
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
        body: JSON.stringify(result.Items)
      }
    }
    callback(null, response);
  });
}


// --- GET INST--- //
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
  var found = false;
  const tempParams = {
    TableName: 'Services',
    Key: {
      id: parseInt(event.pathParameters.id)
    }
  }
  dynamoDb.get(tempParams, (error, result) => {
    if(result.Item != undefined){
      const params = {
        TableName: 'Services',
        Item: JSON.parse(event.body),
        }
      dynamoDb.put(params, (error, result) => {});
      response = {
        statusCode: 200,
        body: JSON.stringify({"message":"Service: " + event.pathParameters.id + " successfully replaced."})
      }
    }else if(error) {
      console.error(error);
      callback(new Error(error));
      return;
    }else{
      response = {
        statusCode: 404,
        body: JSON.stringify({"message": "Service " + event.pathParameters.id + " was not found."})
      }
    }
    callback(null, response);
  });
}


// --- PATCH --- ///
module.exports.patch = (event, context, callback) => {
  var found = false;
  const tempParams = {
    TableName: 'Services',
    Key: {
      id: parseInt(event.pathParameters.id)
    }
  }
  dynamoDb.get(tempParams, (error, result) => {

    var myUpdateExpression = "SET ";
    var myExpressionAttributeValues = {};
    var input = JSON.parse(event.body);
    var i = 0;
    console.log(Object.keys(input).length);
    for(var value in input){
      var EncodedValue = ":" + String.fromCharCode(97 + i);
      myUpdateExpression += value + "=" + EncodedValue + ", ";
      myExpressionAttributeValues[EncodedValue] = input[value];
      i ++;
    }
    myUpdateExpression = myUpdateExpression.slice(0, -2)

    console.log("UPDATE EXPRESSION: " + myUpdateExpression);
    console.log("EXPRESSION ATTRIBUTE VALUES:" + JSON.stringify(myExpressionAttributeValues));
    console.log(typeof(myExpressionAttributeValues));

    if(result.Item != undefined){
      const params = {
        TableName: 'Services',
        Key: {
          id: parseInt(event.pathParameters.id)
        },
        UpdateExpression: myUpdateExpression,
        ExpressionAttributeValues: myExpressionAttributeValues,
        ReturnValues:"UPDATED_NEW"
      }

      console.log("PARAMS: " + JSON.stringify(params));

      dynamoDb.update(params, (error, result) => {
        console.log("UPDATE ERROR: " + error);
        console.log("UPDATE RESULTS: " + result);
      });
/*      if(Error){
        response = {
          statusCode: 505,
          body: Error
        }*/
      response = {
        statusCode: 200,
        body: JSON.stringify({"message":"Service: " + event.pathParameters.id + " successfully replaced."})
      }
    }else if(error) {
      console.error(error);
      callback(new Error(error));
      return;
    }else{
      response = {
        statusCode: 404,
        body: JSON.stringify({"message": "Service " + event.pathParameters.id + " was not found."})
      }
    }
    callback(null, response);
  });
}

// --- DELETE --- //
module.exports.delete = (event, context, callback) => {
//Checking for existence ---
  var found = false;
  const tempParams = {
    TableName: 'Services',
    Key: {
      id: parseInt(event.pathParameters.id)
    }
  }
  dynamoDb.get(tempParams, (error, result) => {
    if(result.Item != undefined){found = true;}
  });
// --------------------------

  const params = {
    TableName: 'Services',
    Key: {
      id: parseInt(event.pathParameters.id)
    }
  }
  dynamoDb.delete(params, (error, result) => {
    if(error) {
      console.error(error);
      callback(new Error(error));
      return;
    }else if(!found){
      response = {
        statusCode: 404,
        body: JSON.stringify({"message": "Service " + event.pathParameters.id + " not found."})
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
