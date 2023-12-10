import React, { createContext } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserSettingsStore from "./stores/user-settings-store";
import UserStore from "./stores/user-store";

export const Context = createContext(null);

ReactDOM.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      userSettings: new UserSettingsStore(),
    }}
  >
    <App />
  </Context.Provider>,
  document.getElementById("root")
);
