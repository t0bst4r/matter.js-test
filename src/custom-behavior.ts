import {Behavior} from "@project-chip/matter.js/behavior";

export class CustomBehavior extends Behavior {
    static override readonly id = "myCustom";
    declare state: CustomBehavior.State;
}

export namespace CustomBehavior {
    export class State {
        first!: number;
        second!: string;
        third!: { four: string, five: { six: number, seven: string } }
    }
}
