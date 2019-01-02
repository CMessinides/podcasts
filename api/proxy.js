const https = require("https");
const url = require("url");

/**
 * @param {http.ClientRequest} clientReq
 * @param {http.ServerResponse} clientRes
 */
function handler(clientReq, clientRes) {
  console.log("serve: " + clientReq.url);
  const { search } = url.parse(clientReq.url);
  // discard everything before the first "url=" and join the rest

  let targetURL;
  let target;
  try {
    targetURL = search
      .split("url=")
      .slice(1)
      .join("");
    target = new URL(targetURL);
  } catch (e) {
    let errMsg;
    clientRes.setHeader("Content-Type", "text/plain");
    if (e instanceof TypeError) {
      clientRes.writeHead(400);
      errMsg = `Could not proxy ${targetURL}: Not a valid URL.`;
    } else {
      clientRes.writeHead(500);
      errMsg = "Encountered server error.";
    }
    console.error(errMsg);
    console.error(e);
    clientRes.end(errMsg);
    return;
  }

  console.log("target: " + target);

  var proxy = https.get(target, function(res) {
    clientRes.writeHead(res.statusCode, res.headers);
    res.pipe(
      clientRes,
      {
        end: true
      }
    );
  });

  clientReq.pipe(
    proxy,
    {
      end: true
    }
  );
}

module.exports = handler;
