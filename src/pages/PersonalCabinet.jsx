import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Slider } from "primereact/slider";
import { Dropdown } from "primereact/dropdown";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

import { observer } from "mobx-react-lite";
import Input from "../components/Input";
import { REGEXES } from "../utils/regexes";

import { changePassword, updateUserSettings } from "../api-requests/user-api";

import "../styles/personal-cabinet.css";
import { Context } from "..";
import { LearningMode } from "../utils/learn-settings";

const PersonalCabinet = observer(() => {
  const toast = useRef(null);
  const { userSettings } = useContext(Context);
  const { user } = useContext(Context);

  useEffect(() => {
    setLearningSettings({
      countRepeatWordForLearned: userSettings.getCountRepeatWordForLearned(),
      countRepeatWordsSimultaneously:
        userSettings.getCountRepeatWordsSimultaneously(),
      learningModeWords: userSettings.getLearningModeWords(),
      learningModeTasks: userSettings.getLearningModeTasks(),
    });
  }, [userSettings]);

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Успешно",
      detail: message,
      life: 3000,
    });
  };

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Ошибка",
      detail: message,
      life: 3000,
    });
  };

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    repitNewPassword: "",
  });
  const [isValidPassword, setIsValidPassword] = useState(null);
  const [isValidPasswordRepit, setIsValidPasswordRepit] = useState(null);

  const changePasswordHandler = ({ id, value }) => {
    setPassword((prev) => ({ ...prev, [id]: value }));
    console.log(user.getRoleId());

    if (id === "newPassword") {
      setIsValidPassword(REGEXES.PASSWORD_REGEX.test(value));
      setIsValidPasswordRepit(password.repitNewPassword === value);
    }

    if (id === "repitNewPassword") {
      setIsValidPasswordRepit(password.newPassword === value);
    }
  };

  const changePasswordRequest = async () => {
    try {
      await changePassword(password.oldPassword, password.newPassword);
      setPassword({
        oldPassword: "",
        newPassword: "",
        repitNewPassword: "",
      });
      showSuccess("Пароль изменён");
    } catch (error) {
      showError("Введён неверный текущий пароль");
    }
  };

  const [learningSettings, setLearningSettings] = useState({
    countRepeatWordForLearned: userSettings.getCountRepeatWordForLearned(),
    countRepeatWordsSimultaneously:
      userSettings.getCountRepeatWordsSimultaneously(),
    learningModeWords: userSettings.getLearningModeWords(),
    learningModeTasks: userSettings.getLearningModeTasks(),
  });

  const changeSettingsHandler = (id, value) => {
    if (learningSettings[id] !== value) {
      setLearningSettings((prev) => ({ ...prev, [id]: value }));
    }
  };

  const learningModes = [
    {
      name: "Перевод с английского",
      value: LearningMode.TRANSLATE_FROM_ENGLISH,
    },
    { name: "Перевод с русского", value: LearningMode.TRANSLATE_FROM_RUSSIAN },
    { name: "Комбинированный вариант", value: LearningMode.COMBINED },
  ];

  const updateUserSettingsRequest = async () => {
    try {
      await updateUserSettings(learningSettings);
      userSettings.setUserSettings(learningSettings);
      showSuccess("Настройки обучения обновлены.");
    } catch (error) {
      showError();
    }
  };

  return (
    <div className="container">
      <Toast ref={toast} />
      <div className="account-settings">
        <h4 className="">Обновление данных аккаунта</h4>
        <Input
          id="oldPassword"
          value={password.oldPassword}
          lableText="Текущий пароль"
          isValidValue={true}
          inputType="password"
          setDataHandler={changePasswordHandler}
        />
        <Input
          id="newPassword"
          value={password.newPassword}
          lableText="Новый пароль"
          isValidValue={isValidPassword}
          inputType="password"
          setDataHandler={changePasswordHandler}
          errorMessage="От 4 до 16 символов"
        />
        <Input
          id="repitNewPassword"
          value={password.repitNewPassword}
          lableText="Повторите новый пароль"
          isValidValue={isValidPasswordRepit}
          inputType="password"
          setDataHandler={changePasswordHandler}
          errorMessage="Пароли не совпадают"
        />
        <Button
          className="change-password-button"
          label="Сменить пароль"
          onClick={changePasswordRequest}
          disabled={!isValidPassword || !isValidPasswordRepit}
        />
      </div>
      <div className="learning-settings">
        <h4>Настройки обучения</h4>
        <div className="learning-settings__block">
          <label className="learning-settings__label">
            Количество правильных ответов, следующих подряд, после которого
            слово считается выученным и исключается из списка, но остаётся в
            словаре
          </label>
          <Slider
            className="learning-settings__input"
            value={learningSettings.countRepeatWordForLearned}
            min={2}
            max={10}
            onChange={(e) =>
              changeSettingsHandler("countRepeatWordForLearned", e.value)
            }
          />
          <label>{learningSettings.countRepeatWordForLearned}</label>
        </div>
        <div className="learning-settings__block">
          <label className="learning-settings__label">
            Количество слов изучаемых одновременно
          </label>
          <Slider
            className="learning-settings__input"
            value={learningSettings.countRepeatWordsSimultaneously}
            min={10}
            max={50}
            onChange={(e) =>
              changeSettingsHandler("countRepeatWordsSimultaneously", e.value)
            }
          />
          <label>{learningSettings.countRepeatWordsSimultaneously}</label>
        </div>
        <div className="learning-settings__block">
          <label className="learning-settings__label">
            Способ изучения лексикона
          </label>
          <Dropdown
            value={learningSettings.learningModeWords}
            onChange={(e) =>
              changeSettingsHandler("learningModeWords", e.value)
            }
            options={learningModes}
            optionLabel="name"
            placeholder="Выберите вариант"
            className="w-full"
          />
        </div>
        <div className="learning-settings__block">
          <label className="learning-settings__label">
            Способ изучения грамматики
          </label>
          <Dropdown
            value={learningSettings.learningModeTasks}
            onChange={(e) =>
              changeSettingsHandler("learningModeTasks", e.value)
            }
            options={learningModes}
            optionLabel="name"
            placeholder="Выберите вариант"
            className="w-full"
          />
        </div>
        <Button
          className="update-user-settings-button"
          label="Сохранить"
          onClick={updateUserSettingsRequest}
        />
      </div>
    </div>
  );
});

export default PersonalCabinet;
