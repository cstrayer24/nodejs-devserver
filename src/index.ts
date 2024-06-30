#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "fs";
import { createServer } from "http";
function getPossiblePaths(rootpath: string) {
  //unhandled error is intentional the server should crash if an invalid directory is given as input
  const tempArr = readdirSync(rootpath);
  let resArr = [];
  const addDirPaths = (newPath: string) => {
    const basePath = `${rootpath}/${newPath}`;
    const ents = readdirSync(`${rootpath}/${newPath}`);
    ents.forEach((v) => {
      if (statSync(`${basePath}/${v}`).isDirectory()) {
        addDirPaths(`${newPath}/${v}`);
      } else {
        resArr.push(`${newPath}/${v}`);
      }
    });
  };
  tempArr.forEach((v) => {
    if (statSync(`${rootpath}/${v}`).isDirectory()) {
      addDirPaths(v);
    } else {
      resArr.push(v);
    }
  });
  return resArr;
}
const pathname2Route = (pathname: string) => {
  const strarr = pathname.split("");
  strarr.shift();
  return strarr.join("");
};

const args = process.argv.slice(2);
const port = parseInt(args[args.indexOf("-p") + 1]) || 3000;
const webDir = args[0];
const possiblePaths = getPossiblePaths(webDir);
const server = createServer((req, res) => {
  const realpathname = req.url.endsWith("/") ? `${req.url}index.html` : req.url;
  if (!possiblePaths.includes(pathname2Route(realpathname))) {
    res.writeHead(404, "not found");
    res.end();
    return;
  }
  if (req.headers["sec-fetch-dest"] === "script") {
    res.setHeader("Content-Type", "application/javascript");
  }
  res.writeHead(200, "success");
  res.write(readFileSync(`${webDir}/${pathname2Route(realpathname)}`));
  res.end();
});
console.log(`server running on http://localhost:${port}`);
server.listen(port);
