var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node,
    apinode;

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
    if (node) node.kill()
    node = spawn('node', ['./app.js'], { stdio: 'inherit' })
    node.on('close', function(code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
})

// FIXME: figure out a nice way to start the API server alongside with the main
// /**
//  * $ gulp api
//  * description: launch the api server. 
//  * If there's a server already running, kill it.
//  */
// gulp.task('api', function() {
//     if (apinode) apinode.kill()
//     apinode = spawn('node', ['./wordeu-api/server.js'])
//     apinode.on('close', function(code) {
//         if (code === 8) {
//             gulp.log('Error detected, waiting for changes...');
//         }
//     });
// })

/**
 * $ gulp go
 * description: start the development environment
 */
gulp.task('go', function() {
    gulp.run('server');
    // TODO: figure out how to start the api server in one call
    // gulp.run('api');
    
    gulp.watch(['./**/*.js', './app.js'], function() {
        if (node) node.kill()
        gulp.run('server')
    });

    // Need to watch for sass changes too? Just add another watch call!
    // no more messing around with grunt-concurrent or the like. Gulp is
    // async by default.
})

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
})