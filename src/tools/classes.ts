import GetType, { InstanceType, IsBasic, isClass } from "./types";
import { Export } from "../parser";

export function getAllClassChildren<T extends { new(...args: any[]): any }>(target_class: T): Export[] {
    let children: Export[] = [];
    const proto: any = target_class.prototype;

    if (!proto) {
        return children;
    }

    const descriptors = Object.getOwnPropertyDescriptors(proto)

    // Process Children
    Object.keys(descriptors).forEach((name: any) => {
        const method = descriptors[name]
        const value = method.value
        const ctype: InstanceType = GetType(value);
        const is_basic: boolean = IsBasic(ctype);

        let child: Export = {
            Key: name,
            Type: ctype,
            Value: value,
            IsBasic: is_basic,
            Children: children,
        };

        children.push(child)
    });

    return children;
}

export function removeDefaults(target_class: string[]) {
    return target_class.filter(i => {
        return !["length", "name", "prototype"].includes(i)
    })
}
