const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://kevin:2wsx1qaz@cluster0.ko78p2k.mongodb.net/GG")
  .then(() => console.log("Connect Mongo Success..."));

const ipSchema = new mongoose.Schema({ ip: String, status: String });
const IpList = mongoose.model("ip_address", ipSchema);
var ping = require("ping");
let data = [];

async function cronIp() {
  console.log("cron running...");
  let allHost = await IpList.find();
  for (let host of allHost) {
    let res = await ping.promise.probe(host.ip, { timeout: 10 });
    data.push({ ip: host.ip, status: res.alive ? "Alive" : "is Dead" });
  }
  data.map((item) => {
    IpList.findOneAndUpdate(
      { ip: item.ip },
      { status: item.status ? "Alive" : "is Dead" }
    );
  });
}

async function statusHosts() {
  let allIp = await IpList.find();
  return allIp;
}

module.exports = { statusHosts, cronIp };
