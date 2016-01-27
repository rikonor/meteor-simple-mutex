# Simple-Mutex
---

#### Overview
This is a simple implementation of a locking mechanism for a Meteor app.

#### Caveats
It operates under the assumption that there is only one entity performing locking/unlocking operations - this means it should not be relied upon when working with more than one Meteor server.

#### Installation

```
meteor add rikonor:simple-mutex
```

#### [Demo](http://simple-mutex.meteor.com)

#### Usage

```
// On Server/Client
Notes = new Meteor.Collection("notes");
Notes.enableMutexes();
```

```
// On Client
var note = Notes.findOne();

// Locking / Unlocking
note.lock();
note.unlock();

// Query lock state
note.hasLock();
note.isLocked();
note.lockTaken();
note.isUnlocked();
```

```
<!-- Template Helpers -->
{{#if hasLock note}}
  I have the lock!
{{/if}}

{{#if lockTaken note}}
  Someone else has the lock!
{{/if}}

{{#if isLocked note}}
  The note is locked!
{{/if}}

{{#if isUnlocked note}}
  The note is not locked!
{{/if}}
```

Default behavior is for clients to `throw` an error when trying to `update` a locked entity. However, it's possible to not enforce the lock explicitly, and rather manage it yourself.

```
Notes.enableMutexes({hardMutex: false});
```

#### Contributions

Discussions / Contributions are welcome.
