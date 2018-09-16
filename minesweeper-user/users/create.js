'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const saltRounds = 5;

function getPassword(pass) {
  bcrypt.hash(pass, saltRounds).then(function(hash) {
    return hash;
  });
}
function getToken() {
  crypto.randomBytes(48, function(err, buffer) {
    return buffer.toString('hex');
  });
}

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (!data || !data.name || !data.password) {
    console.error('Missing field');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create a user.',
    });
    return;
  }
  let params = {
    TableName: "Users",
    Key:{
      "name": data.name
    }
  };
  dynamoDb.get(params, (error, result) => {
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
    if(result.length){

      if(bcrypt.compareSync(data.password, result.password)) {
        // login
        callback(null, {
          statusCode: 400,
          headers: { 'Content-Type': 'text/plain' },
          body: result,
        });
        return;
      } else {
          // invalid password
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the user item.',
          });
          return;
      }

    } else {
      // new user
      const password = getPassword(data.password);
      const token = getToken();

      params = {
        Item: {
          name: data.name,
          password: password,
          token: token,
          games: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      };

      // write the user to the database
      dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the user item.',
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
    }


  });

};
