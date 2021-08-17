"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GitHelper = void 0;

var _util = require("util");

var _child_process = require("child_process");

var _temp = require("temp");

var _ = require("./..");

const GitHelper = {
  RepoExists: async path => {
    if (_.UrlHelper.IsUrl(path)) {
      try {
        await (0, _util.promisify)(_child_process.exec)(`git ls-remote ${_.UrlHelper.GetGitUrl(path)}`);
        return {
          exists: true
        };
      } catch (e) {
        return {
          exists: false,
          error: 'Source repository not found.'
        };
      }
    }

    return {
      exists: false,
      error: 'Source path not valid'
    };
  },
  CloneAndGetPath: async path => {
    try {
      const tempInfo = await (0, _util.promisify)(_temp.mkdir)('');
      await (0, _util.promisify)(_child_process.exec)(`git clone --depth 1 ${_.UrlHelper.GetGitUrl(path)} "${tempInfo}"`);
      return tempInfo;
    } catch (e) {
      throw Error(e);
    }
  }
};
exports.GitHelper = GitHelper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9VdGlscy9naXQvaW5kZXgudHMiXSwibmFtZXMiOlsiR2l0SGVscGVyIiwiUmVwb0V4aXN0cyIsInBhdGgiLCJVcmxIZWxwZXIiLCJJc1VybCIsImV4ZWMiLCJHZXRHaXRVcmwiLCJleGlzdHMiLCJlIiwiZXJyb3IiLCJDbG9uZUFuZEdldFBhdGgiLCJ0ZW1wSW5mbyIsIm1rZGlyIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFTyxNQUFNQSxTQUFTLEdBQUc7QUFDdkJDLEVBQUFBLFVBQVUsRUFBRSxNQUNWQyxJQURVLElBRXVDO0FBQ2pELFFBQUlDLFlBQVVDLEtBQVYsQ0FBZ0JGLElBQWhCLENBQUosRUFBMkI7QUFDekIsVUFBSTtBQUNGLGNBQU0scUJBQVVHLG1CQUFWLEVBQWlCLGlCQUFnQkYsWUFBVUcsU0FBVixDQUFvQkosSUFBcEIsQ0FBMEIsRUFBM0QsQ0FBTjtBQUNBLGVBQU87QUFBRUssVUFBQUEsTUFBTSxFQUFFO0FBQVYsU0FBUDtBQUNELE9BSEQsQ0FHRSxPQUFPQyxDQUFQLEVBQVU7QUFDVixlQUFPO0FBQUVELFVBQUFBLE1BQU0sRUFBRSxLQUFWO0FBQWlCRSxVQUFBQSxLQUFLLEVBQUU7QUFBeEIsU0FBUDtBQUNEO0FBQ0Y7O0FBQ0QsV0FBTztBQUFFRixNQUFBQSxNQUFNLEVBQUUsS0FBVjtBQUFpQkUsTUFBQUEsS0FBSyxFQUFFO0FBQXhCLEtBQVA7QUFDRCxHQWJzQjtBQWN2QkMsRUFBQUEsZUFBZSxFQUFFLE1BQU9SLElBQVAsSUFBeUM7QUFDeEQsUUFBSTtBQUNGLFlBQU1TLFFBQVEsR0FBRyxNQUFNLHFCQUFVQyxXQUFWLEVBQWlCLEVBQWpCLENBQXZCO0FBQ0EsWUFBTSxxQkFBVVAsbUJBQVYsRUFDSCx1QkFBc0JGLFlBQVVHLFNBQVYsQ0FBb0JKLElBQXBCLENBQTBCLEtBQUlTLFFBQVMsR0FEMUQsQ0FBTjtBQUdBLGFBQU9BLFFBQVA7QUFDRCxLQU5ELENBTUUsT0FBT0gsQ0FBUCxFQUFVO0FBQ1YsWUFBTUssS0FBSyxDQUFDTCxDQUFELENBQVg7QUFDRDtBQUNGO0FBeEJzQixDQUFsQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXHJcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xyXG5pbXBvcnQgeyBta2RpciB9IGZyb20gJ3RlbXAnXHJcblxyXG5pbXBvcnQgeyBVcmxIZWxwZXIgfSBmcm9tICdAVXRpbHMnXHJcblxyXG5leHBvcnQgY29uc3QgR2l0SGVscGVyID0ge1xyXG4gIFJlcG9FeGlzdHM6IGFzeW5jIChcclxuICAgIHBhdGg6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8eyBleGlzdHM6IGJvb2xlYW47IGVycm9yPzogc3RyaW5nIH0+ID0+IHtcclxuICAgIGlmIChVcmxIZWxwZXIuSXNVcmwocGF0aCkpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBwcm9taXNpZnkoZXhlYykoYGdpdCBscy1yZW1vdGUgJHtVcmxIZWxwZXIuR2V0R2l0VXJsKHBhdGgpfWApXHJcbiAgICAgICAgcmV0dXJuIHsgZXhpc3RzOiB0cnVlIH1cclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiB7IGV4aXN0czogZmFsc2UsIGVycm9yOiAnU291cmNlIHJlcG9zaXRvcnkgbm90IGZvdW5kLicgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyBleGlzdHM6IGZhbHNlLCBlcnJvcjogJ1NvdXJjZSBwYXRoIG5vdCB2YWxpZCcgfVxyXG4gIH0sXHJcbiAgQ2xvbmVBbmRHZXRQYXRoOiBhc3luYyAocGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHRlbXBJbmZvID0gYXdhaXQgcHJvbWlzaWZ5KG1rZGlyKSgnJylcclxuICAgICAgYXdhaXQgcHJvbWlzaWZ5KGV4ZWMpKFxyXG4gICAgICAgIGBnaXQgY2xvbmUgLS1kZXB0aCAxICR7VXJsSGVscGVyLkdldEdpdFVybChwYXRoKX0gXCIke3RlbXBJbmZvfVwiYFxyXG4gICAgICApXHJcbiAgICAgIHJldHVybiB0ZW1wSW5mbyBhcyBzdHJpbmdcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgdGhyb3cgRXJyb3IoZSlcclxuICAgIH1cclxuICB9LFxyXG59XHJcbiJdfQ==