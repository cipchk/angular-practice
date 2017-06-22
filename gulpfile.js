let gulp = require('gulp');
let through = require('through2');
let clean = require('gulp-clean');
let gulpSequence = require('gulp-sequence');

let regexReplace = function() {
    return through.obj(function(file, enc, callback) {
        if (!('contents' in file)) {
            this.push(file);
            return callback();
        } else if (file.isNull()) {
            this.push(file);
            return callback();
        } else if (file.isStream()) {
            throw new Error('streams not implemented');
        } else if (file.isBuffer()) {
            let contents = String(file.contents);
            contents = convertString(contents);
            file.contents = new Buffer(contents);
        }
        this.push(file);
        return callback();
    });
}

function convertString(input) {
    if (input.indexOf('{{') === -1) return input;
    // DEMO代码
    input = input.replace(/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/gm, (match) => {
        let _tmp = ~match.indexOf('{{') ? `{% raw %}\r\n ${match} \r\n{% endraw %}` : match;
        return _tmp;
    });
    // code
    return input.replace(/`[ {}\w\d]+`/gm, (match) => {
        let _tmp = ~match.indexOf('{{') ? `{% raw %}${match}{% endraw %}` : match;
        return _tmp;
    });
}

gulp.task('clean', () => {
    return gulp.src('_dist', { read: false })
        .pipe(clean());
});

gulp.task('copy', () => {
    return gulp.src(['book.json', '_images/**'], { base: '/angular-practice' })
        .pipe(gulp.dest('_dist'));
});

gulp.task('gitbook', () => {
    return gulp.src(['**/*.md', '!node_modules/**', '!_dist/**'], { base: '/angular-practice' })
        .pipe(regexReplace())
        .pipe(gulp.dest('_dist'));
});

gulp.task('default', gulpSequence('clean', 'gitbook', 'copy'));