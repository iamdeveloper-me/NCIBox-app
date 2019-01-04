(function (global) {
    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            'jw-bootstrap-switch-ng2': 'npm:jw-bootstrap-switch-ng2'
        },
        packages: {
            'jw-bootstrap-switch-ng2': {
                main: './dist/index.js',
                defaultExtension: 'js'
            }
        }
    });
})(this);
