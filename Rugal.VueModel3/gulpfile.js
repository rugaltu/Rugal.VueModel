/// <binding BeforeBuild='clean, copy-lib' />
const gulp = require('gulp');

const SourceRoot = 'node_modules';
const TargetRoot = 'wwwroot/npm';

const SourcePaths = {
    vue: 'vue/dist/*',
};

let AllSource = [];
let Keys = Object.keys(SourcePaths);
for (let i = 0; i < Keys.length; i++) {
    let Key = Keys[i];
    let Path = SourcePaths[Key];
    let Source = `${SourceRoot}/${Path}`;
    let Target = `${TargetRoot}/${Key}`;
    AllSource.push({
        Key,
        Source,
        Target,
    });
}

gulp.task('clean', function () {
    return del.deleteAsync(`${TargetRoot}`, { force: true });
});

let Tasks = AllSource.map(Item => {
    gulp.task(Item.Key, done => {
        gulp.src(Item.Source)
            .pipe(gulp.dest(Item.Target));
        done();
    });
    return Item.Key;
});

gulp.task('copy-lib', gulp.parallel(Tasks));