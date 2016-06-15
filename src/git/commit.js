import os from 'os';
import {exec} from 'child_process';

import dedent from 'dedent';
import {isString} from '../common/util';

export { commit };

function onData(data) {
  /* istanbul ignore if */
  if (isString(data)) {
    process.stdout.write(data);
  }
}

function normalizeCommitMessage(message) {
  const signs = os.platform() === 'win32' ?
    /(")/g :
    /(["|`])/g;

  return dedent(message)
    .replace(signs, '\\$1')
    .split(/\r?\n/)
    .map(line => `-m "${line}"`)
    .join(' ');
}

/**
 * Asynchronously git commit at a given path with a message
 */
function commit(sh, repoPath, message, options, done) {
  let args = options.args || '';
  let commitMessage = normalizeCommitMessage(message);

  let childProcess = exec(`git commit ${commitMessage} ${args}`, {
    maxBuffer: Infinity,
    cwd: repoPath
  }, function(error, stdout, stderror) {
    /* istanbul ignore if */
    if (error) {
      console.error(error);
      return done(error);
    }
    done();
  });

  /* istanbul ignore if */
  if (options.quiet === false) {
    childProcess.stdout.on('data', onData);
    childProcess.stderr.on('data', onData);
  }

}
