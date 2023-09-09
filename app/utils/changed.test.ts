import {sleep} from "./time";
import {hasChanged} from "./changed";

describe("changed.ts", () => {
  test("should changed", async () => {
    const a = [1,2,3]
    expect(hasChanged('test1', a)).toEqual(true)
    expect(hasChanged('test1', a)).toEqual(false)

    const b = [...a]
    b[0] += 1
    expect(hasChanged('test1', b)).toEqual(true)
  })

  test("flow should work", async () => {
    const a = [1,2,3]
    const a2 = [1,2,3]

    // first time should be true
    expect(hasChanged('t21', a)).toEqual(true)
    expect(hasChanged('t22', a2)).toEqual(true)

    // next should be false
    expect(hasChanged('t21', a)).toEqual(false)
    expect(hasChanged('t22', a2)).toEqual(false)

    // next should be false
    await sleep(100)
    expect(hasChanged('t21', a)).toEqual(false)
    expect(hasChanged('t22', a2)).toEqual(false)

    const b = [...a]
    b[0] += 1
    // changed only a
    expect(hasChanged('t21', b, 1000)).toEqual(true)
    expect(hasChanged('t22', a2, 1000)).toEqual(false)

    // next should be false
    expect(hasChanged('t21', b, 1000)).toEqual(false)

    await sleep(1200)

    // expired should be true
    expect(hasChanged('t21', b)).toEqual(true)
    expect(hasChanged('t22', a2)).toEqual(true)
  })
})
