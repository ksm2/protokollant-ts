Protokollant
============

![Node.js CI](https://github.com/ksm2/protokollant/workflows/Node.js%20CI/badge.svg)

The _Protokollant_ keeps your changelog easily maintained.
 
Library
-------

You can use Protokollant as a library with native TypeScript support.

Install via Yarn:

    yarn add protokollant

Usage:

```typescript
import fs from 'fs'
import { parseChangelog, printChangelog } from 'protokollant'

// Parse a CHANGELOG.md
const oldVersion = fs.readFileSync('CHANGELOG.md', 'utf8')
const changelog = parseChangelog(oldVersion)

// Do some changes ...
changelog.getUnreleased().added('Unicorn farm auto-pet machine')
// Or as a shortcut:
changelog.added('Unicorn farm auto-pet machine')

// Create a new release "14.0.5" from "unreleased" changes
changelog.release('14.0.5')

// Print the new changelog
const newVersion = printChangelog(changelog)
```

CLI
---

You can also use _Protokollant_ as a CLI tool.

To achieve the same as the code above:

    protokollant added Unicorn farm auto-pet machine
    
Quotes are optional, but if you use special chars, you should add them.

You specify the CHANGELOG.md file as follows (default is looking for `CHANGELOG.md` in the current directory):

    protokollant --changelog MY_CHANGED_FILES.md added ...

The following commands create new entries:

* `protokollant changed ...`  adds a new unreleased change.
* `protokollant added ...`    adds a new unreleased addition.
* `protokollant fixed ...`    adds a new unreleased fix.
* `protokollant removed ...`  adds a new unreleased removal.

You can also release using the command line:

    protokollant release 14.0.5
