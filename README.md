Protokollant
============

The _Protokollant_ keeps your changelog easily maintained.
 
Library
-------

You can use Protokollant as a library with native TypeScript support.

Install via Yarn:

    yarn add protokollant

Usage:

```typescript
import fs from 'fs'
import { parse, stringify } from 'protokollant'

// Parse a CHANGELOG.md
const oldVersion = fs.readFileSync('CHANGELOG.md', 'utf8')
const changelog = parse(oldVersion)

// Do some changes ...
changelog.getUnreleased().added('Unicorn farm auto-pet machine')
// Or as a shortcut:
changelog.added('Unicorn farm auto-pet machine')

// Create a new release "14.0.5" from "unreleased" changes
changelog.release('14.0.5')

// Stringify the new changelog
const newVersion = stringify(changelog)
```
