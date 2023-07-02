import GetType, { InstanceType, IsBasic } from "./types";
import { Export } from "../parser";

export function getAllClassChildren<T>(target_class: { prototype: T }, processed = new Set<any>()): Export[] {
    let children: Export[] = [];
    const proto: any = target_class.prototype;

    if (!proto) {
        return children;
    }

    const properties = [
        ...Object.getOwnPropertyNames(proto),
        ...Object.getOwnPropertyNames(target_class)
    ];

    properties.forEach((prop) => {
        const value = proto[prop];
        const ctype = GetType(value);
        const is_basic = IsBasic(ctype);

        console.log(prop, proto, value, ctype);

        let child: Export = {
            Key: prop,
            Type: ctype,
            Value: value,
            IsBasic: is_basic,
            Children: [],
        };

        if (child.Type === InstanceType.Class && !processed.has(value) && prop !== "constructor") {
            processed.add(value);
            child.Children = getAllClassChildren({ prototype: value }, processed);
        } else if (typeof value === "function" && prop !== "constructor") {
            child.Children = getAllClassChildren({ prototype: value }, processed);
        }

        children.push(child);
    });

    return children;
}
