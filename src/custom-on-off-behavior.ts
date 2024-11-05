import {OnOffServer as Base} from "@project-chip/matter.js/behaviors/on-off";
import {CustomBehavior} from "./custom-behavior.js";

export class OnOffServer extends Base {
    override async initialize() {
        super.initialize();
        const custom = await this.agent.load(CustomBehavior);
        this.state.onOff = custom.state.third.four === "four";
        custom.events.first$Changed.on((value, oldValue, context) => {
            console.log(`Changed value to ${value}, old value: ${oldValue}`);
            const c2 = context.agentFor(this.endpoint).get(CustomBehavior);
            console.log(`Full state is: ${JSON.stringify(c2.state, null, 2)}`);
            console.log(`Getter state is: ${c2.first}`);
            c2.state.connection.callAction();
        });
    }

    override async on() {
        await super.on();
    }

    override async off() {
        await super.off();
    }
}
