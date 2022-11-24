const express = require("express");
const app = express();
const port = 3000;
var cron = require("node-cron");
const mongoose = require("mongoose");
var ping = require("ping");
mongoose
  .connect("mongodb+srv://kevin:2wsx1qaz@cluster0.ko78p2k.mongodb.net/GG")
  .then(() => console.log("Connect Mongo Success..."));

const ipSchema = new mongoose.Schema({ ip: String, status: String });
const IpList = mongoose.model("ip_address", ipSchema);

let data = [];
async function cronIp() {
  console.log("cron running...");
  let allHost = await IpList.find();

  for (let host of allHost) {
    let res = await ping.promise.probe(host.ip, { timeout: 6 });
    console.log({ ip: host.ip, status: res.alive ? "Alive" : "is Dead" });
    await IpList.findOneAndUpdate(
      { ip: host.ip },
      { status: res.alive ? "Alive" : "is Dead" },
      { upsert: true }
    );
  }
}

cron.schedule("*/30 * * * * *", () => {
  cronIp();
  console.log("running a task every 30 seconds");
});

cronIp();

app.get("/", async (req, res) => {
  let resp = await IpList.find();

  let result = resp.map((item) => ({
    ip: item.ip,
    status: item.status,
  }));

  res.json({
    total_dead: result.filter((item) => item.status === "is Dead").length,
    total_alive: result.filter((item) => item.status === "Alive").length,
    result: result,
  });
});

app.get("/dead", async (req, res) => {
  let resp = await IpList.find();

  let result = resp.map((item) => ({
    ip: item.ip,
    status: item.status,
  }));
  res.json({
    total_dead: result.filter((item) => item.status === "is Dead").length,
    result: result.filter((item) => item.status === "is Dead"),
  });
});

app.get("/alive", async (req, res) => {
  let resp = await IpList.find();

  let result = resp.map((item) => ({
    ip: item.ip,
    status: item.status,
  }));

  res.json({
    total_alive: result.filter((item) => item.status === "Alive").length,
    result: result.filter((item) => item.status === "Alive"),
  });
});

app.listen(port, () => {
  console.log(`Check IP App listening on port ${port}`);
});
