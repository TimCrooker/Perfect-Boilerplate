"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UrlHelper = void 0;

var _validUrl = require("valid-url");

const UrlHelper = {
  IsUrl: path => {
    return !!(0, _validUrl.isUri)(path);
  },
  GetGitUrl: path => {
    if (path.slice(-4) === '.git') return path;
    return path + '.git';
  }
};
exports.UrlHelper = UrlHelper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9VdGlscy91cmwvaW5kZXgudHMiXSwibmFtZXMiOlsiVXJsSGVscGVyIiwiSXNVcmwiLCJwYXRoIiwiR2V0R2l0VXJsIiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFTyxNQUFNQSxTQUFTLEdBQUc7QUFDdkJDLEVBQUFBLEtBQUssRUFBR0MsSUFBRCxJQUEyQjtBQUNoQyxXQUFPLENBQUMsQ0FBQyxxQkFBTUEsSUFBTixDQUFUO0FBQ0QsR0FIc0I7QUFJdkJDLEVBQUFBLFNBQVMsRUFBR0QsSUFBRCxJQUEwQjtBQUNuQyxRQUFJQSxJQUFJLENBQUNFLEtBQUwsQ0FBVyxDQUFDLENBQVosTUFBbUIsTUFBdkIsRUFBK0IsT0FBT0YsSUFBUDtBQUMvQixXQUFPQSxJQUFJLEdBQUcsTUFBZDtBQUNEO0FBUHNCLENBQWxCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNVcmkgfSBmcm9tICd2YWxpZC11cmwnXHJcblxyXG5leHBvcnQgY29uc3QgVXJsSGVscGVyID0ge1xyXG4gIElzVXJsOiAocGF0aDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XHJcbiAgICByZXR1cm4gISFpc1VyaShwYXRoKVxyXG4gIH0sXHJcbiAgR2V0R2l0VXJsOiAocGF0aDogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAgIGlmIChwYXRoLnNsaWNlKC00KSA9PT0gJy5naXQnKSByZXR1cm4gcGF0aFxyXG4gICAgcmV0dXJuIHBhdGggKyAnLmdpdCdcclxuICB9LFxyXG59XHJcbiJdfQ==