
// const protocol = "http";
// const host = "192.168.29.157:5051/api/v1";

const protocol = "https";
const host = "api.did.rejoicehub.com/api/v1";
// const protocol = "https";
// const host = "6b1d-2405-201-200d-11ff-65f1-a1a0-8c0b-a949.in.ngrok.io/api/v1";
// const host = "api.blockcreator.rejoicehub.com/api/v1";


const port = "";
const trailUrl = "";

const hostUrl = `${protocol}://${host}${port ? ":" + port : ""}`;
const endpoint = `${protocol}://${host}${port ? ":" + port : ""}${trailUrl}`;

export default {
  protocol: protocol,
  host: host,
  port: port,
  apiUrl: trailUrl,
  endpoint: endpoint,
  hostUrl: hostUrl,
};
