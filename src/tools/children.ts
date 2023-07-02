import { Export } from "../parser";
import GetType, { InstanceType, IsBasic, isClass } from "./types";

export function getFunctionChildren(func: Function) {
    const children = [];
    const properties = Object.getOwnPropertyNames(func);

    for (const property of properties) {
        const descriptor = Object.getOwnPropertyDescriptor(func, property);
        if (typeof descriptor?.value === 'function') {
            children.push(descriptor.value);
        }
    }

    return children;
}
