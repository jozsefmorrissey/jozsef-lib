  const shell = require('shelljs');
  const fs = require('fs');
  const gulp = require('gulp');

  function buildModString() {
    // create your angular module and do stuff
    let prefix='';

    const jsFiles = shell.find('./src/').filter((filename) => {return filename.match(/.*src\/.*\/.*\.js/)});

    let modString = '';
    const fileReg = /^.*src\/(.*)\/(.*)\.js$/;
    for (let tIndex = 0; tIndex < jsFiles.length; tIndex += 1) {
      const filename = jsFiles[tIndex];
      const type = filename.replace(fileReg, '$1');
      const identifier = filename.replace(fileReg, '$2');
      console.log(`\tconst ${identifier} = require('./src/${type}/${identifier}').${identifier}`);
      modString += `\tmod.${type}('${prefix}${identifier}', ${identifier})\n`;
    }

    return modString;
  }

  const replace = '// Generated Code ';
  const repStart = `${replace}Start`;
  const repEnd = `${replace}End`;
  const newLineHolder = '%%%___newLine___%%%'
  const modString = buildModString();

  let contents = fs.readFileSync('./src/index.js', 'utf8');
  let updated = contents
      .replace(/\n/g, newLineHolder)
      .replace(new RegExp(`\\s*${repStart}.*${repEnd}`), `\t${repStart}\n${modString}\t${repEnd}`)
      .replace(new RegExp(newLineHolder, 'g'), '\n')

  fs.writeFileSync('./src/index.js', updated);




  gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
  });
