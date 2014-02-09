Router.map(function() {
    this.route('home', {
        path:'/',
        layoutTemplate:'base'
    });
    this.route('testEditor', {
        path:'/testEditor',
        layoutTemplate:'base',
    });
    this.route('editor', {
        path:'/editor/:show_route/:episode',
        layoutTemplate:'base',
//         waitOn: function() {
//         },
//         data: function() {
//         }
    });
    this.route('viewer', {
        path:'/view/',
        layoutTemplate:'base',
        waitOn: function() {
        },
        data: function() {
        }
    });
});
