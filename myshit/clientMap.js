var localsols = 0,
    storage = [],
    old_n, n, serverPingBack, cap, old_sols;

var mapFunc = function(d) {
  var result = 0;
  var pick;
  for (possible = ~(d[0] | d[1] | d[2]) & cap; possible > 0; possible^=pick) {
    pick = -possible & possible;
    if (d[3] < n) {
      storage.push([(d[0] | pick)<<1, (d[1] | pick), (d[2] | pick)>>>1, d[3] + 1]);
    } else {
      result++;
    }
  }
  return result;
};

var widenFunc = function(b) {
  var result = [],
      finalDepth = b[3] + 2,
      pick, branch;
  result.push(b);
  while (result[0] && (result[0][3] <= finalDepth)) {
    branch = result.shift();
    for (possible = ~(branch[0] | branch[1] | branch[2]) & cap; possible > 0; possible^=pick) {
      pick = -possible & possible;
      result.push([(branch[0] | pick)<<1, (branch[1] | pick), (branch[2] | pick)>>>1, branch[3] + 1]);
    }
  }
  return result;
};

var solve = function(map) {
  storage.push(map);
  var instanceSols = 0;
  while (storage.length) {
    instanceSols += mapFunc(storage.pop());
  }
  //was mapResult
  localsols += instanceSols;
  self.postMessage({
    'type': 'solutions',
    'data': instanceSols
  });
};

onmessage = function(message) {
  switch (message.data.type) {
    case 'terminate':
      self.close();
      break;
    case 'map':
      solve(message.data.data);
      break;
    case 'open':
      var mainRes = [];
      message.data.data.forEach(function(branch) {
        mainRes = mainRes.concat(widenFunc(branch));
      });
      self.postMessage({
        type: 'widened',
        data: mainRes
      });
      break;
    case 'init':
      n = message.data.data;
      cap = (1<<n) - 1;
      localsols = 0;
      self.postMessage({
        'type': 'initialized'
      });
      break;
  }
};