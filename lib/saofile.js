"use strict";

var _path = _interopRequireDefault(require("path"));

var _child_process = require("child_process");

var _util = require("util");

var _chalk = _interopRequireDefault(require("chalk"));

var _validateNpmPackageName = _interopRequireDefault(require("validate-npm-package-name"));

var _Utils = require("./Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const saoConfig = {
  /**
   * Runs upon instantiation of the SAO generator
   */
  prompts(sao) {
    const {
      appName,
      extras: {
        paths
      }
    } = sao.opts; // eslint-disable-next-line @typescript-eslint/no-var-requires

    const sourcePrompts = require(_path.default.resolve(paths.sourcePath, 'prompt.js'));

    return [{
      type: 'input',
      name: 'name',
      message: 'What will be the name of your app',
      default: appName
    }, ...(_Utils.BinaryHelper.CanUseYarn() ? [{
      name: 'pm',
      message: 'Package manager:',
      choices: [{
        message: 'Npm',
        value: 'npm'
      }, {
        message: 'Yarn',
        value: 'yarn'
      }],
      type: 'select',
      default: 'npm'
    }] : []), // presents the prompts from the selected plugin pack to the user
    ...((sourcePrompts === null || sourcePrompts === void 0 ? void 0 : sourcePrompts.prompts) ?? [])];
  },

  /**
   * Runs after recieving answers from the user to all presented prompts
   *
   * This function is used for manipulating data before it gets passed to the actions function
   *
   * all functions that are run after this one will have access to "sao.data" which will contain all of this function's returns
   */
  data(sao) {
    /**
     * Package Manager
     */
    sao.answers.pm = _Utils.BinaryHelper.CanUseYarn() ? sao.answers.pm : 'npm';
    const pmRun = sao.answers.pm === 'yarn' ? 'yarn' : 'npm run';
    /**
     * Extend.js data
     */

    const {
      sourcePath
    } = sao.opts.extras.paths;
    const {
      projectType
    } = sao.opts.extras;
    const pluginAnswers = { ...sao.answers
    };
    delete pluginAnswers.name;
    const selectedPlugins = (0, _Utils.getPluginsArray)(pluginAnswers);
    const extendData = (0, _Utils.concatExtend)(_Utils.extendBase, selectedPlugins, sourcePath, sao.answers);
    /**
     * Plugins meta data
     */

    const pluginsData = (0, _Utils.mergePluginData)({}, sourcePath, selectedPlugins, 'meta.json').plugins;
    const metaJSONPath = projectType === 'react' ? 'src/meta.json' : 'public/meta.json';
    /**
     * Return
     */

    return { ...sao.answers,
      projectType,
      answers: sao.answers,
      selectedPlugins,
      pmRun,
      pluginsData,
      metaJSONPath,
      ...extendData
    };
  },

  /**
   * Runs after manipulating data in the data function and gets passed that manipulated data
   *
   * Execute file and directory transformation actions
   *
   * actions are objects containing a set of instructions on a single transformation pattern
   *
   * ADD:
   *
   * MOVE:
   *
   * MODIFY:
   *
   * REMOVE:
   *
   * @returns array of action objects
   */
  async actions(sao) {
    if (sao.answers.name.length === 0) {
      const error = sao.createError('App name is required!');
      throw error;
    }
    /**
     * Validate app name
     */


    const appNameValidation = (0, _validateNpmPackageName.default)(sao.answers.name);

    if (appNameValidation.warnings) {
      appNameValidation.warnings.forEach(warn => this.logger.warn(warn));
    }

    if (appNameValidation.errors) {
      appNameValidation.errors.forEach(warn => this.logger.error(warn));
      process.exit(1);
    }

    const {
      sourcePath
    } = sao.opts.extras.paths;
    const actionsArray = [{
      type: 'add',
      files: '**',
      templateDir: _path.default.join(sourcePath, 'template'),

      data() {
        return sao.data;
      }

    }, {
      type: 'move',
      templateDir: _path.default.join(sourcePath, 'template'),
      patterns: {
        gitignore: '.gitignore',
        '_package.json': 'package.json',
        '_next-env.d.ts': 'next-env.d.ts',
        '_tsconfig.json': 'tsconfig.json',
        babelrc: '.babelrc'
      },

      data() {
        return sao.data;
      }

    }];
    const pluginAnswers = { ...sao.answers
    };
    delete pluginAnswers.name;
    const selectedPlugins = (0, _Utils.getPluginsArray)(pluginAnswers); // eslint-disable-next-line @typescript-eslint/no-var-requires

    const sourcePrompts = require(_path.default.resolve(sourcePath, 'prompt.js'));
    /**
     *
     *
     */


    actionsArray.push(...selectedPlugins.map(plugin => {
      const customFilters = (0, _Utils.handleIgnore)((sourcePrompts === null || sourcePrompts === void 0 ? void 0 : sourcePrompts.ignores) ?? [], sao.answers, plugin);
      return {
        type: 'add',
        files: '**',
        templateDir: _path.default.join(sourcePath, 'plugins', plugin),
        filters: {
          'extend.js': false,
          'package.json': false,
          'package.js': false,
          'tsconfig.json': false,
          '.babelrc': false,
          'meta.json': false,
          ...customFilters
        },

        data() {
          return sao.data;
        }

      };
    }));
    /**
     * eslintrc handler
     */

    actionsArray.push({
      type: 'move',
      patterns: {
        '_.eslintrc': '.eslintrc'
      },

      data() {
        return sao.data;
      }

    });
    /**
     * meta.json handler
     */

    actionsArray.push({
      type: 'modify',
      files: sao.data.metaJSONPath,

      handler(data) {
        return (0, _Utils.mergePluginData)(data, sourcePath, selectedPlugins, 'meta.json');
      }

    });
    /**
     * package.json handler
     */

    actionsArray.push({
      type: 'modify',
      files: 'package.json',

      handler(data) {
        return (0, _Utils.mergePackages)(data, sourcePath, selectedPlugins, sao.answers);
      }

    });
    /**
     * tsconfig.json handler
     */

    actionsArray.push({
      type: 'modify',
      files: 'tsconfig.json',

      handler(data) {
        return (0, _Utils.mergeJSONFiles)(data, sourcePath, selectedPlugins, 'tsconfig.json', {
          arrayMerge: (dest, source) => {
            const arr = [...dest, ...source];
            return arr.filter((el, i) => arr.indexOf(el) === i);
          }
        });
      }

    });
    /**
     * .babelrc handler
     */

    actionsArray.push({
      type: 'modify',
      files: '.babelrc',

      async handler(data) {
        const merged = await (0, _Utils.mergeBabel)(JSON.parse(data), sourcePath, selectedPlugins);
        return JSON.stringify(merged);
      }

    });
    return actionsArray;
  },

  /**
   * Runs before actions are executed
   */
  async prepare() {
    _Utils.tips.preInstall();
  },

  /**
   * Runs after actions are done being executed
   */
  async completed(sao) {
    const {
      debug
    } = sao.opts.extras;
    /**
     * Git init and install packages
     */

    if (!debug) {
      sao.gitInit();
      await sao.npmInstall({
        npmClient: this.answers.pm
      });
    }
    /**
     * Format generated project
     */
    // await promisify(exec)(`npx prettier "${sao.outDir}" --write`)

    /**
     * Create an initial commit
     */


    if (!debug) {
      try {
        // add
        await (0, _util.promisify)(_child_process.exec)(`git --git-dir="${sao.outDir}"/.git/ --work-tree="${sao.outDir}"/ add -A`); // commit

        await (0, _util.promisify)(_child_process.exec)(`git --git-dir="${sao.outDir}"/.git/ --work-tree="${sao.outDir}"/ commit -m "initial commit with superstack"`);
        sao.logger.info('created an initial commit.');
      } catch (_) {
        console.log(_chalk.default.yellow`An error occured while creating git commit.`);
      }
    }
    /**
     * Show messages after completion
     */


    _Utils.tips.postInstall({
      name: sao.opts.appName ?? '',
      dir: sao.outDir,
      pm: sao.answers.pm
    });
  }

};
module.exports = saoConfig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zYW9maWxlLnRzIl0sIm5hbWVzIjpbInNhb0NvbmZpZyIsInByb21wdHMiLCJzYW8iLCJhcHBOYW1lIiwiZXh0cmFzIiwicGF0aHMiLCJvcHRzIiwic291cmNlUHJvbXB0cyIsInJlcXVpcmUiLCJwYXRoIiwicmVzb2x2ZSIsInNvdXJjZVBhdGgiLCJ0eXBlIiwibmFtZSIsIm1lc3NhZ2UiLCJkZWZhdWx0IiwiQmluYXJ5SGVscGVyIiwiQ2FuVXNlWWFybiIsImNob2ljZXMiLCJ2YWx1ZSIsImRhdGEiLCJhbnN3ZXJzIiwicG0iLCJwbVJ1biIsInByb2plY3RUeXBlIiwicGx1Z2luQW5zd2VycyIsInNlbGVjdGVkUGx1Z2lucyIsImV4dGVuZERhdGEiLCJleHRlbmRCYXNlIiwicGx1Z2luc0RhdGEiLCJwbHVnaW5zIiwibWV0YUpTT05QYXRoIiwiYWN0aW9ucyIsImxlbmd0aCIsImVycm9yIiwiY3JlYXRlRXJyb3IiLCJhcHBOYW1lVmFsaWRhdGlvbiIsIndhcm5pbmdzIiwiZm9yRWFjaCIsIndhcm4iLCJsb2dnZXIiLCJlcnJvcnMiLCJwcm9jZXNzIiwiZXhpdCIsImFjdGlvbnNBcnJheSIsImZpbGVzIiwidGVtcGxhdGVEaXIiLCJqb2luIiwicGF0dGVybnMiLCJnaXRpZ25vcmUiLCJiYWJlbHJjIiwicHVzaCIsIm1hcCIsInBsdWdpbiIsImN1c3RvbUZpbHRlcnMiLCJpZ25vcmVzIiwiZmlsdGVycyIsImhhbmRsZXIiLCJhcnJheU1lcmdlIiwiZGVzdCIsInNvdXJjZSIsImFyciIsImZpbHRlciIsImVsIiwiaSIsImluZGV4T2YiLCJtZXJnZWQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJwcmVwYXJlIiwidGlwcyIsInByZUluc3RhbGwiLCJjb21wbGV0ZWQiLCJkZWJ1ZyIsImdpdEluaXQiLCJucG1JbnN0YWxsIiwibnBtQ2xpZW50IiwiZXhlYyIsIm91dERpciIsImluZm8iLCJfIiwiY29uc29sZSIsImxvZyIsImNoYWxrIiwi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Q1ZDLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxlQUFNQyxNQUFPLDZDQUF6QjtBQUNEO0FBQ0Y7QUFFRDtBQUNKO0FBQ0E7OztBQUNJZCxnQkFBS2UsV0FBTCxDQUFpQjtBQUNmekUsTUFBQUEsSUFBSSxFQUFFWCxHQUFHLENBQUNJLElBQUosQ0FBU0gsT0FBVCxJQUFvQixFQURYO0FBRWZvRixNQUFBQSxHQUFHLEVBQUVyRixHQUFHLENBQUM2RSxNQUZNO0FBR2Z6RCxNQUFBQSxFQUFFLEVBQUVwQixHQUFHLENBQUNtQixPQUFKLENBQVlDO0FBSEQsS0FBakI7QUFLRDs7QUE5VWdDLENBQW5DO0FBaVZBa0UsTUFBTSxDQUFDQyxPQUFQLEdBQWlCekYsU0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJ1xuaW1wb3J0IHZhbGlkYXRlIGZyb20gJ3ZhbGlkYXRlLW5wbS1wYWNrYWdlLW5hbWUnXG5cbmltcG9ydCB7XG4gIEJpbmFyeUhlbHBlcixcbiAgY29uY2F0RXh0ZW5kLFxuICBleHRlbmRCYXNlLFxuICBnZXRQbHVnaW5zQXJyYXksXG4gIGhhbmRsZUlnbm9yZSxcbiAgbWVyZ2VCYWJlbCxcbiAgbWVyZ2VKU09ORmlsZXMsXG4gIG1lcmdlUGFja2FnZXMsXG4gIG1lcmdlUGx1Z2luRGF0YSxcbiAgdGlwcyxcbn0gZnJvbSAnQFV0aWxzJ1xuaW1wb3J0IHsgQWN0aW9uLCBHZW5lcmF0b3JDb25maWcgfSBmcm9tICcuLi9AdHlwZXMvc2FvJ1xuXG5jb25zdCBzYW9Db25maWc6IEdlbmVyYXRvckNvbmZpZyA9IHtcbiAgLyoqXG4gICAqIFJ1bnMgdXBvbiBpbnN0YW50aWF0aW9uIG9mIHRoZSBTQU8gZ2VuZXJhdG9yXG4gICAqL1xuICBwcm9tcHRzKHNhbykge1xuICAgIGNvbnN0IHtcbiAgICAgIGFwcE5hbWUsXG4gICAgICBleHRyYXM6IHsgcGF0aHMgfSxcbiAgICB9ID0gc2FvLm9wdHNcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgY29uc3Qgc291cmNlUHJvbXB0cyA9IHJlcXVpcmUocGF0aC5yZXNvbHZlKHBhdGhzLnNvdXJjZVBhdGgsICdwcm9tcHQuanMnKSlcblxuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgbWVzc2FnZTogJ1doYXQgd2lsbCBiZSB0aGUgbmFtZSBvZiB5b3VyIGFwcCcsXG4gICAgICAgIGRlZmF1bHQ6IGFwcE5hbWUsXG4gICAgICB9LFxuICAgICAgLi4uKEJpbmFyeUhlbHBlci5DYW5Vc2VZYXJuKClcbiAgICAgICAgPyBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdwbScsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdQYWNrYWdlIG1hbmFnZXI6JyxcbiAgICAgICAgICAgICAgY2hvaWNlczogW1xuICAgICAgICAgICAgICAgIHsgbWVzc2FnZTogJ05wbScsIHZhbHVlOiAnbnBtJyB9LFxuICAgICAgICAgICAgICAgIHsgbWVzc2FnZTogJ1lhcm4nLCB2YWx1ZTogJ3lhcm4nIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICAgICAgICBkZWZhdWx0OiAnbnBtJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKSxcbiAgICAgIC8vIHByZXNlbnRzIHRoZSBwcm9tcHRzIGZyb20gdGhlIHNlbGVjdGVkIHBsdWdpbiBwYWNrIHRvIHRoZSB1c2VyXG4gICAgICAuLi4oc291cmNlUHJvbXB0cz8ucHJvbXB0cyA/PyBbXSksXG4gICAgXVxuICB9LFxuXG4gIC8qKlxuICAgKiBSdW5zIGFmdGVyIHJlY2lldmluZyBhbnN3ZXJzIGZyb20gdGhlIHVzZXIgdG8gYWxsIHByZXNlbnRlZCBwcm9tcHRzXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBmb3IgbWFuaXB1bGF0aW5nIGRhdGEgYmVmb3JlIGl0IGdldHMgcGFzc2VkIHRvIHRoZSBhY3Rpb25zIGZ1bmN0aW9uXG4gICAqXG4gICAqIGFsbCBmdW5jdGlvbnMgdGhhdCBhcmUgcnVuIGFmdGVyIHRoaXMgb25lIHdpbGwgaGF2ZSBhY2Nlc3MgdG8gXCJzYW8uZGF0YVwiIHdoaWNoIHdpbGwgY29udGFpbiBhbGwgb2YgdGhpcyBmdW5jdGlvbidzIHJldHVybnNcbiAgICovXG4gIGRhdGEoc2FvKSB7XG4gICAgLyoqXG4gICAgICogUGFja2FnZSBNYW5hZ2VyXG4gICAgICovXG5cbiAgICBzYW8uYW5zd2Vycy5wbSA9IEJpbmFyeUhlbHBlci5DYW5Vc2VZYXJuKCkgPyBzYW8uYW5zd2Vycy5wbSA6ICducG0nXG5cbiAgICBjb25zdCBwbVJ1biA9IHNhby5hbnN3ZXJzLnBtID09PSAneWFybicgPyAneWFybicgOiAnbnBtIHJ1bidcblxuICAgIC8qKlxuICAgICAqIEV4dGVuZC5qcyBkYXRhXG4gICAgICovXG4gICAgY29uc3QgeyBzb3VyY2VQYXRoIH0gPSBzYW8ub3B0cy5leHRyYXMucGF0aHNcbiAgICBjb25zdCB7IHByb2plY3RUeXBlIH0gPSBzYW8ub3B0cy5leHRyYXNcblxuICAgIGNvbnN0IHBsdWdpbkFuc3dlcnMgPSB7IC4uLnNhby5hbnN3ZXJzIH1cbiAgICBkZWxldGUgcGx1Z2luQW5zd2Vycy5uYW1lXG4gICAgY29uc3Qgc2VsZWN0ZWRQbHVnaW5zID0gZ2V0UGx1Z2luc0FycmF5KHBsdWdpbkFuc3dlcnMpXG4gICAgY29uc3QgZXh0ZW5kRGF0YSA9IGNvbmNhdEV4dGVuZChcbiAgICAgIGV4dGVuZEJhc2UsXG4gICAgICBzZWxlY3RlZFBsdWdpbnMsXG4gICAgICBzb3VyY2VQYXRoLFxuICAgICAgc2FvLmFuc3dlcnNcbiAgICApXG5cbiAgICAvKipcbiAgICAgKiBQbHVnaW5zIG1ldGEgZGF0YVxuICAgICAqL1xuICAgIGNvbnN0IHBsdWdpbnNEYXRhID0gbWVyZ2VQbHVnaW5EYXRhKFxuICAgICAge30sXG4gICAgICBzb3VyY2VQYXRoLFxuICAgICAgc2VsZWN0ZWRQbHVnaW5zLFxuICAgICAgJ21ldGEuanNvbidcbiAgICApLnBsdWdpbnNcblxuICAgIGNvbnN0IG1ldGFKU09OUGF0aCA9XG4gICAgICBwcm9qZWN0VHlwZSA9PT0gJ3JlYWN0JyA/ICdzcmMvbWV0YS5qc29uJyA6ICdwdWJsaWMvbWV0YS5qc29uJ1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuXG4gICAgICovXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNhby5hbnN3ZXJzLFxuICAgICAgcHJvamVjdFR5cGUsXG4gICAgICBhbnN3ZXJzOiBzYW8uYW5zd2VycyxcbiAgICAgIHNlbGVjdGVkUGx1Z2lucyxcbiAgICAgIHBtUnVuLFxuICAgICAgcGx1Z2luc0RhdGEsXG4gICAgICBtZXRhSlNPTlBhdGgsXG4gICAgICAuLi5leHRlbmREYXRhLFxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUnVucyBhZnRlciBtYW5pcHVsYXRpbmcgZGF0YSBpbiB0aGUgZGF0YSBmdW5jdGlvbiBhbmQgZ2V0cyBwYXNzZWQgdGhhdCBtYW5pcHVsYXRlZCBkYXRhXG4gICAqXG4gICAqIEV4ZWN1dGUgZmlsZSBhbmQgZGlyZWN0b3J5IHRyYW5zZm9ybWF0aW9uIGFjdGlvbnNcbiAgICpcbiAgICogYWN0aW9ucyBhcmUgb2JqZWN0cyBjb250YWluaW5nIGEgc2V0IG9mIGluc3RydWN0aW9ucyBvbiBhIHNpbmdsZSB0cmFuc2Zvcm1hdGlvbiBwYXR0ZXJuXG4gICAqXG4gICAqIEFERDpcbiAgICpcbiAgICogTU9WRTpcbiAgICpcbiAgICogTU9ESUZZOlxuICAgKlxuICAgKiBSRU1PVkU6XG4gICAqXG4gICAqIEByZXR1cm5zIGFycmF5IG9mIGFjdGlvbiBvYmplY3RzXG4gICAqL1xuICBhc3luYyBhY3Rpb25zKHNhbykge1xuICAgIGlmIChzYW8uYW5zd2Vycy5uYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZXJyb3IgPSBzYW8uY3JlYXRlRXJyb3IoJ0FwcCBuYW1lIGlzIHJlcXVpcmVkIScpXG4gICAgICB0aHJvdyBlcnJvclxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlIGFwcCBuYW1lXG4gICAgICovXG4gICAgY29uc3QgYXBwTmFtZVZhbGlkYXRpb24gPSB2YWxpZGF0ZShzYW8uYW5zd2Vycy5uYW1lKVxuXG4gICAgaWYgKGFwcE5hbWVWYWxpZGF0aW9uLndhcm5pbmdzKSB7XG4gICAgICBhcHBOYW1lVmFsaWRhdGlvbi53YXJuaW5ncy5mb3JFYWNoKCh3YXJuKSA9PiB0aGlzLmxvZ2dlci53YXJuKHdhcm4pKVxuICAgIH1cblxuICAgIGlmIChhcHBOYW1lVmFsaWRhdGlvbi5lcnJvcnMpIHtcbiAgICAgIGFwcE5hbWVWYWxpZGF0aW9uLmVycm9ycy5mb3JFYWNoKCh3YXJuKSA9PiB0aGlzLmxvZ2dlci5lcnJvcih3YXJuKSlcbiAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgIH1cblxuICAgIGNvbnN0IHsgc291cmNlUGF0aCB9ID0gc2FvLm9wdHMuZXh0cmFzLnBhdGhzXG5cbiAgICBjb25zdCBhY3Rpb25zQXJyYXkgPSBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdhZGQnLFxuICAgICAgICBmaWxlczogJyoqJyxcbiAgICAgICAgdGVtcGxhdGVEaXI6IHBhdGguam9pbihzb3VyY2VQYXRoLCAndGVtcGxhdGUnKSxcbiAgICAgICAgZGF0YSgpIHtcbiAgICAgICAgICByZXR1cm4gc2FvLmRhdGFcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdtb3ZlJyxcbiAgICAgICAgdGVtcGxhdGVEaXI6IHBhdGguam9pbihzb3VyY2VQYXRoLCAndGVtcGxhdGUnKSxcbiAgICAgICAgcGF0dGVybnM6IHtcbiAgICAgICAgICBnaXRpZ25vcmU6ICcuZ2l0aWdub3JlJyxcbiAgICAgICAgICAnX3BhY2thZ2UuanNvbic6ICdwYWNrYWdlLmpzb24nLFxuICAgICAgICAgICdfbmV4dC1lbnYuZC50cyc6ICduZXh0LWVudi5kLnRzJyxcbiAgICAgICAgICAnX3RzY29uZmlnLmpzb24nOiAndHNjb25maWcuanNvbicsXG4gICAgICAgICAgYmFiZWxyYzogJy5iYWJlbHJjJyxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YSgpIHtcbiAgICAgICAgICByZXR1cm4gc2FvLmRhdGFcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSBhcyBBY3Rpb25bXVxuXG4gICAgY29uc3QgcGx1Z2luQW5zd2VycyA9IHsgLi4uc2FvLmFuc3dlcnMgfVxuICAgIGRlbGV0ZSBwbHVnaW5BbnN3ZXJzLm5hbWVcblxuICAgIGNvbnN0IHNlbGVjdGVkUGx1Z2lucyA9IGdldFBsdWdpbnNBcnJheShwbHVnaW5BbnN3ZXJzKVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbiAgICBjb25zdCBzb3VyY2VQcm9tcHRzID0gcmVxdWlyZShwYXRoLnJlc29sdmUoc291cmNlUGF0aCwgJ3Byb21wdC5qcycpKVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKlxuICAgICAqL1xuICAgIGFjdGlvbnNBcnJheS5wdXNoKFxuICAgICAgLi4uc2VsZWN0ZWRQbHVnaW5zLm1hcCgocGx1Z2luOiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgY3VzdG9tRmlsdGVycyA9IGhhbmRsZUlnbm9yZShcbiAgICAgICAgICBzb3VyY2VQcm9tcHRzPy5pZ25vcmVzID8/IFtdLFxuICAgICAgICAgIHNhby5hbnN3ZXJzLFxuICAgICAgICAgIHBsdWdpblxuICAgICAgICApXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnYWRkJyBhcyBjb25zdCxcbiAgICAgICAgICBmaWxlczogJyoqJyxcbiAgICAgICAgICB0ZW1wbGF0ZURpcjogcGF0aC5qb2luKHNvdXJjZVBhdGgsICdwbHVnaW5zJywgcGx1Z2luKSxcbiAgICAgICAgICBmaWx0ZXJzOiB7XG4gICAgICAgICAgICAnZXh0ZW5kLmpzJzogZmFsc2UsXG4gICAgICAgICAgICAncGFja2FnZS5qc29uJzogZmFsc2UsXG4gICAgICAgICAgICAncGFja2FnZS5qcyc6IGZhbHNlLFxuICAgICAgICAgICAgJ3RzY29uZmlnLmpzb24nOiBmYWxzZSxcbiAgICAgICAgICAgICcuYmFiZWxyYyc6IGZhbHNlLFxuICAgICAgICAgICAgJ21ldGEuanNvbic6IGZhbHNlLFxuICAgICAgICAgICAgLi4uY3VzdG9tRmlsdGVycyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGEoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2FvLmRhdGFcbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcblxuICAgIC8qKlxuICAgICAqIGVzbGludHJjIGhhbmRsZXJcbiAgICAgKi9cbiAgICBhY3Rpb25zQXJyYXkucHVzaCh7XG4gICAgICB0eXBlOiAnbW92ZScgYXMgY29uc3QsXG4gICAgICBwYXR0ZXJuczoge1xuICAgICAgICAnXy5lc2xpbnRyYyc6ICcuZXNsaW50cmMnLFxuICAgICAgfSxcbiAgICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiBzYW8uZGF0YVxuICAgICAgfSxcbiAgICB9IGFzIEFjdGlvbilcblxuICAgIC8qKlxuICAgICAqIG1ldGEuanNvbiBoYW5kbGVyXG4gICAgICovXG4gICAgYWN0aW9uc0FycmF5LnB1c2goe1xuICAgICAgdHlwZTogJ21vZGlmeScgYXMgY29uc3QsXG4gICAgICBmaWxlczogc2FvLmRhdGEubWV0YUpTT05QYXRoLFxuICAgICAgaGFuZGxlcihkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikge1xuICAgICAgICByZXR1cm4gbWVyZ2VQbHVnaW5EYXRhKGRhdGEsIHNvdXJjZVBhdGgsIHNlbGVjdGVkUGx1Z2lucywgJ21ldGEuanNvbicpXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBwYWNrYWdlLmpzb24gaGFuZGxlclxuICAgICAqL1xuICAgIGFjdGlvbnNBcnJheS5wdXNoKHtcbiAgICAgIHR5cGU6ICdtb2RpZnknIGFzIGNvbnN0LFxuICAgICAgZmlsZXM6ICdwYWNrYWdlLmpzb24nLFxuICAgICAgaGFuZGxlcihkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikge1xuICAgICAgICByZXR1cm4gbWVyZ2VQYWNrYWdlcyhkYXRhLCBzb3VyY2VQYXRoLCBzZWxlY3RlZFBsdWdpbnMsIHNhby5hbnN3ZXJzKVxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogdHNjb25maWcuanNvbiBoYW5kbGVyXG4gICAgICovXG4gICAgYWN0aW9uc0FycmF5LnB1c2goe1xuICAgICAgdHlwZTogJ21vZGlmeScgYXMgY29uc3QsXG4gICAgICBmaWxlczogJ3RzY29uZmlnLmpzb24nLFxuICAgICAgaGFuZGxlcihkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikge1xuICAgICAgICByZXR1cm4gbWVyZ2VKU09ORmlsZXMoXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBzb3VyY2VQYXRoLFxuICAgICAgICAgIHNlbGVjdGVkUGx1Z2lucyxcbiAgICAgICAgICAndHNjb25maWcuanNvbicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgYXJyYXlNZXJnZTogKGRlc3Q6IHVua25vd25bXSwgc291cmNlOiB1bmtub3duW10pID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgYXJyID0gWy4uLmRlc3QsIC4uLnNvdXJjZV1cbiAgICAgICAgICAgICAgcmV0dXJuIGFyci5maWx0ZXIoKGVsLCBpKSA9PiBhcnIuaW5kZXhPZihlbCkgPT09IGkpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogLmJhYmVscmMgaGFuZGxlclxuICAgICAqL1xuICAgIGFjdGlvbnNBcnJheS5wdXNoKHtcbiAgICAgIHR5cGU6ICdtb2RpZnknIGFzIGNvbnN0LFxuICAgICAgZmlsZXM6ICcuYmFiZWxyYycsXG4gICAgICBhc3luYyBoYW5kbGVyKGRhdGE6IHN0cmluZykge1xuICAgICAgICBjb25zdCBtZXJnZWQgPSBhd2FpdCBtZXJnZUJhYmVsKFxuICAgICAgICAgIEpTT04ucGFyc2UoZGF0YSksXG4gICAgICAgICAgc291cmNlUGF0aCxcbiAgICAgICAgICBzZWxlY3RlZFBsdWdpbnNcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWVyZ2VkKVxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgcmV0dXJuIGFjdGlvbnNBcnJheVxuICB9LFxuXG4gIC8qKlxuICAgKiBSdW5zIGJlZm9yZSBhY3Rpb25zIGFyZSBleGVjdXRlZFxuICAgKi9cbiAgYXN5bmMgcHJlcGFyZSgpIHtcbiAgICB0aXBzLnByZUluc3RhbGwoKVxuICB9LFxuXG4gIC8qKlxuICAgKiBSdW5zIGFmdGVyIGFjdGlvbnMgYXJlIGRvbmUgYmVpbmcgZXhlY3V0ZWRcbiAgICovXG4gIGFzeW5jIGNvbXBsZXRlZChzYW8pIHtcbiAgICBjb25zdCB7IGRlYnVnIH0gPSBzYW8ub3B0cy5leHRyYXNcblxuICAgIC8qKlxuICAgICAqIEdpdCBpbml0IGFuZCBpbnN0YWxsIHBhY2thZ2VzXG4gICAgICovXG4gICAgaWYgKCFkZWJ1Zykge1xuICAgICAgc2FvLmdpdEluaXQoKVxuICAgICAgYXdhaXQgc2FvLm5wbUluc3RhbGwoe1xuICAgICAgICBucG1DbGllbnQ6IHRoaXMuYW5zd2Vycy5wbSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRm9ybWF0IGdlbmVyYXRlZCBwcm9qZWN0XG4gICAgICovXG4gICAgLy8gYXdhaXQgcHJvbWlzaWZ5KGV4ZWMpKGBucHggcHJldHRpZXIgXCIke3Nhby5vdXREaXJ9XCIgLS13cml0ZWApXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gaW5pdGlhbCBjb21taXRcbiAgICAgKi9cbiAgICBpZiAoIWRlYnVnKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBhZGRcbiAgICAgICAgYXdhaXQgcHJvbWlzaWZ5KGV4ZWMpKFxuICAgICAgICAgIGBnaXQgLS1naXQtZGlyPVwiJHtzYW8ub3V0RGlyfVwiLy5naXQvIC0td29yay10cmVlPVwiJHtzYW8ub3V0RGlyfVwiLyBhZGQgLUFgXG4gICAgICAgIClcbiAgICAgICAgLy8gY29tbWl0XG4gICAgICAgIGF3YWl0IHByb21pc2lmeShleGVjKShcbiAgICAgICAgICBgZ2l0IC0tZ2l0LWRpcj1cIiR7c2FvLm91dERpcn1cIi8uZ2l0LyAtLXdvcmstdHJlZT1cIiR7c2FvLm91dERpcn1cIi8gY29tbWl0IC1tIFwiaW5pdGlhbCBjb21taXQgd2l0aCBzdXBlcnN0YWNrXCJgXG4gICAgICAgIClcbiAgICAgICAgc2FvLmxvZ2dlci5pbmZvKCdjcmVhdGVkIGFuIGluaXRpYWwgY29tbWl0LicpXG4gICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnllbGxvd2BBbiBlcnJvciBvY2N1cmVkIHdoaWxlIGNyZWF0aW5nIGdpdCBjb21taXQuYClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IG1lc3NhZ2VzIGFmdGVyIGNvbXBsZXRpb25cbiAgICAgKi9cbiAgICB0aXBzLnBvc3RJbnN0YWxsKHtcbiAgICAgIG5hbWU6IHNhby5vcHRzLmFwcE5hbWUgPz8gJycsXG4gICAgICBkaXI6IHNhby5vdXREaXIsXG4gICAgICBwbTogc2FvLmFuc3dlcnMucG0sXG4gICAgfSlcbiAgfSxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzYW9Db25maWdcbiJdfQ==