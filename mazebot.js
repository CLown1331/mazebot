const fetch = require('node-fetch');

const url = 'https://api.noopschallenge.com';

fetch(url + '/mazebot/race/start', {
    method: 'POST', 
    body: JSON.stringify({login: 'CLown1331'}),
    headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(body => body.nextMaze)
.then(nextMaze => solve(nextMaze));

function mazesolve(map, sx, sy, px, py) {
    let vis = [];
    let stack = [];
    let par = [];
    for (let i = 0; i < map.length; i++) {
        let ar = [];
        let pr = [];
        for (let j = 0; j < map[i].length; j++) {
            ar.push(0);
            pr.push({x: -1, y: -1});
        }
        vis.push(ar);
        par.push(pr);
    }
    stack.push(sy);
    stack.push(sx);
    while (stack.length > 0) {
        let x = stack.pop();
        let y = stack.pop();
        if (x + 1 < map.length && !vis[x + 1][y] && map[x + 1][y] != 'X') {
            vis[x + 1][y] = 1;
            stack.push(y);
            stack.push(x + 1);
            par[x + 1][y]  = {x: x, y: y};
        }
        if (y + 1 < map[x].length && !vis[x][y + 1] && map[x][y + 1] != 'X') {
            vis[x][y + 1] = 1;
            stack.push(y + 1);
            stack.push(x);
            par[x][y + 1]  = {x: x, y: y};
        }
        if (x - 1 > -1 && !vis[x - 1][y] && map[x - 1][y] != 'X') {
            vis[x - 1][y] = 1;
            stack.push(y);
            stack.push(x - 1);
            par[x - 1][y]  = {x: x, y: y};
        }
        if (y - 1 > -1 && !vis[x][y - 1] && map[x][y - 1] != 'X') {
            vis[x][y - 1] = 1;
            stack.push(y - 1);
            stack.push(x);
            par[x][y - 1]  = {x: x, y: y};
        }
    }
    let ans = '';
    while (px != sx || py != sy) {
        let h = par[px][py];
        // console.table([{x: px, y: py}, h]);
        if (px < h.x) {
            ans += 'N';
        }
        if (px > h.x) {
            ans += 'S';
        }
        if (py < h.y) {
            ans += 'W';
        }
        if (py > h.y) {
            ans += 'E';
        }
        px = h.x;
        py = h.y;
    }
    // console.log(px, py);
    // console.log(sx, sy);
    // console.log(ans);
    // console.log(ans.split('').reverse().join(''));
    return ans.split('').reverse().join('');
}

function solve(nextMaze) {
    fetch(url + nextMaze)
    .then(res => res.json())
    .then(body => {
        // console.log(body);
        var payload = {
            directions: mazesolve(body.map, body.startingPosition[1], body.startingPosition[0], body.endingPosition[1], body.endingPosition[0])
        };
        fetch(url + nextMaze, {
            method: 'POST', 
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(body => {
            console.log(body.result);
            if (body.result == 'success') {
                solve(body.nextMaze);
            } else if (body.result == 'incorrect') {
                throw "fail";
            }
        });
    });
}