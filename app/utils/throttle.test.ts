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
     200   x
     300
     400
     500   x
     600
     700
     800   x
     900   x // fire the last event
    */

    const pushThrottle = throttle(300, append);

    for (let i = 0; i < 10; i++) {
      pushThrottle(i*100)
      if (i == 0) {
        expect(a.length).toEqual(1)
      }
      await sleep(100)
    }

    await sleep(1000);

    console.log('{after} a: ', a);
    expect(a.length).toEqual(5)
  })


  test("can throttle ignore last event", async () => {
    const a: number[] = []
    function append(i: any) {
      a.push(i)
    }

    const pushThrottle = throttle(300, append, {
      noTrailing: true
    });

    for (let i = 0; i < 10; i++) {
      pushThrottle(i*100)
      if (i == 0) {
        expect(a.length).toEqual(1)
      }
      await sleep(100)
    }

    await sleep(1000);

    console.log('{after} a: ', a);
    expect(a.length).toEqual(4)
  })

  test("can throttle with async fn", async () => {
    const a: number[] = []
    async function append(i: any) {
      a.push(i)
    }

    const pushThrottle = throttle(300, append, {
      noTrailing: true
    });

    for (let i = 0; i < 10; i++) {
      pushThrottle(i*100)
      if (i == 0) {
        expect(a.length).toEqual(1)
      }
      await sleep(100)
    }

    await sleep(1000);

    console.log('{after} a: ', a);
    expect(a.length).toEqual(4)
  })

  test("will not work with return fn", async () => {
    const a: number[] = []
    async function append(i: any): Promise<number> {
      a.push(i)
      return i
    }

    const pushThrottle = throttle(300, append, {
      noTrailing: true
    });

    let thisWillNotHaveValue;
    for (let i = 0; i < 10; i++) {
      thisWillNotHaveValue = await pushThrottle(i*100);
      if (i == 0) {
        expect(a.length).toEqual(1)
      }
      await sleep(100)
    }

    await sleep(1000);

    console.log('{after} a: ', a);
    expect(a.length).toEqual(4)
    expect(thisWillNotHaveValue).toBeFalsy()
  })
})
