import {exec} from 'child_process';

import {isString} from '../common/util';

export {isClean};

/**
 * Asynchrounously determines if the staging area is clean
 */
function isClean(repoPath, done) {
  exec('git diff --no-pager --cached --name-only', {
    maxBuffer: Infinity
  }, function(error, stdout) {
    let stagingIsClean = stdout && isString(stdout) && stdout.trim().length > 0;
    done(stagingIsClean);
  });
}
