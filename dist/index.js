#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const http_1 = require("http");
function isInIgnoreList(route) {
    const ignoreList = [".git", ".DS_Store"];
    const routeTokens = route.split("/");
    return routeTokens.find((v) => ignoreList.includes(v));
}
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
            addDirPaths(`/${v}`);
        }
        else {
            resArr.push(`/${v}`);
        }
    });
    return resArr;
}
const args = process.argv.slice(2);
const port = parseInt(args[args.indexOf("-p") + 1]) || 3000;
const webDir = args[0];
const possiblePaths = getPossiblePaths(webDir);
const server = (0, http_1.createServer)((req, res) => {
    const realpathname = req.url.endsWith("/") ? `${req.url}index.html` : req.url;
    if (isInIgnoreList(realpathname)) {
        console.log("is in ignore list");
        res.writeHead(404, "not found");
        res.end();
        return;
    }
    if (!possiblePaths.includes(realpathname)) {
        res.writeHead(404, "not found");
        res.end();
        return;
    }
    if (req.headers["sec-fetch-dest"] === "script") {
        res.setHeader("Content-Type", "application/javascript");
    }
    res.writeHead(200, "success");
    res.write((0, fs_1.readFileSync)(`${webDir}${realpathname}`));
    res.end();
});
console.log(`server running on http://localhost:${port}`);
server.listen(port);
