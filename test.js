function convert(obj){
    Object.keys(obj).forEach(key => {
        let initalValue = obj[key];
        Object.defineProperty(obj, key, {
            get () {
                return initalValue
            },
            set (newValue) {
                initalValue = newValue
            }
        })
    })
}