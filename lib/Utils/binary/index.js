"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BinaryHelper = void 0;

var _child_process = require("child_process");

const BinaryHelper = {
  CanUseYarn: () => {
    try {
      (0, _child_process.execSync)('yarn --version', {
        stdio: 'ignore'
      });
      return true;
    } catch (e) {
      return false;
    }
  }
};
exports.BinaryHelper = BinaryHelper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9VdGlscy9iaW5hcnkvaW5kZXgudHMiXSwibmFtZXMiOlsiQmluYXJ5SGVscGVyIiwiQ2FuVXNlWWFybiIsInN0ZGlvIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVPLE1BQU1BLFlBQVksR0FBRztBQUMxQkMsRUFBQUEsVUFBVSxFQUFFLE1BQWU7QUFDekIsUUFBSTtBQUNGLG1DQUFTLGdCQUFULEVBQTJCO0FBQUVDLFFBQUFBLEtBQUssRUFBRTtBQUFULE9BQTNCO0FBQ0EsYUFBTyxJQUFQO0FBQ0QsS0FIRCxDQUdFLE9BQU9DLENBQVAsRUFBVTtBQUNWLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFSeUIsQ0FBckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXHJcblxyXG5leHBvcnQgY29uc3QgQmluYXJ5SGVscGVyID0ge1xyXG4gIENhblVzZVlhcm46ICgpOiBib29sZWFuID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGV4ZWNTeW5jKCd5YXJuIC0tdmVyc2lvbicsIHsgc3RkaW86ICdpZ25vcmUnIH0pXHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH0sXHJcbn1cclxuIl19