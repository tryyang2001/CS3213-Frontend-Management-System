const StudentCode = {
  language: "python",
  sourceCode:
    "def is_odd(x):\r\n    if x % 2 == 1:\r\n        return False\r\n    else:\r\n        return True",
  targetFunction: "is_odd",
};

export const StudentCodeParser = {
  parser:
    '{"importStatements":[],"fncs":{"is_odd":{"name":"is_odd","rettype":"*","initloc":1,"endloc":0,"params":[{"val0":"x","val1":"*","valueArray":["x","*"],"valueList":["x","*"]}],"locexprs":{"1":[{"val0":"$ret","val1":{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},"valueArray":["$ret",{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2}],"valueList":["$ret",{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2}]}]},"loctrans":{"1":{}},"locdescs":{"1":"around the beginning of function \'is_odd\'"},"types":{}}}}',
};

export default StudentCode;
