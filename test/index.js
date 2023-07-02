const grepper = require("grepper");
const jock = require("../dist/index").default;
const test = require("./test");

const TestSubject = {
  ...grepper,
  outerFunc: function () {
    function innerFunc() {
      console.log(`Hi`);
    }

    innerFunc();
  },
  testClass: test.MyClass,
};

const parser = jock.Parser;
const parsed = parser.parse(TestSubject, false);
// console.log(parsed);
