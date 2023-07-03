export function getFunctionArgumentNames(func: Function) {
    const funcString = func.toString();
    const argumentNames = funcString
        .slice(funcString.indexOf('(') + 1, funcString.indexOf(')'))
        .match(/([^\s,]+)/g) || [];

    return argumentNames;
}

export default function getFunctionInfo(func: Function) {
    return {
        RawCode: func.toString(),
        Params: getFunctionArgumentNames(func)
    }
}
