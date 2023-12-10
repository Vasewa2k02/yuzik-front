import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from ".";
import { getCurrentUser, getUserSettings } from "./api-requests/user-api";
import { Spinner } from "react-bootstrap";
import { ROLES } from "./utils/roles";

const App = observer(() => {
  const { user } = useContext(Context);
  const { userSettings } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        console.log(data);
        user.setUser(data);
        user.setRoleId(data.roleId);

        if (user.getRoleId() === ROLES.USER) {
          getUserSettings()
            .then((data) => {
              userSettings.setUserSettings(data);
            })
            .finally(() => setLoading(false));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner animation={"grow"} />;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
