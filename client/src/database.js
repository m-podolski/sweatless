import Dexie from "dexie";

const db = new Dexie("sweatless");
db.version(1).stores({
  logs: "key,date,training",
  settings: "key",
});

export default db;
