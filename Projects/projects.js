const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Returns true iff the keys in input patch the valid keys in ValidKeys
function ValidatePOST(StrInput){
  var ReturnVal = true;
  var input  = JSON.parse(StrInput);
  var ValidKeys = ["id", "project_type", "image_path", "preview_path", "title", "header", "type", "description", "quote", "notes", "date", "client", "category", "relevant_paths"];
  //Check for unregistered keys
  for(var key in input){ReturnVal = (ReturnVal && ValidKeys.includes(key))}
  //Check all keys are defined
  ReturnVal = (ReturnVal && (Object.keys(input).length == ValidKeys.length));
  return(ReturnVal);
}

// Returns true iff the keys in input patch the valid keys in ValidKeys
function ValidatePUT(StrInput){
  var ReturnVal = true;
  var input  = JSON.parse(StrInput);
  var ValidKeys = ["id", "project_type", "image_path", "preview_path", "title", "header", "type", "description", "quote", "notes", "date", "client", "category", "relevant_paths"];
  //Check for unregistered keys
  for(var key in input){ReturnVal = (ReturnVal && ValidKeys.includes(key))}
  //Check all keys are defined
  ReturnVal = (ReturnVal && (Object.keys(input).length == ValidKeys.length));
  return(ReturnVal);
}

// Returns true iff the defined keys are contained in the ValidKeys list
function ValidatePATCH(StrInput){
  var ReturnVal = true;
  var input  = JSON.parse(StrInput);
  var ValidKeys = ["project_type", "image_path", "preview_path", "title", "header", "type", "description", "quote", "notes", "date", "client", "category", "relevant_paths"];
  //Check for unregistered keys
  for(var key in input){ReturnVal = (ReturnVal && ValidKeys.includes(key))}
  return(ReturnVal);
}


// --- PUT --- //
module.exports.post = (event, context, callback) => {
  // Validating input
  var valid = ValidatePOST(event.body);
  if(valid){
    // Checking for item existnce
    const tempParams = {TableName: 'Projects' ,Key: {id: parseInt(JSON.parse(event.body).id)}}
    dynamoDb.get(tempParams, (error, result) => {
      if(result.Item == undefined){
        // Posting the item into DB
        const params = {TableName: 'Projects', Item: JSON.parse(event.body)}
        dynamoDb.put(params, (error, result) => {
          console.log("ERROR: " + JSON.stringify(error));
          response = { // Success message sent
            statusCode: 201,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: JSON.stringify({"message":"Project was successfully created."})
          }
          callback(null, response);
        });
      }else{
        response = { // Already posted message sent
          statusCode: 400,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({"message":"Project " + JSON.parse(event.body).id + " already exists."})
        }
        callback(null, response);
      }
    });
  }else{
    response = { // Invalid input sent
      statusCode: 400,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: JSON.stringify({"message":"Invalid Input"})
    }
    callback(null, response);
  }
}


// --- GET ALL --- //
module.exports.list = (event, context, callback) => {
  //Getting all items in DB
  const params = {TableName: 'Projects'}
  dynamoDb.scan(params, (error, result) => {
    response = { // There is no try, only do
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: JSON.stringify(result.Items)
      }
    callback(null, response);
  });
}


// --- GET INST--- //
module.exports.get = (event, context, callback) => {
  // Getting the specified item
  const params = {TableName: 'Projects', Key: {id: parseInt(event.pathParameters.id)}}
  dynamoDb.get(params, (error, result) => {
    if(result.Item == undefined) {
      response = { // Not ofund message sent
        statusCode: 404,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: JSON.stringify({"message":"Could not find Project " + event.pathParameters.id + "."})
      }
      callback(null, response);
    }else{
      response = { // Success, so the instance is returned
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: JSON.stringify(result.Item)
      }
      callback(null, response);
    }
  });
}


// --- PUT --- //
module.exports.put = (event, context, callback) => {
  // Validating input
  var valid = ValidatePUT(event.body);
  if (valid) {
    // Checking for existence
    const tempParams = {TableName: 'Projects', Key: {id: parseInt(event.pathParameters.id)}}
    dynamoDb.get(tempParams, (error, result) => {
      if(result.Item != undefined){
        // Putting the item into the correct location in DB
        const params = {TableName: 'Projects', Item: JSON.parse(event.body)}
        dynamoDb.put(params, (error, result) => {});
        console.log("ERROR: " + JSON.stringify(error));
        response = { // Success message sent
          statusCode: 200,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({"message":"Project: " + event.pathParameters.id + " successfully replaced."})
        }
        callback(null, response)
      }else{
        response = { // Not found message sent
          statusCode: 404,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({"message": "Project " + event.pathParameters.id + " was not found."})
        }
        callback(null, response);
      }
    });
  }else{
    response = { // Invalid input message sent
      statusCode: 400,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: JSON.stringify({"message":"Invalid Input"})
    }
    callback(null, response);
  }
}


// --- PATCH --- ///
module.exports.patch = (event, context, callback) => {
  //Validating Input
  var valid = ValidatePATCH(event.body);
  if (valid){
    // CHecking for item existence
    const tempParams = {TableName: 'Projects', Key: {id: parseInt(event.pathParameters.id)}}
    dynamoDb.get(tempParams, (error, result) => {
      if(result.Item != undefined){
        //Manippulating input into usable form (params for update)
        var myUpdateExpression = "SET ";
        var myExpressionAttributeValues = {};
        var input = JSON.parse(event.body);
        var i = 0;
        for(var value in input){
          var EncodedValue = ":" + String.fromCharCode(97 + i);
          myUpdateExpression += value + "=" + EncodedValue + ", ";
          myExpressionAttributeValues[EncodedValue] = input[value];
          i ++;}
        myUpdateExpression = myUpdateExpression.slice(0, -2)
        const params = {TableName: 'Projects', Key: {id: parseInt(event.pathParameters.id)},
          UpdateExpression: myUpdateExpression,
          ExpressionAttributeValues: myExpressionAttributeValues,
          ReturnValues:"UPDATED_NEW"
        }
        // Updating the item in the DB
        dynamoDb.update(params, (error, result) => {});
        response = { // Success return message sent
          statusCode: 200,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({"message":"Project: " + event.pathParameters.id + " successfully patched."})
        }
        callback(null, response);
      }else{
        response = { // Not found return message sent
          statusCode: 404,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({"message": "Project " + event.pathParameters.id + " was not found."})
        }
        callback(null, response);
      }
    });
  }else{ // Invalid input message sent
    response = {
      statusCode: 400,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: JSON.stringify({"message":"Invalid Input"})
    }
    callback(null, response);
  }
}


// --- DELETE --- //
module.exports.delete = (event, context, callback) => {
  //Check for item existence
  const tempParams = {TableName: 'Projects', Key: {id: parseInt(event.pathParameters.id)}}
  dynamoDb.get(tempParams, (error, result) => {
    if(result.Item != undefined){
      // Deleting the item from the databse
      const params = {TableName: 'Projects', Key: {id: parseInt(event.pathParameters.id)}}
      dynamoDb.delete(params, (error, result) => {
        response = { // Success message sent
          statusCode: 200,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({"message": "Project: " + event.pathParameters.id + " successfully deleted."})
        }
        callback(null, response);
      });
    }else{
      response = { // Not found message sent
        statusCode: 404,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: JSON.stringify({"message": "Project " + event.pathParameters.id + " not found."})
      }
      callback(null, response);
    }
  });
}
