"use strict";

var _ = require("./");

describe('Url Helper', () => {
  it('incorrect url', async () => {
    const isUrl = _.UrlHelper.IsUrl('alibaba');

    expect(isUrl).toBeFalsy();
  });
  it('correct url', async () => {
    const isUrl = _.UrlHelper.IsUrl('https://pankod.com');

    expect(isUrl).toBeTruthy();
  });
  it('create git url without .git extension', async () => {
    const gitUrl = _.UrlHelper.GetGitUrl('https://pankod.com');

    expect(gitUrl).toBe('https://pankod.com.git');
  });
  it('create git url with .git extension', async () => {
    const gitUrl = _.UrlHelper.GetGitUrl('https://pankod.com.git');

    expect(gitUrl).toBe('https://pankod.com.git');
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9VdGlscy91cmwvaW5kZXguc3BlYy50cyJdLCJuYW1lcyI6WyJkZXNjcmliZSIsIml0IiwiaXNVcmwiLCJVcmxIZWxwZXIiLCJJc1VybCIsImV4cGVjdCIsInRvQmVGYWxzeSIsInRvQmVUcnV0aHkiLCJnaXRVcmwiLCJHZXRHaXRVcmwiLCJ0b0JlIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUVBQSxRQUFRLENBQUMsWUFBRCxFQUFlLE1BQU07QUFDM0JDLEVBQUFBLEVBQUUsQ0FBQyxlQUFELEVBQWtCLFlBQVk7QUFDOUIsVUFBTUMsS0FBSyxHQUFHQyxZQUFVQyxLQUFWLENBQWdCLFNBQWhCLENBQWQ7O0FBQ0FDLElBQUFBLE1BQU0sQ0FBQ0gsS0FBRCxDQUFOLENBQWNJLFNBQWQ7QUFDRCxHQUhDLENBQUY7QUFLQUwsRUFBQUEsRUFBRSxDQUFDLGFBQUQsRUFBZ0IsWUFBWTtBQUM1QixVQUFNQyxLQUFLLEdBQUdDLFlBQVVDLEtBQVYsQ0FBZ0Isb0JBQWhCLENBQWQ7O0FBQ0FDLElBQUFBLE1BQU0sQ0FBQ0gsS0FBRCxDQUFOLENBQWNLLFVBQWQ7QUFDRCxHQUhDLENBQUY7QUFLQU4sRUFBQUEsRUFBRSxDQUFDLHVDQUFELEVBQTBDLFlBQVk7QUFDdEQsVUFBTU8sTUFBTSxHQUFHTCxZQUFVTSxTQUFWLENBQW9CLG9CQUFwQixDQUFmOztBQUNBSixJQUFBQSxNQUFNLENBQUNHLE1BQUQsQ0FBTixDQUFlRSxJQUFmLENBQW9CLHdCQUFwQjtBQUNELEdBSEMsQ0FBRjtBQUtBVCxFQUFBQSxFQUFFLENBQUMsb0NBQUQsRUFBdUMsWUFBWTtBQUNuRCxVQUFNTyxNQUFNLEdBQUdMLFlBQVVNLFNBQVYsQ0FBb0Isd0JBQXBCLENBQWY7O0FBQ0FKLElBQUFBLE1BQU0sQ0FBQ0csTUFBRCxDQUFOLENBQWVFLElBQWYsQ0FBb0Isd0JBQXBCO0FBQ0QsR0FIQyxDQUFGO0FBSUQsQ0FwQk8sQ0FBUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVybEhlbHBlciB9IGZyb20gJy4vJ1xyXG5cclxuZGVzY3JpYmUoJ1VybCBIZWxwZXInLCAoKSA9PiB7XHJcbiAgaXQoJ2luY29ycmVjdCB1cmwnLCBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1VybCA9IFVybEhlbHBlci5Jc1VybCgnYWxpYmFiYScpXHJcbiAgICBleHBlY3QoaXNVcmwpLnRvQmVGYWxzeSgpXHJcbiAgfSlcclxuXHJcbiAgaXQoJ2NvcnJlY3QgdXJsJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgaXNVcmwgPSBVcmxIZWxwZXIuSXNVcmwoJ2h0dHBzOi8vcGFua29kLmNvbScpXHJcbiAgICBleHBlY3QoaXNVcmwpLnRvQmVUcnV0aHkoKVxyXG4gIH0pXHJcblxyXG4gIGl0KCdjcmVhdGUgZ2l0IHVybCB3aXRob3V0IC5naXQgZXh0ZW5zaW9uJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgZ2l0VXJsID0gVXJsSGVscGVyLkdldEdpdFVybCgnaHR0cHM6Ly9wYW5rb2QuY29tJylcclxuICAgIGV4cGVjdChnaXRVcmwpLnRvQmUoJ2h0dHBzOi8vcGFua29kLmNvbS5naXQnKVxyXG4gIH0pXHJcblxyXG4gIGl0KCdjcmVhdGUgZ2l0IHVybCB3aXRoIC5naXQgZXh0ZW5zaW9uJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgZ2l0VXJsID0gVXJsSGVscGVyLkdldEdpdFVybCgnaHR0cHM6Ly9wYW5rb2QuY29tLmdpdCcpXHJcbiAgICBleHBlY3QoZ2l0VXJsKS50b0JlKCdodHRwczovL3BhbmtvZC5jb20uZ2l0JylcclxuICB9KVxyXG59KVxyXG4iXX0=