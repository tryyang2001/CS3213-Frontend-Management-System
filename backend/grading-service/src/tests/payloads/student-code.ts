const StudentSolution = {
  language: "python",
  pySourceCode:
    "def is_odd(x):\r\n    if x % 2 == 1:\r\n        return False\r\n    else:\r\n        return True",
  targetFunction: "is_odd",
  pyCodeParser:
    '{"importStatements":[],"fncs":{"is_odd":{"name":"is_odd","rettype":"*","initloc":1,"endloc":0,"params":[{"val0":"x","val1":"*","valueArray":["x","*"],"valueList":["x","*"]}],"locexprs":{"1":[{"val0":"$ret","val1":{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},"valueArray":["$ret",{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2}],"valueList":["$ret",{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2}]}]},"loctrans":{"1":{}},"locdescs":{"1":"around the beginning of function \'is_odd\'"},"types":{}}}}',
  pySourceCodeWithoutTargetFunction:
    "def isOdd(x):\r\n    if x % 2 == 1:\r\n        return False\r\n    else:\r\n        return True",
  pyCodeParserWithoutTargetFunction:
    '{"importStatements":[],"fncs":{"isOdd":{"name":"isOdd","rettype":"*","initloc":1,"endloc":0,"params":[{"val0":"x","val1":"*","valueArray":["x","*"],"valueList":["x","*"]}],"locexprs":{"1":[{"val0":"$ret","val1":{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},"valueArray":["$ret",{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2}],"valueList":["$ret",{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2}]}]},"loctrans":{"1":{}},"locdescs":{"1":"around the beginning of function \'isOdd\'"},"types":{}}}}',
  cSourceCode:
    "#include <stdio.h>\n\nint is_odd(int x) {\n    if (x % 2 == 1) {\n        return 0;\n    } else {\n        return 1;\n    }\n}",
  cCodeParser:
    '{"importStatements":["#include <stdio.h>"],"fncs":{"is_odd":{"name":"is_odd","rettype":"int","initloc":1,"endloc":0,"params":[{"val0":"x","val1":"int","valueArray":["x","int"],"valueList":["x","int"]}],"locexprs":{"1":[{"val0":"$ret","val1":{"name":"ite","args":[{"name":"==","args":[{"name":"%","args":[{"name":"x","primed":false,"line":3,"tokentype":"Variable"},{"value":"2","line":4,"tokentype":"Constant"}],"line":4,"tokentype":"Operation"},{"value":"1","line":4,"tokentype":"Constant"}],"line":4,"tokentype":"Operation"},{"value":"0","line":5,"tokentype":"Constant"},{"value":"1","line":7,"tokentype":"Constant"}],"line":4,"tokentype":"Operation"},"valueArray":["$ret",{"name":"ite","args":[{"name":"==","args":[{"name":"%","args":[{"name":"x","primed":false,"line":3,"tokentype":"Variable"},{"value":"2","line":4,"tokentype":"Constant"}],"line":4,"tokentype":"Operation"},{"value":"1","line":4,"tokentype":"Constant"}],"line":4,"tokentype":"Operation"},{"value":"0","line":5,"tokentype":"Constant"},{"value":"1","line":7,"tokentype":"Constant"}],"line":4}],"valueList":["$ret",{"name":"ite","args":[{"name":"==","args":[{"name":"%","args":[{"name":"x","primed":false,"line":3,"tokentype":"Variable"},{"value":"2","line":4,"tokentype":"Constant"}],"line":4,"tokentype":"Operation"},{"value":"1","line":4,"tokentype":"Constant"}],"line":4,"tokentype":"Operation"},{"value":"0","line":5,"tokentype":"Constant"},{"value":"1","line":7,"tokentype":"Constant"}],"line":4}]}]},"loctrans":{"1":{}},"locdescs":{"1":"at the beginning of the function \'is_odd\'"},"types":{"x":"int"}}}}',
  submission: {
    id: "submission-id",
    questionId: "existing-question-id",
    studentId: 1,
    language: "python",
    code: "def is_odd(x):\r\n    if x % 2 == 1:\r\n        return False\r\n    else:\r\n        return True",
    feedbacks: [
      {
        line: 2,
        hints: ["Incorrect else-block for if ( ((x % 2) == 1) )"],
      },
    ],
    createdOn: new Date("2024-04-08T00:00:00Z"),
  },
};

export default StudentSolution;
