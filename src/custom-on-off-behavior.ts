import { OnOffServer as Base } from "@project-chip/matter.js/behaviors/on-off";
import { CustomBehavior } from "./custom-behavior.js";

export class OnOffServer extends Base {
    override async initialize() {
        super.initialize();
        const custom = await this.agent.load(CustomBehavior);
        this.state.onOff = custom.state.third.four === "four";
        custom.events.third$Changed.on((value, oldValue) => {
            console.log(`Changed value to ${value}, old value: ${oldValue}`)
        });
    }

    override async on() {
        await super.on();
    }

    override async off() {
        await super.off();
    }
}
