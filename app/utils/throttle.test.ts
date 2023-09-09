import {sleep} from "./time";
// import {throttle} from '@github/mini-throttle'
import {throttle} from 'throttle-debounce'

describe("throttle-debounce", () => {
  test("can throttle", async () => {
    const a: number[] = []
    function append(i: any) {
      a.push(i)
    }

    /*
     Timeline:
     0     x
     100
     200
     300   x
     400
     500
     600   x
     700
     800
     900   x
     1000
    */

    const pushThrottle = throttle(300, append);

    for (let i = 0; i < 10; i++) {
      pushThrottle(i*100)
      if (i == 0) {
        expect(a.length).toEqual(1)
      }
      await sleep(100)
    }

    console.log('{after} a: ', a);
    expect(a.length).toEqual(4)
  })
})
