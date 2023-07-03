import GetType, { InstanceType, IsBasic } from "./types";
import { Export, LocalParser } from "../parser";

export function getClassConstructor(Class: any) {
    return Class.prototype.constructor;
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

export function getAllClassChildren<T extends { new(...args: any[]): any }>(target_class: T): Export[] {
    let children: Export[] = [];
    const proto = target_class.prototype;

    if (!proto) {
        return children;
    }

    const methods = Object.getOwnPropertyDescriptors(proto)
    const classes = getInnerClasses(target_class)
    const objects = Object.keys(target_class)

    // Process Children
    Object.keys(methods).forEach((name: any) => {
        const method = methods[name]
        const value = method.value
        const ctype: InstanceType = GetType(value);
        const is_basic: boolean = IsBasic(ctype);

        if (is_basic) {
            let child: Export = {
                Key: name,
                Type: ctype,
                Value: value,
                IsBasic: is_basic,
                Children: children,
            };

            children.push(child)
        }
    });

    classes.forEach(innerClass => {
        if (innerClass.Key != null) {
            let classChildren = getAllClassChildren(innerClass)
            children.push({
                Key: innerClass.name,
                Value: innerClass,
                IsBasic: false,
                Type: InstanceType.Class,
                Children: classChildren,
            } as Export)
        }
    });


    objects.forEach(objName => {
        const obj = (target_class as any)[objName]

        if (obj != null) {
            const otype = GetType(obj)

            if (otype == InstanceType.Object) {
                let objChildren = LocalParser.parse(obj)
                children.push({
                    Key: objName,
                    Value: obj,
                    IsBasic: false,
                    Type: InstanceType.Class,
                    Children: objChildren,
                } as Export)
            }
        }
    });

    return children;
}
