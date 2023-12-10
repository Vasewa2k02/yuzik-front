import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { userRoutes, publicRoutes, adminRoutes } from "../routes";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { ROLES } from "../utils/roles";

const AppRouter = observer(() => {
  const { user } = useContext(Context);

  return (
    <Routes>
      {user.getRoleId() === ROLES.USER &&
        userRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {user.getRoleId() === ROLES.ADMIN &&
        adminRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
});

export default AppRouter;
