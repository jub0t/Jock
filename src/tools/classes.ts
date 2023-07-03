import GetType, { InstanceType, IsBasic, isClass } from "./types";
import { Export } from "../parser";

export function getAllClassChildren<T extends { new(...args: any[]): any }>(target_class: T): Export[] {
    let children: Export[] = [];
    const proto = target_class.prototype;

    if (!proto) {
        return children;
    }

    const methods = Object.getOwnPropertyDescriptors(proto)
    const classes = getInnerClasses(target_class)

    // Process Children
    Object.keys(methods).forEach((name: any) => {
        const method = methods[name]
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

    classes.forEach(innerClass => {
        let classChildren = getAllClassChildren(innerClass)
        children.push({
            Key: innerClass.name,
            Value: innerClass,
            IsBasic: false,
            Type: InstanceType.Class,
            Children: classChildren,
        } as Export)
    });

    return children;
}

export function removeDefaults(target_class: string[]) {
    return target_class.filter(i => {
        return !["length", "name", "prototype"].includes(i)
    })
}

export function getInnerClasses<T>(parent_class: T) {
    return removeDefaults(Object.getOwnPropertyNames(parent_class)).map((name) => {
        return (parent_class as any)[name]
    })
}
