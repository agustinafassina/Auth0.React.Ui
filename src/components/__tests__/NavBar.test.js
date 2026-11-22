import React from "react";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NavBar from "../NavBar";
import {
  authenticated,
  createAuth0Value,
  renderWithAuth0,
  testUser,
} from "../../testUtils";

const renderNavBar = (auth0Value) =>
  renderWithAuth0(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
    auth0Value
  );

describe("NavBar - logged out", () => {
  it("shows the login buttons (desktop and mobile)", () => {
    const { container } = renderNavBar();

    expect(container.querySelector("#qsLoginBtn")).toBeInTheDocument();
    expect(container.querySelector("#qsLoginBtnMobile")).toBeInTheDocument();
  });

  it("hides links and user info that require login", () => {
    const { container } = renderNavBar();

    expect(screen.queryByText("External API")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Profile")).not.toBeInTheDocument();
    expect(container.querySelector("#qsLogoutBtn")).not.toBeInTheDocument();
  });

  it("starts the Auth0 redirect login from the desktop button", () => {
    const { container, auth0 } = renderNavBar();

    fireEvent.click(container.querySelector("#qsLoginBtn"));

    expect(auth0.loginWithRedirect).toHaveBeenCalledTimes(1);
  });

  it("starts the Auth0 redirect login from the mobile button", () => {
    const { container, auth0 } = renderNavBar();

    fireEvent.click(container.querySelector("#qsLoginBtnMobile"));

    expect(auth0.loginWithRedirect).toHaveBeenCalledTimes(1);
  });
});

describe("NavBar - logged in", () => {
  it("shows the user's name and picture", () => {
    renderNavBar(authenticated());

    // Rendered once in the desktop dropdown and once in the mobile menu.
    expect(screen.getAllByText(testUser.name)).toHaveLength(2);
    screen
      .getAllByAltText("Profile")
      .forEach((img) => expect(img).toHaveAttribute("src", testUser.picture));
  });

  it("shows the External API link and hides the login buttons", () => {
    const { container } = renderNavBar(authenticated());

    expect(screen.getByText("External API")).toBeInTheDocument();
    expect(container.querySelector("#qsLoginBtn")).not.toBeInTheDocument();
    expect(
      container.querySelector("#qsLoginBtnMobile")
    ).not.toBeInTheDocument();
  });

  it("logs out and returns to the app origin (desktop dropdown)", () => {
    const { container, auth0 } = renderNavBar(authenticated());

    fireEvent.click(container.querySelector("#profileDropDown"));
    fireEvent.click(container.querySelector("#qsLogoutBtn"));

    expect(auth0.logout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin },
    });
  });

  it("logs out and returns to the app origin (mobile menu)", () => {
    const { container, auth0 } = renderNavBar(authenticated());

    fireEvent.click(container.querySelector("#qsLogoutBtnMobile"));

    expect(auth0.logout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin },
    });
  });
});

describe("NavBar - DOM ids", () => {
  it.each([
    ["logged out", createAuth0Value()],
    ["logged in", authenticated()],
  ])("has no duplicate ids when %s", (_, auth0Value) => {
    const { container } = renderNavBar(auth0Value);

    const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
