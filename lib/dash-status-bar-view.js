var DashStatusBarView, CompositeDisposable, DashPrice, subscriptions,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DashPrice = require('./dash-price');

CompositeDisposable = require('atom').CompositeDisposable;

subscriptions = new CompositeDisposable;

DashStatusBarView = (function(superClass) {
  extend(DashStatusBarView, superClass);

  function DashStatusBarView() {
    this.build = bind(this.build, this);
    return DashStatusBarView.__super__.constructor.apply(this, arguments);
  }

  DashStatusBarView.prototype.initialize = function(statusBar) {
    this.statusBar = statusBar;
    subscriptions.add(atom.commands.add('atom-workspace', {
      'dash-status-bar:toggle': (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this)
    }));
    subscriptions.add(atom.commands.add('atom-workspace', {
      'dash-status-bar:refresh': (function(_this) {
        return function() {
          return _this.build();
        };
      })(this)
    }));
    this.observeDisplay = atom.config.observe('dash-status-bar.display', (function(_this) {
      return function(newValue, previous) {
        return _this.build();
      };
    })(this));
    return this.initEls();
  };

  DashStatusBarView.prototype.initEls = function() {
    this.classList.add('dash-box', 'inline-block');
    this.setAttribute('id', 'dash-status-bar');
    this.one_into_usd = document.createElement('span');
    this.one_into_usd.textContent = 'Đ1 = $';
    this.usd_price = document.createElement('span');
    this.appendChild(this.one_into_usd);
    this.appendChild(this.usd_price);

    return this;
  };

  DashStatusBarView.prototype.attach = function() {
    var minutes, refresh;
    this.build();
    minutes = atom.config.get('dash-status-bar.refresh');
    if (minutes > 0) {
      refresh = minutes * 60 * 1000;
      return setInterval(((function(_this) {
        return function() {
          return _this.build();
        };
      })(this)), refresh);
    }
  };

  DashStatusBarView.prototype.toggle = function() {
    if (this.hasParent()) {
      return this.detach();
    } else {
      return this.attach();
    }
  };

  DashStatusBarView.prototype.hasParent = function() {
    var bar, has;
    has = false;
    bar = document.getElementsByTagName('dash-status-bar');

    return has;
  };

  DashStatusBarView.prototype.detach = function() {
    var bar, el, parent;
    bar = document.getElementsByTagName('dash-status-bar');
    if (bar !== null) {
      if (bar.item() !== null) {
        el = bar[0];
        parent = el.parentNode;
        if (parent !== null) {
          return parent.removeChild(el);
        }
      }
    }
  };

  DashStatusBarView.prototype.destroy = function() {
    var ref;
    if ((ref = this.tile) != null) {
      ref.destroy();
    }
    return this.detach();
  };

  DashStatusBarView.prototype.build = function() {
    return DashPrice((function(_this) {
      return function(coin) {
        _this.usd_price.textContent = coin;

        if (atom.config.get('dash-status-bar.display') === 'left') {
          _this.tile = _this.statusBar.addLeftTile({
            priority: 100,
            item: _this
          });
        } else {
          _this.tile = _this.statusBar.addRightTile({
            priority: 100,
            item: _this
          });
        }
      };
    })(this));
  };

  return DashStatusBarView;

})(HTMLDivElement);

module.exports = document.registerElement('dash-status-bar', {
  prototype: DashStatusBarView.prototype
});
