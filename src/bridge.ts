import {ServerNode} from "@project-chip/matter.js/node";
import {AggregatorEndpoint} from "@project-chip/matter.js/endpoints/AggregatorEndpoint";
import {Environment} from "@project-chip/matter.js/environment";
import {MatterDevice} from "./matter-device.js";
import {Endpoint} from "@project-chip/matter.js/endpoint";
import {SwitchDevice} from "./switch-device.js";
import crypto from "node:crypto";
import {VendorId} from "@project-chip/matter.js/datatype";

export interface BridgeProps {
    readonly environment: Environment;
    readonly id: string;
    readonly name: string;
    readonly port: number;
}

export class Bridge {
    private server?: ServerNode;

    private matterDevices: Record<string, MatterDevice | undefined> = {};

    constructor(private readonly props: BridgeProps) {
    }

    async start() {
        await this.close();

        const server = await ServerNode.create({
            type: ServerNode.RootEndpoint,
            environment: this.props.environment,
            id: this.props.id,
            network: {
                port: this.props.port,
            },
            productDescription: {
                name: this.props.name,
                deviceType: AggregatorEndpoint.deviceType,
            },
            basicInformation: {
                uniqueId: this.props.id,
                nodeLabel: this.props.name,
                vendorId: VendorId(0xfff1),
                vendorName: "t0bst4r",
                productId: 0x8000,
                productName: "MatterHub",
                productLabel: "Home Assistant Matter Hub",
                hardwareVersion: 2024,
                softwareVersion: 2024,
                serialNumber: crypto
                    .createHash("md5")
                    .update(`serial-${this.props.id}`)
                    .digest("hex")
                    .substring(0, 32),
            }
        });
        const aggregator = new Endpoint(AggregatorEndpoint, {id: "aggregator"});
        await server.add(aggregator);
        await server.start();
        this.server = server;

        await this.createDevices(aggregator);
    }

    private async createDevices(aggregator: Endpoint) {
        for (const item of [1, 2, 3, 4]) {
            const id = `device_${item}`;
            const device = new SwitchDevice(id);
            await aggregator.add(device);
            this.matterDevices[id] = device;
        }
    }

    async updateDevices(states: Record<string, Record<string, string>>) {
        const entities = Object.values(states);
        for (const entity of entities) {
            const device = this.matterDevices[entity["entity_id"]];
            await device?.update(entity);
        }
    }

    public async close() {
        if (this.server) {
            this.server.lifecycle.resetting();
            await this.server.close();
            this.server = undefined;
        }
        this.matterDevices = {};
    }
}
