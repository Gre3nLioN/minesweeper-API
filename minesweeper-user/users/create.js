'use strict';

const bcrypt = require('bcrypt');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const saltRounds = 5;

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (!data || !data.name || !data.password) {
    console.error('Missing field');
    callback(null, {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
      body: 'Couldn\'t create a user. - filter',
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
        headers: {
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Credentials" : true
        },
        body: 'Couldn\'t fetch the user item.',
      });
      return;
    }
    if(result.length){

      if(bcrypt.compareSync(data.password, result.password)) {
        // login
        callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
          },
          body:result
        });
        return;
      } else {
          // invalid password
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: {
              "Access-Control-Allow-Origin" : "*",
              "Access-Control-Allow-Credentials" : true
            },
            body: 'Couldn\'t create the user item. - password',
          });
          return;
      }

    } else {
      // new user
      const password = bcrypt.hashSync(data.password, saltRounds);

      params = {
        TableName: "Users",
        Item: {
          name: data.name,
          password: password,
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
            headers: {
              "Access-Control-Allow-Origin" : "*",
              "Access-Control-Allow-Credentials" : true
            },
            body: 'Couldn\'t create the user item. -new',
          });
          return;
        }

        // create a response
        delete params.Item.password;
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
          },
          body: JSON.stringify(params.Item),
        };
        callback(null, response);
      });
    }


  });

};
