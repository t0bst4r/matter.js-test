import {Endpoint, EndpointType} from "@project-chip/matter.js/endpoint";
import crypto from "node:crypto";
import {CustomBehavior} from "./custom-behavior.js";
import {Behavior} from "@project-chip/matter.js/behavior";

export class MatterDevice<T extends EndpointType = EndpointType.Empty> extends Endpoint {
    constructor(type: T, options: Endpoint.Options<T>) {
        super(
            type, {
                id: crypto.randomUUID(),
                ...options
            }
        );
    }

    async update(state: Behavior.PatchStateOf<typeof CustomBehavior>) {
        await this.setStateOf(CustomBehavior, state);
    }
}
