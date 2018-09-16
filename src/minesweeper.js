function MinesSweeper () {
  this.API = API;
  this.user = {};
  this.games = [];
  this.activeGame = {};
}

MinesSweeper.prototype.createGame = function(x, y, bombs, user) {
  this.API.createGame(x, y, bombs, user)
    .then(function(game) {
      this.games.push(game);
      this.activeGame = game;
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeper.prototype.finishGame = function(id) {
  this.API.finishGame(id)
    .then(function() {
      this.games = this.games.filter(function(game) {
          return game.id !== id;
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeper.prototype.updateGame = function(id, visibles, gameTime, flags) {
  this.API.updateGame(id, visibles, gameTime, flags)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeper.prototype.getUserGames = function(user) {
  this.API.getUserGames(user)
    .then(function(games) {
      this.games = games;
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeper.prototype.createUser = function(name, password) {
  this.API.createUser(name, password)
    .then(function(user) {
      this.user = user;
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeper.prototype.updateUser = function(name, games) {
  this.API.updateUser(name, games)
    .then(function(user) {
      this.user = user;
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeper.prototype.createFlag = function(x, y) {
  let flag = this.activeGame.flags.findIndex(flag => flag.position === [x, y]);

  if(!flag) {
    // new flag
    this.activeGame.flags.push({
      'type': 'mark',
      'position': [x, y];
    });
  } else {

  }
};

const MinesSweeper = new MinesSweeper();
