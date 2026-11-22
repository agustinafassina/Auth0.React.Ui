import React from "react";
import { render } from "@testing-library/react";
import { Auth0Context } from "@auth0/auth0-react";

export const testUser = {
  name: "Test User",
  email: "test@user.com",
  picture: "https://avatar.example.com/test.png",
};

// Builds a fake Auth0 context value. Both `useAuth0()` and the real
// `withAuthenticationRequired()` read from Auth0Context, so providing it lets
// us test the login flow without hitting Auth0.
export const createAuth0Value = (overrides = {}) => ({
  isLoading: false,
  isAuthenticated: false,
  user: undefined,
  error: undefined,
  loginWithRedirect: jest.fn(() => Promise.resolve()),
  loginWithPopup: jest.fn(() => Promise.resolve()),
  logout: jest.fn(() => Promise.resolve()),
  getAccessTokenSilently: jest.fn(() => Promise.resolve("access-token")),
  getAccessTokenWithPopup: jest.fn(() => Promise.resolve("access-token")),
  getIdTokenClaims: jest.fn(() => Promise.resolve(undefined)),
  handleRedirectCallback: jest.fn(() => Promise.resolve({})),
  ...overrides,
});

export const authenticated = (overrides = {}) =>
  createAuth0Value({ isAuthenticated: true, user: testUser, ...overrides });

export const renderWithAuth0 = (ui, auth0Value = createAuth0Value()) => ({
  auth0: auth0Value,
  ...render(
    <Auth0Context.Provider value={auth0Value}>{ui}</Auth0Context.Provider>
  ),
});
