import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Input from "../components/Input";
import { registration } from "../api-requests/user-api";
import { ROUTES } from "../utils/urls";
import { REGEXES } from "../utils/regexes";
import { Button } from "primereact/button";

import "../styles/common.css";
import "../styles/registration.css";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";

const Registration = observer(() => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [isValidName, setIsValidName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [registrationDto, setRegistrationDto] = useState({
    email: "",
    name: "",
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

  const changeEmailHandler = ({ id, value }) => {
    setRegistrationDto((prev) => ({ ...prev, [id]: value }));
    setIsValidEmail(REGEXES.EMAIL_REGEX.test(value));
  };

  const changeNameHandler = ({ id, value }) => {
    setRegistrationDto((prev) => ({ ...prev, [id]: value }));
    setIsValidName(REGEXES.NAME_REGEX.test(value));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setIsRegisterDisabled(true);

    try {
      await registration(registrationDto.email, registrationDto.name);
      setShowModal(true);
    } catch (err) {
      if (err.response.status === 409) {
        showError("Такой пользователь уже существует!");
      } else {
        showError("Неверные данные!");
      }

      setIsRegisterDisabled(false);
    }
  };

  return (
    <div className="all-center">
      <Toast ref={toast} />
      <h3 className="label">Регистрация</h3>
      <Input
        className="email-field"
        id="email"
        value={registrationDto.email}
        isValidValue={isValidEmail}
        inputType="email"
        placeholder="Введите email"
        setDataHandler={changeEmailHandler}
        errorMessage="Некорректный email"
      />
      <Input
        id="name"
        className="username-field"
        value={registrationDto.name}
        isValidValue={isValidName}
        inputType="text"
        placeholder="Введите имя"
        setDataHandler={changeNameHandler}
        errorMessage="Минимум 1 символ"
      />
      <div className="register-button">
        <Button
          className="btn-primary"
          label="Зарегистрироваться"
          disabled={!isValidName || !isValidEmail || isRegisterDisabled}
          onClick={handleClick}
        />
      </div>
      <Dialog
        header="Регистрация прошла успешно"
        visible={showModal}
        style={{ width: "50vw" }}
        onHide={() => navigate(ROUTES.LOGIN_ROUTE)}
      >
        <p className="m-0">
          Ваш пароль отправлен на почту {registrationDto.email}. Для первого
          входа в аккаунт используйте его. В настройках аккаунта вы сможете
          изменить пароль.
        </p>
      </Dialog>
    </div>
  );
});

export default Registration;
