import {Node, ServerNode} from "@matter/node";
import {AggregatorEndpoint} from "@matter/node/endpoints";
import {VendorId} from "@matter/main/types";
import crypto from "node:crypto";

export const simpleServerProps: (id: string) => Node.Configuration<ServerNode.RootEndpoint> = (id) => ({
    id: id,
    type: ServerNode.RootEndpoint,
    network: {
        port: 5540
    },
    productDescription: {
        name: id,
        deviceType: AggregatorEndpoint.deviceType
    },
    basicInformation: {
        uniqueId: id,
        nodeLabel: id,
        vendorId: VendorId(0xfff1),
        vendorName: "vendorName",
        productId: 0x8000,
        productName: "productName",
        productLabel: "productLabel",
        serialNumber: crypto
            .createHash("md5")
            .update(`serial-${id}`)
            .digest("hex")
            .substring(0, 32),
        hardwareVersion: 2024,
        softwareVersion: 2024,
    }
});