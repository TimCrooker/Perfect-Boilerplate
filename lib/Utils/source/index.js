"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSource = void 0;

var _ora = _interopRequireDefault(require("ora"));

var _chalk = _interopRequireDefault(require("chalk"));

var _ = require("./..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * get_source will return path for plugins
 * source can be url - relative local path or "superplate"
 *
 */

/**
 * takes CLI source input for custom plugins source and returns the path to the directory
 */
const getSource = async source => {
  /**
   * Replace path if default
   */
  const sourceSpinner = (0, _ora.default)(`Checking provided source ${_chalk.default.bold`"${source}"`}`);
  sourceSpinner.start();
  const sourcePath = source ?? 'https://github.com/TimCrooker/Perfect-Boilerplate-Plugins.git';
  const PathExists = await _.FSHelper.PathExists(sourcePath);

  if (PathExists) {
    /**
     * check local path
     */
    sourceSpinner.succeed('Found local source.');
    return {
      path: sourcePath
    };
  } else {
    /**
     * Check repo exists
     * clone and return path if exists
     */
    sourceSpinner.text = 'Checking remote source...';
    const repoStatus = await _.GitHelper.RepoExists(sourcePath);

    if (repoStatus.exists === true) {
      sourceSpinner.text = 'Remote source found. Cloning...';
      const cloneResponse = await _.GitHelper.CloneAndGetPath(sourcePath);

      if (cloneResponse) {
        sourceSpinner.succeed('Cloned remote source successfully.');
        return {
          path: cloneResponse
        };
      }

      sourceSpinner.fail('Could not retrieve source repository.');
      return {
        error: 'Could not retrieve source repository.'
      };
    } else {
      sourceSpinner.fail('Could not found source repository.');
      return {
        error: repoStatus.error
      };
    }
  }
};

exports.getSource = getSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9VdGlscy9zb3VyY2UvaW5kZXgudHMiXSwibmFtZXMiOlsiZ2V0U291cmNlIiwic291cmNlIiwic291cmNlU3Bpbm5lciIsImNoYWxrIiwiYm9sZCIsInN0YXJ0Iiwic291cmNlUGF0aCIsIlBhdGhFeGlzdHMiLCJGU0hlbHBlciIsInN1Y2NlZWQiLCJwYXRoIiwidGV4dCIsInJlcG9TdGF0dXMiLCJHaXRIZWxwZXIiLCJSZXBvRXhpc3RzIiwiZXhpc3RzIiwiY2xvbmVSZXNwb25zZSIsIkNsb25lQW5kR2V0UGF0aCIsImZhaWwiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU1BOztBQUNBOztBQUVBOzs7O0FBVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQU9BO0FBQ0E7QUFDQTtBQUNPLE1BQU1BLFNBQXNCLEdBQUcsTUFBT0MsTUFBUCxJQUFrQjtBQUN0RDtBQUNGO0FBQ0E7QUFDRSxRQUFNQyxhQUFhLEdBQUcsa0JBQ25CLDRCQUEyQkMsZUFBTUMsSUFBSyxJQUFHSCxNQUFPLEdBQUcsRUFEaEMsQ0FBdEI7QUFHQUMsRUFBQUEsYUFBYSxDQUFDRyxLQUFkO0FBRUEsUUFBTUMsVUFBVSxHQUNkTCxNQUFNLElBQUksK0RBRFo7QUFHQSxRQUFNTSxVQUFVLEdBQUcsTUFBTUMsV0FBU0QsVUFBVCxDQUFvQkQsVUFBcEIsQ0FBekI7O0FBQ0EsTUFBSUMsVUFBSixFQUFnQjtBQUNkO0FBQ0o7QUFDQTtBQUNJTCxJQUFBQSxhQUFhLENBQUNPLE9BQWQsQ0FBc0IscUJBQXRCO0FBQ0EsV0FBTztBQUFFQyxNQUFBQSxJQUFJLEVBQUVKO0FBQVIsS0FBUDtBQUNELEdBTkQsTUFNTztBQUNMO0FBQ0o7QUFDQTtBQUNBO0FBQ0lKLElBQUFBLGFBQWEsQ0FBQ1MsSUFBZCxHQUFxQiwyQkFBckI7QUFDQSxVQUFNQyxVQUFVLEdBQUcsTUFBTUMsWUFBVUMsVUFBVixDQUFxQlIsVUFBckIsQ0FBekI7O0FBQ0EsUUFBSU0sVUFBVSxDQUFDRyxNQUFYLEtBQXNCLElBQTFCLEVBQWdDO0FBQzlCYixNQUFBQSxhQUFhLENBQUNTLElBQWQsR0FBcUIsaUNBQXJCO0FBQ0EsWUFBTUssYUFBYSxHQUFHLE1BQU1ILFlBQVVJLGVBQVYsQ0FBMEJYLFVBQTFCLENBQTVCOztBQUNBLFVBQUlVLGFBQUosRUFBbUI7QUFDakJkLFFBQUFBLGFBQWEsQ0FBQ08sT0FBZCxDQUFzQixvQ0FBdEI7QUFDQSxlQUFPO0FBQUVDLFVBQUFBLElBQUksRUFBRU07QUFBUixTQUFQO0FBQ0Q7O0FBQ0RkLE1BQUFBLGFBQWEsQ0FBQ2dCLElBQWQsQ0FBbUIsdUNBQW5CO0FBQ0EsYUFBTztBQUFFQyxRQUFBQSxLQUFLLEVBQUU7QUFBVCxPQUFQO0FBQ0QsS0FURCxNQVNPO0FBQ0xqQixNQUFBQSxhQUFhLENBQUNnQixJQUFkLENBQW1CLG9DQUFuQjtBQUNBLGFBQU87QUFBRUMsUUFBQUEsS0FBSyxFQUFFUCxVQUFVLENBQUNPO0FBQXBCLE9BQVA7QUFDRDtBQUNGO0FBQ0YsQ0F4Q00iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICpcclxuICogZ2V0X3NvdXJjZSB3aWxsIHJldHVybiBwYXRoIGZvciBwbHVnaW5zXHJcbiAqIHNvdXJjZSBjYW4gYmUgdXJsIC0gcmVsYXRpdmUgbG9jYWwgcGF0aCBvciBcInN1cGVycGxhdGVcIlxyXG4gKlxyXG4gKi9cclxuaW1wb3J0IG9yYSBmcm9tICdvcmEnXHJcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsaydcclxuXHJcbmltcG9ydCB7IEdpdEhlbHBlciwgRlNIZWxwZXIgfSBmcm9tICdAVXRpbHMnXHJcbmltcG9ydCB7IEdldFNvdXJjZUZuIH0gZnJvbSAnLi9zb3VyY2UnXHJcblxyXG4vKipcclxuICogdGFrZXMgQ0xJIHNvdXJjZSBpbnB1dCBmb3IgY3VzdG9tIHBsdWdpbnMgc291cmNlIGFuZCByZXR1cm5zIHRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnlcclxuICovXHJcbmV4cG9ydCBjb25zdCBnZXRTb3VyY2U6IEdldFNvdXJjZUZuID0gYXN5bmMgKHNvdXJjZSkgPT4ge1xyXG4gIC8qKlxyXG4gICAqIFJlcGxhY2UgcGF0aCBpZiBkZWZhdWx0XHJcbiAgICovXHJcbiAgY29uc3Qgc291cmNlU3Bpbm5lciA9IG9yYShcclxuICAgIGBDaGVja2luZyBwcm92aWRlZCBzb3VyY2UgJHtjaGFsay5ib2xkYFwiJHtzb3VyY2V9XCJgfWBcclxuICApXHJcbiAgc291cmNlU3Bpbm5lci5zdGFydCgpXHJcblxyXG4gIGNvbnN0IHNvdXJjZVBhdGggPVxyXG4gICAgc291cmNlID8/ICdodHRwczovL2dpdGh1Yi5jb20vVGltQ3Jvb2tlci9QZXJmZWN0LUJvaWxlcnBsYXRlLVBsdWdpbnMuZ2l0J1xyXG5cclxuICBjb25zdCBQYXRoRXhpc3RzID0gYXdhaXQgRlNIZWxwZXIuUGF0aEV4aXN0cyhzb3VyY2VQYXRoKVxyXG4gIGlmIChQYXRoRXhpc3RzKSB7XHJcbiAgICAvKipcclxuICAgICAqIGNoZWNrIGxvY2FsIHBhdGhcclxuICAgICAqL1xyXG4gICAgc291cmNlU3Bpbm5lci5zdWNjZWVkKCdGb3VuZCBsb2NhbCBzb3VyY2UuJylcclxuICAgIHJldHVybiB7IHBhdGg6IHNvdXJjZVBhdGggfVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIHJlcG8gZXhpc3RzXHJcbiAgICAgKiBjbG9uZSBhbmQgcmV0dXJuIHBhdGggaWYgZXhpc3RzXHJcbiAgICAgKi9cclxuICAgIHNvdXJjZVNwaW5uZXIudGV4dCA9ICdDaGVja2luZyByZW1vdGUgc291cmNlLi4uJ1xyXG4gICAgY29uc3QgcmVwb1N0YXR1cyA9IGF3YWl0IEdpdEhlbHBlci5SZXBvRXhpc3RzKHNvdXJjZVBhdGgpXHJcbiAgICBpZiAocmVwb1N0YXR1cy5leGlzdHMgPT09IHRydWUpIHtcclxuICAgICAgc291cmNlU3Bpbm5lci50ZXh0ID0gJ1JlbW90ZSBzb3VyY2UgZm91bmQuIENsb25pbmcuLi4nXHJcbiAgICAgIGNvbnN0IGNsb25lUmVzcG9uc2UgPSBhd2FpdCBHaXRIZWxwZXIuQ2xvbmVBbmRHZXRQYXRoKHNvdXJjZVBhdGgpXHJcbiAgICAgIGlmIChjbG9uZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgc291cmNlU3Bpbm5lci5zdWNjZWVkKCdDbG9uZWQgcmVtb3RlIHNvdXJjZSBzdWNjZXNzZnVsbHkuJylcclxuICAgICAgICByZXR1cm4geyBwYXRoOiBjbG9uZVJlc3BvbnNlIH1cclxuICAgICAgfVxyXG4gICAgICBzb3VyY2VTcGlubmVyLmZhaWwoJ0NvdWxkIG5vdCByZXRyaWV2ZSBzb3VyY2UgcmVwb3NpdG9yeS4nKVxyXG4gICAgICByZXR1cm4geyBlcnJvcjogJ0NvdWxkIG5vdCByZXRyaWV2ZSBzb3VyY2UgcmVwb3NpdG9yeS4nIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNvdXJjZVNwaW5uZXIuZmFpbCgnQ291bGQgbm90IGZvdW5kIHNvdXJjZSByZXBvc2l0b3J5LicpXHJcbiAgICAgIHJldHVybiB7IGVycm9yOiByZXBvU3RhdHVzLmVycm9yIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19