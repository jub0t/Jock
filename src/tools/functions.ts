export default function getFunctionInfo(func: Function) {
    return {
        RawCode: func.toString(),
    }
}
