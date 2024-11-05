import {OnOffPlugInUnitDevice} from "@project-chip/matter.js/devices/OnOffPlugInUnitDevice";
import {OnOffServer} from "./custom-on-off-behavior.js";
import {CustomBehavior} from "./custom-behavior.js";
import {MatterDevice} from "./matter-device.js";

const SwitchDeviceType = OnOffPlugInUnitDevice.with(OnOffServer, CustomBehavior);

export class SwitchDevice extends MatterDevice<typeof SwitchDeviceType> {
    constructor(id: string) {
        super(SwitchDeviceType, {
            id,
            myCustom: {
                first: 1,
                second: "two",
                third: {
                    four: "four",
                    five: {
                        six: 6,
                        seven: "seven"
                    }
                },
                connection: {
                    callAction: () => {
                        console.log(id);
                    }
                }
            }
        });
    }
}
