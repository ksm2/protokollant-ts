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

// Stringify the new changelog
const newVersion = stringify(changelog)
```
