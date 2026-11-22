import history from "./history";

// Called by Auth0Provider after the user comes back from the Auth0 login page.
// Sends the user to the page they originally requested (appState.returnTo),
// or keeps them on the current path.
const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

export default onRedirectCallback;
