var dash;

dash = null;

module.exports = {
  config: {
    display: {
      type: 'string',
      'default': 'right',
      'enum': ['left', 'right']
    },
    refresh: {
      type: 'integer',
      'default': 60
    }
  },
  activate: function() {
  },
  deactivate: function() {
    if (dash != null) {
      dash.destroy();
    }

    return dash = null;
  },
  consumeStatusBar: function(statusBar) {
    var DashStatusBarView;
    DashStatusBarView = require('./dash-status-bar-view');
    dash = new DashStatusBarView();
    dash.initialize(statusBar);
    return dash.attach();
  }
};
