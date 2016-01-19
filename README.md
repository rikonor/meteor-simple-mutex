# Simple-Mutex
---

#### Overview
This is a simple implementation of a locking mechanism for a Meteor app.

#### Caveats
It operates under the assumption that there is only one entity performing locking/unlocking operations - this means it should not be relied upon when working with more then one Meteor server.

#### [Demo](http://simple-mutex.meteor.com)

#### Usage

```
Notes = new Meteor.Collection("notes");
Notes.enableMutexes();
```

```
var note = Notes.findOne();

// Locking
note.lock();

// Unlocking
note.unlock();

// Query for acquired lock
note.hasLock();

// Query for locked state
note.isLocked();
```

Default behavior is for clients to `throw` an error when trying to `update` a locked entity. However, it's possible to not enforce the lock explicitly, and rather manage it yourself.

```
Notes.enableMutexes({hardMutex: false});
```

#### Contributions

Discussions / Contributions are welcome.
