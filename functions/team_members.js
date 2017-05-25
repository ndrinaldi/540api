const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Returns true iff the keys in input patch the valid keys in ValidKeys
function ValidatePOST(StrInput){
  var ReturnVal = true;
  var input  = JSON.parse(StrInput);
  var ValidKeys = ["id", "image_path", "name", "position", "member_path", "twitter_path", "facebook_path", "linkedin_path", "github_path", "expertise", "interests", "education", "qa", "fun_facts"];
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
  var ValidKeys = ["id", "image_path", "name", "position", "member_path", "twitter_path", "facebook_path", "linkedin_path", "github_path", "expertise", "interests", "education", "qa", "fun_facts"];
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
  var ValidKeys = [ "image_path", "name", "position", "member_path", "twitter_path", "facebook_path", "linkedin_path", "github_path", "expertise", "interests", "education", "qa", "fun_facts"];
  //Check for unregistered keys
  for(var key in input){ReturnVal = (ReturnVal && ValidKeys.includes(key))}
  return(ReturnVal);
}


// --- PUT --- //
module.exports.post = (event, context, callback) => {
  var response = {statusCode:10, body:JSON.stringify({"message":"No message was caught."}) }
  // Validating input
  var valid = ValidatePOST(event.body);
  if(valid){
    // Checking for item existnce
    const tempParams = {TableName: 'TeamMembers' ,Key: {id: parseInt(JSON.parse(event.body).id)}}
    dynamoDb.get(tempParams, (error, result) => {
      if(result.Item == undefined){
        // Posting the item into DB
        const params = {TableName: 'TeamMembers', Item: JSON.parse(event.body)}
        dynamoDb.put(params, (error, result) => {
          console.log("ERROR: " + JSON.stringify(error));
          response = { // Success message sent
            statusCode: 201,
            body: JSON.stringify({"message":"Team Member was successfully created."})
          }
          callback(null, response);
        });
      }else{
        response = { // Already posted message sent
          statusCode: 400,
          body: JSON.stringify({"message":"Team Member " + JSON.parse(event.body).id + " already exists."})
        }
        callback(null, response);
      }
    });
  }else{
    response = { // Invalid input sent
      statusCode: 400,
      body: JSON.stringify({"message":"Invalid Input"})
    }
    callback(null, response);
  }
}


// --- GET ALL --- //
module.exports.list = (event, context, callback) => {
  //Getting all items in DB
  const params = {TableName: 'TeamMembers'}
  dynamoDb.scan(params, (error, result) => {
    response = { // There is no try, only do
      statusCode: 200,
      body: JSON.stringify(result.Items)
      }
    callback(null, response);
  });
}


// --- GET INST--- //
module.exports.get = (event, context, callback) => {
  // Getting the specified item
  const params = {TableName: 'TeamMembers', Key: {id: parseInt(event.pathParameters.id)}}
  dynamoDb.get(params, (error, result) => {
    if(result.Item == undefined) {
      response = { // Not ofund message sent
        statusCode: 404,
        body: JSON.stringify({"message":"Could not find Team Member " + event.pathParameters.id + "."})
      }
      callback(null, response);
    }else{
      response = { // Success, so the instance is returned
        statusCode: 200,
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
    const tempParams = {TableName: 'TeamMembers', Key: {id: parseInt(event.pathParameters.id)}}
    dynamoDb.get(tempParams, (error, result) => {
      if(result.Item != undefined){
        // Putting the item into the correct location in DB
        const params = {TableName: 'TeamMembers', Item: JSON.parse(event.body)}
        dynamoDb.put(params, (error, result) => {});
        console.log("ERROR: " + JSON.stringify(error));
        response = { // Success message sent
          statusCode: 200,
          body: JSON.stringify({"message":"Team Member: " + event.pathParameters.id + " successfully replaced."})
        }
        callback(null, response)
      }else{
        response = { // Not found message sent
          statusCode: 404,
          body: JSON.stringify({"message": "Team Member " + event.pathParameters.id + " was not found."})
        }
        callback(null, response);
      }
    });
  }else{
    response = { // Invalid input message sent
      statusCode: 400,
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
    const tempParams = {TableName: 'TeamMembers', Key: {id: parseInt(event.pathParameters.id)}}
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
        const params = {TableName: ' s', Key: {id: parseInt(event.pathParameters.id)},
          UpdateExpression: myUpdateExpression,
          ExpressionAttributeValues: myExpressionAttributeValues,
          ReturnValues:"UPDATED_NEW"
        }
        // Updating the item in the DB
        dynamoDb.update(params, (error, result) => {});
        response = { // Success return message sent
          statusCode: 200,
          body: JSON.stringify({"message":"Team Member: " + event.pathParameters.id + " successfully patched."})
        }
        callback(null, response);
      }else{
        response = { // Not found return message sent
          statusCode: 404,
          body: JSON.stringify({"message": "Team Member " + event.pathParameters.id + " was not found."})
        }
        callback(null, response);
      }
    });
  }else{ // Invalid input message sent
    response = {
      statusCode: 400,
      body: JSON.stringify({"message":"Invalid Input"})
    }
    callback(null, response);
  }
}


// --- DELETE --- //
module.exports.delete = (event, context, callback) => {
  //Check for item existence
  const tempParams = {TableName: 'TeamMembers', Key: {id: parseInt(event.pathParameters.id)}}
  dynamoDb.get(tempParams, (error, result) => {
    if(result.Item != undefined){
      // Deleting the item from the databse
      const params = {TableName: 'TeamMembers', Key: {id: parseInt(event.pathParameters.id)}}
      dynamoDb.delete(params, (error, result) => {
        response = { // Success message sent
          statusCode: 200,
          body: JSON.stringify({"message": "Team Member: " + event.pathParameters.id + " successfully deleted."})
        }
        callback(null, response);
      });
    }else{
      response = { // Not found message sent
        statusCode: 404,
        body: JSON.stringify({"message": "Team Member " + event.pathParameters.id + " not found."})
      }
      callback(null, response);
    }
  });
}
