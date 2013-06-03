function depth(n, board) {
  var storage = [],
  cap = (1<<n) - 1,
  solutions = 0,
  pick, possible, count = 0;

  storage.push(board);
  while (storage.length > 0) {
    board = storage.pop();
    if (board[1] === cap) {
      solutions++;
      continue;
    }

    possible = ~(board[0] | board[1] | board[2]) & cap;

    while (possible > 0) {
      pick = possible & -possible;
      possible ^= pick;
      storage.push([(board[0] | pick)<<1, (board[1] | pick), (board[2] | pick)>>>1]);
    }
  }
  return solutions;
};

function breadth(n, board) {
  var result = [],
  cap = (1<<n) - 1,
  possible = ~(board[0] | board[1] | board[2]) & cap,
  pick, board;

  while (possible) {
    pick = possible & -possible;
    possible ^= pick;
    result.push([(board[0] | pick)<<1, board[1] | pick, (board[2] | pick) >>> 1]);
  }
  return result;
};

function deepBreadth(n, board, levels) {
  var inBoards, outBoards = [board];

  for (var cycles = 0; cycles < levels; cycles++) {
    inBoards = outBoards;
    outBoards = [];
    inBoards.forEach(function(board) {
      outBoards = outBoards.concat(breadth(n, board));
    });
  }
  return outBoards;
};

onmessage = function(message) {
  switch (message.data.type) {
    case 'terminate':
      self.close();
      break;
    case 'dive':
      self.postMessage({
        type: 'solutions',
        package: {
          solutions: depth(26, message.data.board),
          board: message.data.board
        }
      });
      break;
    case 'breathe':
      self.postMessage({
        type: 'widened',
        package: {
          source: message.data.board,
          boards: deepBreadth(26, message.data.board, 4)
        }
      });
      break;
    default:
      throw new Error("Bad message from page");
      break;
  }
};