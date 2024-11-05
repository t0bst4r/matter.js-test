import "@project-chip/matter-node.js";

import {Environment, MdnsService, StorageService} from "@project-chip/matter.js/environment";

import {Bridge} from "./bridge.js";
import path from "node:path";
import {StorageBackendJsonFile} from "@project-chip/matter-node.js/storage";
import fs from "node:fs";

const environment = Environment.default;

environment.set(
    MdnsService,
    new MdnsService(environment, {
        ipv4: true,
        networkInterface: undefined,
    }),
);

const location = path.join(process.cwd(), ".storage");
fs.mkdirSync(location, {recursive: true});

const storageService = environment.get(StorageService);
storageService.location = location;
storageService.factory = ns => new StorageBackendJsonFile(path.resolve(location, ns + ".json"));

const bridge = new Bridge({
    environment: environment,
    id: "bridge1",
    name: "Bridge 1",
    port: 5540
});

await bridge.start();

let i = 2;
setInterval(async () => {
    await bridge.updateDevices({
        device_1: {
            first: i++
        }
    })
}, 2000);