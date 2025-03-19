/*
.toString(2)

This converts the number to a binary (base 2) string.
Example: 0.8573928492 in binary might become "0.1101101111..."
.substring(0, 4)

This extracts the first 4 characters of the binary string.
Since the binary representation of any decimal starts with "0.", the first four characters will always be "0.1", "0.0", etc.
Example: "0.110110..." → "0.11"
 */

let randomName = Math.random().toString(2).substring(0, 4);

console.log('randomName -> ', randomName); //"randomName -> ",  "0.01" 

randomName = Math.random().toString(2).substring(4);
console.log('randomName -> ', randomName); //"randomName -> ",  "10000010111101001011110100110001110111100000001011" 