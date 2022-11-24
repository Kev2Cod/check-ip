const express = require("express");
const app = express();
const port = 3000;
var ping = require("ping");

app.get("/", async (req, res) => {
  let allHost = [
    "10.10.65.1",
    "10.10.65.2",
    "10.10.65.3",
    "10.10.65.4",
    "10.10.65.5",
    "10.207.26.20",
    "10.207.26.21",
    "10.207.26.22",
    "10.207.26.23",
    "10.207.26.24",
    "10.207.26.25",
  ];
  let data = [];
  for (let host of allHost) {
    let res = await ping.promise.probe(host, { timeout: 10 });
    console.log(res);
    data.push({ ip: host, status: res.alive ? "Alive" : "is Dead" });
  }
  res.json({
    total_dead: data.filter((item) => item.status === "is Dead").length,
    total_alive: data.filter((item) => item.status === "Alive").length,
    result: data,
  });
});

app.get("/dead", async (req, res) => {
  let allHost = [
    "10.10.65.1",
    "10.10.65.2",
    "10.10.65.3",
    "10.10.65.4",
    "10.10.65.5",
    "10.207.26.20",
    "10.207.26.21",
    "10.207.26.22",
    "10.207.26.23",
    "10.207.26.24",
    "10.207.26.25",
  ];

  let data = [];
  for (let host of allHost) {
    let res = await ping.promise.probe(host, { timeout: 10 });
    console.log(res);
    data.push({ ip: host, status: res.alive ? "Alive" : "is Dead" });
  }
  res.json({
    total_dead: data.filter((item) => item.status === "is Dead").length,
    result: data.filter((item) => item.status === "is Dead"),
  });
});

app.get("/alive", async (req, res) => {
  let allHost = [
    "10.10.65.1",
    "10.10.65.2",
    "10.10.65.3",
    "10.10.65.4",
    "10.10.65.5",
    "10.207.26.20",
    "10.207.26.21",
    "10.207.26.22",
    "10.207.26.23",
    "10.207.26.24",
    "10.207.26.25",
  ];
  let data = [];
  for (let host of allHost) {
    let res = await ping.promise.probe(host, { timeout: 10 });
    console.log(res);
    data.push({ ip: host, status: res.alive ? "Alive" : "is Dead" });
  }
  res.json({
    total_alive: data.filter((item) => item.status === "Alive").length,
    result: data.filter((item) => item.status === "Alive"),
  });
});

app.listen(port, () => {
  console.log(`Check IP App listening on port ${port}`);
});
