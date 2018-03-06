const http = require('http');
const url = require('url');
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);


let clientID = 0;
let clients = {};



http.createServer(async (req, res) => {
  const purl=url.parse(req.url,true);
  if(purl.pathname ==='/') {
    try {
      let data = await readFileAsync('./index.html');
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    } catch(err) {
        console.log(err);
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('<p>Internal Server Error</p>');
    }
  } else if (purl.pathname === '/sse/') {
    req.socket.setTimeout(Number.MAX_SAFE_INTEGER);
    res.writeHead(200, {
    	'Content-Type': 'text/event-stream',
    	'Cache-Control': 'no-cache',
    	'Connection': 'keep-alive'
    });
    res.write('\n');
    (clientID => {
        clients[clientID] = res;
        req.on("close", () => {delete clients[clientID]});
    })(++clientID)
  }
}).listen(8080, '127.0.0.1');


setInterval(() => {
 	for (let clientID in clients) {
     	clients[clientID].write("data: "+ "Server Timestamp " + new Date() + "\n\n");
	};
}, 1000);


































