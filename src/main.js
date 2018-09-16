function MinesSweeperAPI () {
  this.gameAPI = "https://bjyw7641si.execute-api.us-east-1.amazonaws.com/dev/games";
  this.userAPI = "https://ob15x9qjrg.execute-api.us-east-1.amazonaws.com/dev/users";
}

MinesSweeperAPI.prototype.createGame = function(x, y, bombs, user) {
  return fetch(this.gameAPI, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          'x': x,
          'y': y,
          'bombs': bombs,
          'user': user
        })
    })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeperAPI.prototype.finishGame = function(id) {
  return fetch(this.gameAPI + '/' + id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeperAPI.prototype.updateGame = function(id, visibles, gameTime, flags) {
  return fetch(this.gameAPI + '/' + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          'visibles': visibles,
          'gameTime': gameTime,
          'flags': flags
        })
    })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeperAPI.prototype.getGame = function(id) {
  return fetch(this.gameAPI + '/' + id, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeperAPI.prototype.getUserGames = function(user) {
  return fetch(this.gameAPI + '/' + user, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      console.log(error);
    });
};

const API = new MinesSweeperAPI();
