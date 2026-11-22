import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";
import history from "./utils/history";
import {
  authenticated,
  createAuth0Value,
  renderWithAuth0,
  testUser,
} from "./testUtils";

jest.mock("./config", () => ({
  getConfig: () => ({
    domain: "test-domain.com",
    clientId: "123",
    audience: "test-audience",
  }),
}));

describe("App", () => {
  beforeEach(() => {
    history.push("/");
  });

  it("renders without crashing", () => {
    render(<App />);
  });

  it("shows the loading spinner while Auth0 is initializing", () => {
    renderWithAuth0(<App />, createAuth0Value({ isLoading: true }));

    expect(screen.getByAltText("Loading")).toBeInTheDocument();
    expect(screen.queryByText("Log in")).not.toBeInTheDocument();
  });

  it("shows the Auth0 error message when login fails", () => {
    renderWithAuth0(
      <App />,
      createAuth0Value({ error: new Error("Invalid state") })
    );

    expect(screen.getByText("Oops... Invalid state")).toBeInTheDocument();
  });

  it("does not redirect to login on the public home page", () => {
    const { auth0 } = renderWithAuth0(<App />);

    expect(auth0.loginWithRedirect).not.toHaveBeenCalled();
  });

  describe.each(["/profile", "/external-api"])(
    "protected route %s",
    (path) => {
      it("redirects to Auth0 login and remembers where to return", async () => {
        history.push(path);

        const { auth0 } = renderWithAuth0(<App />);

        await waitFor(() =>
          expect(auth0.loginWithRedirect).toHaveBeenCalledWith(
            expect.objectContaining({
              appState: expect.objectContaining({ returnTo: path }),
            })
          )
        );
      });

      it("renders the page without redirecting when logged in", () => {
        history.push(path);

        const { auth0 } = renderWithAuth0(<App />, authenticated());

        expect(auth0.loginWithRedirect).not.toHaveBeenCalled();
        expect(screen.queryByAltText("Loading")).not.toBeInTheDocument();
      });
    }
  );

  it("shows the user's profile data on /profile when logged in", () => {
    history.push("/profile");

    renderWithAuth0(<App />, authenticated());

    expect(screen.getAllByText(testUser.email).length).toBeGreaterThan(0);
  });
});
