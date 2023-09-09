import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import mockRouter from 'next-router-mock';

import Auth from './page'

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('next/navigation', () => require('next-router-mock'));

describe("Auth", () => {
  beforeEach(() => {
    // Mock sessionStorage here 👇
    // Only this config can fix the problem, the other is just trying without result
    // TypeError: Cannot read property '_origin' of null
    //     at Window.get sessionStorage [as localStorage]
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
        removeItem: jest.fn(() => null),
      },
      writable: true,
    });
  });

  test('can input form', async () => {
    await mockRouter.push("/auth");

    // ARRANGE
    render(<Auth />)

    // ACT
    const getEmailInput = () => screen.getByRole('textbox', {name: 'Email Address'})
    await userEvent.type(getEmailInput(), "hello")

    // ASSERT
    expect(getEmailInput()).toHaveValue('hello')
    expect(screen.getByRole('login')).toBeEnabled()
  })

  test('can skip login (as anonymous user)', async () => {
    await mockRouter.push("/auth");
    render(<Auth />)

    await userEvent.click(screen.getByRole('login-ano'))
    expect(mockRouter).toMatchObject({
      asPath: "/",
      pathname: "/",
      query: {},
    });
  })

  test('can login by email and password', async () => {
    await mockRouter.push("/auth");
    render(<Auth />)

    // input email + pw then click login
    await userEvent.type(screen.getByRole('textbox', {name: 'Email Address'}), "hello")
    await userEvent.type(screen.getByRole('pw-field'), "1234")
    await userEvent.click(screen.getByRole('login'))

    // expect to go home
    // expect(mockRouter).toMatchObject({
    //   asPath: "/",
    //   pathname: "/",
    //   query: {},
    // });
    //
    // // expect show user avatar
    // cleanup() // need cleanup dom before render. because render do append.
    // render(<App />) // must render App because we render Auth in prev, not the whole app
    // expect(screen.findByRole('user_avatar')).toBeInTheDocument()
  })

})
