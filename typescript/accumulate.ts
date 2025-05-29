export function accumulate(array: i32[]): i32 {
    let sum: i32 = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}