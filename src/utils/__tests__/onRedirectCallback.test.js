import onRedirectCallback from "../onRedirectCallback";
import history from "../history";

describe("onRedirectCallback", () => {
  beforeEach(() => {
    history.push("/");
    jest.spyOn(history, "push");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sends the user back to the page they requested before logging in", () => {
    onRedirectCallback({ returnTo: "/profile" });

    expect(history.push).toHaveBeenCalledWith("/profile");
  });

  it("stays on the current path when there is no appState", () => {
    onRedirectCallback(undefined);

    expect(history.push).toHaveBeenCalledWith(window.location.pathname);
  });

  it("stays on the current path when appState has no returnTo", () => {
    onRedirectCallback({});

    expect(history.push).toHaveBeenCalledWith(window.location.pathname);
  });
});
