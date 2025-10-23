export class DebounceUtil {
    static debounce: ReturnType<typeof setTimeout>;

    static apply(callback: Function, time?: number) {
        clearTimeout(DebounceUtil.debounce)
        DebounceUtil.debounce = setTimeout(()=>{
            callback()
        }, time || 300)
    }
}