import Match from "./match";

export enum InstanceType {
    String = "String",
    Function = "Function",
    Class = "Class",
    Object = "Object",
    Number = "Number",
    Boolean = "Boolean",
    Float = "Float"
}

export function isClass(obj: any) {
    if (typeof obj !== 'function') return false;

    const descriptor = Object.getOwnPropertyDescriptor(obj, 'prototype');
    if (!descriptor) return false;

    return !descriptor.writable;
}

export function IsBasic(type_name: InstanceType) {
    return type_name == InstanceType.Float || type_name == InstanceType.Boolean || type_name == InstanceType.String || type_name == InstanceType.Number
}

export default function GetType<T>(value: T): InstanceType {
    const ty = typeof value;
    return Match(ty, undefined,
        {
            val: "string",
            do: function () {
                return InstanceType.String
            }
        },
        {
            val: "number",
            do: function () {
                return InstanceType.Number
            }
        },
        {
            val: "boolean",
            do: function () {
                return InstanceType.Boolean
            }
        },
        {
            val: "function",
            do: function () {
                if (isClass(value)) {
                    return InstanceType.Class
                } else {
                    return InstanceType.Function
                }
            }
        },
        {
            val: "object",
            do: function () {
                return InstanceType.Object
            }
        },
    )
}