interface Action<T> {
    val: T
    do: Function
}

export default function Match<T>(value: T, deffunc?: CallableFunction, ...actions: Action<T>[]) {
    let dodef = true;

    for (let x = 0; x < actions.length; x++) {
        const action = actions[x];
        if (action.val == value) {
            dodef = false
            action.do()
        }
    }

    if (dodef && deffunc != null) {
        deffunc()
    }
}