#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const http_1 = require("http");
function getPossiblePaths(rootpath) {
    //unhandled error is intentional the server should crash if an invalid directory is given as input
    const tempArr = (0, fs_1.readdirSync)(rootpath);
    let resArr = [];
    const addDirPaths = (newPath) => {
        const basePath = `${rootpath}/${newPath}`;
        const ents = (0, fs_1.readdirSync)(`${rootpath}/${newPath}`);
        ents.forEach((v) => {
            if ((0, fs_1.statSync)(`${basePath}/${v}`).isDirectory()) {
                addDirPaths(`${newPath}/${v}`);
            }
            else {
                resArr.push(`${newPath}/${v}`);
            }
        });
    };
    tempArr.forEach((v) => {
        if ((0, fs_1.statSync)(`${rootpath}/${v}`).isDirectory()) {
            addDirPaths(v);
        }
        else {
            resArr.push(v);
        }
    });
    return resArr;
}
const pathname2Route = (pathname) => {
    const strarr = pathname.split("");
    strarr.shift();
    return strarr.join("");
};
const args = process.argv.slice(2);
const port = parseInt(args[args.indexOf("-p") + 1]) || 3000;
const webDir = args[0];
const possiblePaths = getPossiblePaths(webDir);
const server = (0, http_1.createServer)((req, res) => {
    let realpathname = req.url.endsWith("/") ? `${req.url}index.html` : req.url;
    if (!possiblePaths.includes(pathname2Route(realpathname))) {
        res.writeHead(404, "not found");
        res.end();
        return;
    }
    res.writeHead(200, "success");
    res.write((0, fs_1.readFileSync)(`${webDir}/${pathname2Route(realpathname)}`));
    res.end();
});
console.log(`server running on http://localhost:${port}`);
server.listen(port);
