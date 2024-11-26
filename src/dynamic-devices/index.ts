import "@matter/nodejs";
import {Behavior} from "@matter/main";
import {Endpoint, ServerNode} from "@matter/node";
import {AggregatorEndpoint} from "@matter/node/endpoints";
import {OnOffPlugInUnitDevice} from "@matter/main/devices/on-off-plug-in-unit";

import {sleep} from "../utils/sleep.js";
import {simpleServerProps} from "../utils/simple-server-props.js";

class DynamicDeviceBehavior extends Behavior {
    static override id = "dynamicDeviceBehavior";
    static override early = true;

    override async initialize() {
        console.log("initializing dynamic device");
        this.reactTo(this.endpoint.lifecycle.ready, this.manageDevices);
    }

    private async manageDevices() {
        console.log("Manage Devices");
        const deviceId = "MyPlugInUnit";
        let device = this.endpoint.parts.find(e => e.id === deviceId);
        if (!device) {
            device = new Endpoint(OnOffPlugInUnitDevice, {id: deviceId});
            await this.endpoint.add(device);
        }
    }
}

const server = await ServerNode.create(simpleServerProps("dynamic-devices-test"));
const aggregator = new Endpoint(AggregatorEndpoint.with(DynamicDeviceBehavior), {id: "aggregator"});
await server.add(aggregator);

await new Promise<void>(async resolve => {
    while (aggregator.parts.size === 0) {
        console.log("No parts available");
        await sleep(1000);
    }
    resolve();
});

await server.run();
