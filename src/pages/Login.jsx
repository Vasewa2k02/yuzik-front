import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Input from "../components/Input";
import { Context } from "../index";
import { getUserSettings, login } from "../api-requests/user-api";
import { ROUTES } from "../utils/urls";
import { REGEXES } from "../utils/regexes";
import { Button } from "react-bootstrap";

import "../styles/common.css";
import "../styles/login.css";
import { ROLES } from "../utils/roles";
import { Toast } from "primereact/toast";

const Login = observer(() => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const { userSettings } = useContext(Context);
  const [loginDto, setLoginDto] = useState({
    email: "",
    password: "",
  });

  const showError = (message, summary, life) => {
    toast.current.show({
      severity: "error",
      summary: summary || "Ошибка",
      detail:
        message || "Вы ввели неверные данные или данные на странице устарели",
      life: life || 3000,
    });
  };

  const changeCredentialsHandler = ({ id, value }) => {
    setLoginDto((prev) => ({ ...prev, [id]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!REGEXES.EMAIL_REGEX.test(loginDto.email)) {
      showError("Неверные данные");
      return;
    }

    try {
      const data = await login(loginDto.email, loginDto.password);
      user.setUser(data);
      user.setRoleId(data.roleId);

      if (user.getRoleId() === ROLES.USER) {
        const _userSettings = await getUserSettings();
        userSettings.setUserSettings(_userSettings);
        navigate(ROUTES.STATISTICS_ROUTE);
      } else {
        navigate(ROUTES.DICTIONARY_ROUTE);
      }
    } catch (err) {
      showError("Неверные данные");
    }
  };

  return (
    <div className="all-center">
      <Toast ref={toast} />
      <h3 className="label">Авторизация</h3>
      <Input
        id="email"
        value={loginDto.email}
        inputType="email"
        placeholder="Введите email"
        setDataHandler={changeCredentialsHandler}
        isValidValue={true}
      />
      <Input
        id="password"
        className="password-field"
        value={loginDto.password}
        inputType="password"
        placeholder="Введите пароль"
        setDataHandler={changeCredentialsHandler}
        isValidValue={true}
      />
      <div className="login-button">
        <Button type="submit" onClick={handleClick}>
          Войти
        </Button>
      </div>
    </div>
  );
});

export default Login;
