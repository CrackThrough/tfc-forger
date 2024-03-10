# TFC-Forger

## What is this

Not really meant to be a serious project, I was just too bothered to calculate every single perfect forge recipes for each tier of tools that I wanted to make. It is also terribly inefficient. 1 day 4am projects be like that, I guess.

Please use this responsibly. Do not let this a few lines of code hurt your fun while playing terrafirmacraft.

This was built for 1.18.2, and I suck at optimization so I just hand-calculated and canned the solutions. If your anvil buttons work differently, you're out of luck. Sorry.

I'm not bothering myself to upload this in npm. If you want it on npm for some reason, go ahead and fork it. I have no intent to make this a Minecraft mod, either. Please do not ask me to do so.

## How to use

### CLI

```sh
node cli 80 h -15 2
```

`hammer` can be shortened to `h` only in cli.js.

If you need help, use

```sh
node cli -h
```

## Code examples

### TypeScript

```ts
import { calculate } from "tfc-forger";

const result = calculate({
  // your goal number
  destinationValue: 80,

  // working rules
  criteria: ["hammer", -15, 2],
});

console.log(result);
```

### JavaScript

```js
const { calculate } = require("tfc-forger");

const result = calculate({
  // your goal number
  destinationValue: 80,

  // working rules
  criteria: ["hammer", -15, 2],
});

console.log(result);
```
