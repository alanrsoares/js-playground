export const DEFAULT_CODE = `// Tail-recursive reduce function
const reduce = (arr, fn, acc) => 
    // Base case: if the array is empty, return the accumulated value
    arr.length === 0 
        ? acc 
        // Recursive case: apply the function to the first element, update the accumulator, and process the rest
        : reduce(arr.slice(1), fn, fn(acc, arr[0]));

// map: Transforms each element in the array using the provided function
const map = (arr, fn) => 
    reduce(arr, (acc, curr, i) => [...acc, fn(curr, i)], []);

// filter: Creates a new array with elements that pass the predicate test
const filter = (arr, fn) => 
    reduce(arr, (acc, curr, i) => (fn(curr, i) ? [...acc, curr] : acc), []);

// some: Returns true if at least one element satisfies the predicate
const some = (arr, fn) => 
    reduce(arr, (acc, curr, i) => acc || fn(curr, i), false);

// every: Returns true if all elements satisfy the predicate
const every = (arr, fn) => 
    reduce(arr, (acc, curr, i) => acc && fn(curr, i), true);

// Example usage
const numbers = [1, 2, 3, 4];

// Test cases
console.log(map(numbers, x => x * 2)); // [2, 4, 6, 8] - Transforms elements by multiplying by 2
console.log(filter(numbers, x => x % 2 === 0)); // [2, 4] - Keeps only even numbers
console.log(some(numbers, x => x % 2 === 0)); // true - At least one element is even
console.log(every(numbers, x => x % 2 === 0)); // false - Not all elements are even`;
