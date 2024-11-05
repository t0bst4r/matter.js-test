import {ActionContext, Behavior} from "@project-chip/matter.js/behavior";
import {AsyncObservable, EventEmitter} from "@project-chip/matter.js/util";

export class CustomBehavior extends Behavior {
    static override readonly id = "myCustom";
    declare state: CustomBehavior.State;
    declare events: CustomBehavior.Events;

    get first(): number {
        return this.state.first;
    }
}

export namespace CustomBehavior {
    export class State {
        first!: number;
        second!: string;
        third!: { four: string, five: { six: number, seven: string } };
        connection!: { callAction: () => void };
    }

    export class Events extends EventEmitter {
        first$Changed = AsyncObservable<[value: number, oldValue: number, context: ActionContext]>();
    }
}
