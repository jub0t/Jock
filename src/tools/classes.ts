import GetType, { InstanceType, IsBasic, isClass } from "./types";
import { Export } from "../parser";

export function getAllClassChildren<T extends { new(...args: any[]): any }>(target_class: T): Export[] {
    let children: Export[] = [];
    const proto: any = target_class.prototype;

    if (!proto) {
        return children;
    }

    const properties: string[] = removeDefaults([
        ...Object.getOwnPropertyNames(proto),
        ...Object.getOwnPropertyNames(target_class)
    ]);

    // Process Children
    properties.forEach((prop: string) => {
        const value: any = proto[prop]
        const ctype: InstanceType = GetType(value);
        const is_basic: boolean = IsBasic(ctype);

        let child: Export = {
            Key: prop,
            Type: ctype,
            Value: value,
            IsBasic: is_basic,
            Children: [],
        };

        console.log(`${child.Key}, ${target_class}`)
    });

    return children;
}

export function removeDefaults(target_class: string[]) {
    return target_class.filter(i => {
        return !["length", "name", "constructor", "prototype"].includes(i)
    })
}
