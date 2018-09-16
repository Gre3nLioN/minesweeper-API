'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (!data || !event.pathParameters.token || !data.games) {
    console.error('Missin Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the user item.',
    });
    return;
  }

  const params = {
    TableName: "Users",
    Key: {
      token: event.pathParameters.token,
    },
    ExpressionAttributeValues: {
      ':games': data.games,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET game = :game, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the user in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the user item.',
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
