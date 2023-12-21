```javascript
<script>

let arr = [1, [2, [3, 4, 5], 6]];
function flatten(arr, crr) {
    //arr.flat(10)
    let brr = crr || []
    for(let i = 0; i < arr.length; i++){
        if(arr[i] instanceof Array){
            brr.concat(...flatten(arr[i], brr))
        }else{
            brr.push(arr[i])
        }
    }
    return brr
}
console.log(flatten(arr, []));  //  [1, 2, 3, 4, 5, 6]
</script>
```