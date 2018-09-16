function MinesSweeper () {
  this.API = API;
  this.user = {};
  this.games = [];
  this.activeGame = {};
}

MinesSweeper.prototype.createGame = function(x, y, bombs, user) {
  let m = this;
  this.API.createGame(x, y, bombs, user)
    .then(function(game) {
      m.games.push(game);
      m.activeGame = game;
      m.drawGame(x, y);
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeper.prototype.finishGame = function(id) {
  let m = this;
  this.API.finishGame(id)
    .then(function() {
      clearInterval();
      m.games = this.games.filter(function(game) {
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

MinesSweeper.prototype.getUserGames = function(name) {
  let m = this;
  this.API.getUserGames(name)
    .then(function(games) {
      // set game
      m.games = games;

      // layout
      m.drawGames(games);
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeper.prototype.createUser = function(name, password) {
  let m = this;
  this.API.createUser(name, password)
    .then(function(user) {
      m.user = user;
      document.querySelector('#login-wrapper').classList.add('hide');
      document.querySelector('#game-wrapper').classList.remove('hide');
      m.getUserGames(user.name);
    })
    .catch(function(error) {
      console.log(error);
    });
};

MinesSweeper.prototype.updateUser = function(name, games) {
  let m = this;
  this.API.updateUser(name, games)
    .then(function(user) {
      m.user = user;
    })
    .catch(function(error) {
      console.log(error);
    });
};

// Game Functions
//
MinesSweeper.prototype.drawGame = function(x, y) {
  const board = document.querySelector('#game-board');
  let m = this;
  let newCell = document.createElement('div');
      newCell.classList.add('cell');

  for (let b = 0; b < x; b++) {
    let newRow = document.createElement('div');
    newRow.classList.add('row');

    board.appendChild(newRow);

    for (let c = 0; c < y; c++) {
      let newCell = document.createElement('div');
      newCell.classList.add('cell');
      board.querySelectorAll('.row')[b].appendChild(newCell);
    }
  }
  document.querySelector('#game-board').classList.remove('hide');
  document.querySelector('#create-game-form').classList.add('hide');
  setInterval(function(){ m.updateClock();  }, 1000);
};

MinesSweeper.prototype.drawGames = function(games) {
  let gamesEl = document.querySelector('#games');
  gamesEl.innerHTML = "";
  gamesEl.appendChild(document.createElement('ul'));

  for (let i = 0; i < games.length; i++) { 
    let newGame = document.createElement('div');
    newGame.classList.add('game');
    newGame.classList.add('index-' + i );
    newGame.innerHTML = 'Time: ' + games[i].gameTime;
    gamesEl.querySelector('ul').appendChild(newGame);
  }
};

MinesSweeper.prototype.createFlag = function(x, y) {
  let flag = this.activeGame.flags.findIndex(flag => flag.position === [x, y]);

  if(!flag) {
    // new flag
    this.activeGame.flags.push({
      'type': 'mark',
      'position': [x, y]
    });
  } else {
    if( this.activeGame.flags[flag].type === 'mark' ) {
      this.activeGame.flags[flag].type = 'flag';
    } else {
      this.activeGame.flags[flag].type = 'mark';
    }

  }
};

MinesSweeper.prototype.updateClock = function() {
  this.activeGame.gameTime++;
  document.querySelector('#clock').innerHTML = this.activeGame.gameTime;
};

const minesSweeper = new MinesSweeper();

// DOM binding
document.querySelector('#login-form').addEventListener('submit', function(e){
  e.preventDefault();
  let name = document.querySelector('#login-form [name="name"]').value;
  let password = document.querySelector('#login-form [name="password"]').value;
  minesSweeper.createUser(name, password);
});

document.querySelector('#create-game-form').addEventListener('submit', function(e){
  e.preventDefault();
  let x = document.querySelector('#create-game-form [name="x"]').value;
  let y = document.querySelector('#create-game-form [name="y"]').value;
  let bombs = document.querySelector('#create-game-form [name="bombs"]').value;
  minesSweeper.createGame(x, y, bombs, minesSweeper.user.name);
});

document.querySelector('#save-game').addEventListener('click', function(e){
  e.preventDefault();
  minesSweeper.updateGame(minesSweeper.activeGame.id, minesSweeper.activeGame.visibles, minesSweeper.activeGame.gameTime, minesSweeper.activeGame.flags);

  // update board
  let gameIndex = minesSweeper.games.findIndex(game => game.id === minesSweeper.activeGame.id);
  minesSweeper.games[gameIndex].gameTime = minesSweeper.activeGame.gameTime;
  minesSweeper.drawGames(minesSweeper.games);
});

document.addEventListener('click',function(e){
  if(e.target && e.target.matches('.game')){
    const regex = /.*?index-(.*)/gm;
    if(minesSweeper.activeGame.length) {
      minesSweeper.updateGame(minesSweeper.activeGame.id, minesSweeper.activeGame.visibles, minesSweeper.activeGame.gameTime, minesSweeper.activeGame.flags);
    }
    minesSweeper.activeGame = minesSweeper.games[regex.exec(e.target.classList.value)[1]]
    minesSweeper.drawGame(minesSweeper.activeGame.x, minesSweeper.activeGame.y);
  }

})
