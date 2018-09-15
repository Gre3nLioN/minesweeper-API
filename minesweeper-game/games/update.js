'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (!data || data.visibles || !data.time || !data.flags) {
    console.error('Missin Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
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
      ':time': data.time,
      ':visibles': data.visibles,
      ':flags': data.flags,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET time = :time, visibles = :visibles, flags = :flags, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the game in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the game item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
