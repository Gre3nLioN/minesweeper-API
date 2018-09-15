'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

function getBombs(x, y, bombsNumber) {
  let bombs = [];
  while(bombs.length < bombsNumber) {
    let position = getRandomPosition(x, y);
    if(!bombs.find(i => i == position)) {
      bombs.push(position);
    }    
  }

  return bombs;

}

function getRandomPosition(maxX, maxY){
  let x = Math.floor((Math.random() * maxX) + 0);
  let y = Math.floor((Math.random() * maxY) + 0);

  return [x, y];
}

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (!data || !data.x || !data.y || !data.bombs) {
    console.error('Missing field');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create a game.',
    });
    return;
  }

  const bombs = getBombs(data.x, data.y, data.bombs);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      user: data.user,
      flags: [],
      bombs: bombs,
      visibles: [],
      x: data.x,
      y: data.y,
      time: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the game to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the game item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};

