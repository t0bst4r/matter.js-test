import {Endpoint, EndpointType} from "@project-chip/matter.js/endpoint";
import crypto from "node:crypto";

export class MatterDevice<T extends EndpointType = EndpointType.Empty> extends Endpoint {
    constructor(type: T, options: Endpoint.Options<T>) {
        super(
            type, {
                id: crypto.randomUUID(),
                ...options
            }
        );
    }

    async update(state: Record<string, string>) {}
}
