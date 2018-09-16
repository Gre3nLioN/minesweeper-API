'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (!data || !data.visibles || !data.gameTime || !data.flags) {
    console.error('Missin Failed');
    callback(null, {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
      body: 'Couldn\'t update the game item.',
    });
    return;
  }

  const params = {
    TableName: "Games",
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ':gameTime': data.gameTime,
      ':visibles': data.visibles,
      ':flags': data.flags,
      ':updatedAt': timestamp
    },
    UpdateExpression: 'SET gameTime = :gameTime, visibles = :visibles, flags = :flags, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the game in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Credentials" : true
        },
        body: 'Couldn\'t fetch the game item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
