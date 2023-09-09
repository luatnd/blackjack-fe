// DAO layer (data fetching layer): fetch data from REST, socket, localstorage, ...
// @ts-ignore
import {AuthDAO, AuthDataSource} from "./dao";


describe('Auth dao', () => {
  test('can get/set user to local', async () => {
    const dao = new AuthDAO(AuthDataSource.Local)
    await dao.createUser("test@gmail.com", "111");
    await dao.createUser("test2", "112");

    const u = await dao.getUser("test2", "112");
    expect(u?.id).toBeGreaterThanOrEqual(1)
  })
})
