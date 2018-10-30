const obj = {
  a: 1,
  b: [1, 2, [3, 4]],
  c: function (num) {
    console.log(num, 'c');
  },
  d: (num) => {
    console.log(num, 'd');
  },
  reg: /i?/,
  e: new Array(1).fill(2),
  g: 1
}
obj.f = obj

function getType (obj) {
  let arr = {
    '[object Boolean]': 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
  }
  return arr[Object.prototype.toString.call(obj)];
}

let hasObj = [];
function deepCopy (obj) {
  let type = getType(obj);
  let obj1 = null;
  hasObj.push(obj)
  // console.log(type, obj)
  if (type === 'object') {
    if (hasObj.indexOf(obj) != -1) {
      return obj;
    }
    obj1 = {};
    for (const key in obj) {
      obj1[key] = deepCopy(obj[key])
    }
  }else if (type === 'array') {
    obj1 = [];
    for (let i = 0; i < obj.length; i++) {
      obj1.push(deepCopy(obj[i]));
    }
  } else {
    return obj;
  }
  return obj1;
}
var obj2 = deepCopy(obj)
console.log(obj2)
