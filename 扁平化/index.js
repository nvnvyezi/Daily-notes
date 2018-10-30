// 扁平化

// 递归
const arr = [1, 2, [3, [4, 5]]];
function flatten (arr) {
  let result = [];
  arr.forEach((item, index) => {
    if (typeof item === 'object') {
      result = [...result, ...flatten(item)];
    }else {
      result.push(item)
    }
  })
  return result;
}

console.log(flatten(arr))


// 如果数组元素都是数字
const arr1 = [1, 2, [3, [4, 5]]];

function flatten (arr) {
  return arr.toString().split(',').map(item => +item)
}

// reduce
const arr2 = [1, 2, [3, [4, 5]]];

function flatten (arr) {
  return arr.reduce((total, item, index) => {
    return total.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}
 