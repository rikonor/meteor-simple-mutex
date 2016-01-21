if (Meteor.isServer) {
  Meteor.methods({
    requestLock: function(collName, objId) {
      // Assumes single point of entry to the data
      // This is not guarrenteed to work if there are multiple meteor servers

      var clientId = this.connection.id;
      var coll = Meteor.Collection.get(collName);

      var lockAcquired = coll.update({
        $or: [
          {_id: objId, smLock: {$exists: false}},
          {_id: objId, smLock: {$eq: clientId}}
        ]
      }, {$set: {smLock: clientId}});

      // Remove the lock in case client disconnects
      if (lockAcquired) {
        this.connection.onClose(function() {
          coll.update({_id: objId, smLock: clientId}, {$unset: {smLock: ""}});
        });
      }
    },

    requestUnlock: function(collName, objId) {
      var clientId = this.connection.id;
      var coll = Meteor.Collection.get(collName);

      coll.update({_id: objId, smLock: clientId}, {$unset: {smLock: ""}});
    }
  });
}

Meteor.Collection.prototype.enableMutexes = function(options) {
  options = options || {};
  _.defaults(options, {
    hardMutex: true
  });

  var coll = this;

  coll.helpers({
    lock: function() {
      Meteor.call("requestLock", coll._name, this._id);
    },
    unlock: function() {
      Meteor.call("requestUnlock", coll._name, this._id);
    },
    isLocked: function() {
      // Check whether the lock is active
      return !! this.smLock;
    },
    hasLock: function() {
      // Check whether the lock is acquired
      return this.smLock === Meteor.connection._lastSessionId;
    },
    lockTaken: function() {
      // Check whether the lock is acquired by a different client
      return this.isLocked() && !this.hasLock();
    },
    isUnlocked: function() {
      return !this.isLocked();
    }
  });

  if (options.hardMutex) {
    enableHardMutex(coll);
  }

  registerTemplateHelpers();
};

var enableHardMutex = function(coll) {
  if (Meteor.isClient) {
    var _super = coll.update;

    coll.update = function() {
      // Get the object that is being updated
      var objId = arguments[0]._id;
      var obj = this.findOne(objId);

      if (obj.isLocked() && !obj.hasLock()) {
        throw new Error("Can't update locked object");
      }

      return _super.apply(this, arguments);
    };
  }

  if (Meteor.isServer) {
    coll.allow({
      update: function(userId, doc) {
        // https://groups.google.com/d/msg/meteor-core/LUBfaUtfo7c/_Ueiox0KggkJ
        var currentClient = DDP._CurrentInvocation.get();
        var currentConnectionId = currentClient.connection.id;

        // Allow updating unlocked objects
        if (! doc.smLock) {
          return true;
        }

        return currentConnectionId === doc.smLock;
      }
    });
  }
};

var registerTemplateHelpers = function() {
  if (Meteor.isClient) {
    Template.registerHelper('isLocked', function(obj) {
      return obj.isLocked && obj.isLocked();
    });

    Template.registerHelper('hasLock', function(obj) {
      return obj.hasLock && obj.hasLock();
    });

    Template.registerHelper('lockTaken', function(obj) {
      return obj.lockTaken && obj.lockTaken();
    });

    Template.registerHelper('isUnlocked', function(obj) {
      return obj.isUnlocked && obj.isUnlocked();
    });
  }
};
