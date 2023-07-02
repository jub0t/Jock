import { Export } from "../parser";
import GetType, { IsBasic } from "./types";

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

export function getAllClassChildren<T>(target_class: { prototype: T }): Export[] {
    const proto: any = target_class.prototype;
    const properties = Object.getOwnPropertyNames(target_class.prototype)

    let children = properties.map((prop) => {
        const value = proto[prop]
        const ctype = GetType(value);

        let child: Export = {
            Key: prop,
            Value: value,
            IsBasic: IsBasic(ctype),
            Children: [],
            Type: ctype
        };

        return child
    });

    return children
}
