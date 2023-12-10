import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Menubar } from "primereact/menubar";

import { Context } from "../index";
import { ROUTES } from "../utils/urls";
import { ROLES } from "../utils/roles";
import { logout } from "../api-requests/user-api";
import "../styles/navbar.css";

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const dictionariesItem = {
    label: "Словари и слова",
    icon: "pi pi-fw pi-file",
    items: [
      {
        label: "Изменить",
        icon: "pi pi-fw pi-file-edit",
        command: () => {
          navigate(ROUTES.DICTIONARY_ROUTE);
        },
      },
      {
        label: "Просмотреть",
        icon: "pi pi-fw pi-file-pdf",
        command: () => {
          navigate(ROUTES.DICTIONARY_REVIEW_ROUTE);
        },
      },
      {
        label: "Учить",
        icon: "pi pi-fw pi-file-word",
        command: () => {
          navigate(ROUTES.LEXICON_PROGRESS_ROUTE);
        },
      },
    ],
  };

  const lessonLearnItem = {
    label: "Уроки",
    icon: "pi pi-fw pi-pencil",
    command: () => {
      navigate(ROUTES.GRAMMAR_PROGRESS_ROUTE);
    },
  };

  const adminDictionariesItem = {
    label: "Словари",
    icon: "pi pi-fw pi-file-edit",
    command: () => {
      navigate(ROUTES.DICTIONARY_ROUTE);
    },
  };

  const adminLessonsItem = {
    label: "Уроки",
    icon: "pi pi-fw pi-pencil",
    command: () => {
      navigate(ROUTES.LESSON_ADMIN_ROUTE);
    },
  };

  const personalCabinetItem = {
    label: "Личный кабинет",
    icon: "pi pi-fw pi-user",
    command: () => {
      navigate(ROUTES.PERSONAL_CABINET_ROUTE);
    },
  };

  const statisticsItem = {
    label: "Статистика",
    icon: "pi pi-fw pi-chart-bar",
    command: () => {
      navigate(ROUTES.STATISTICS_ROUTE);
    },
  };

  const loginItem = {
    label: "Войти",
    icon: "pi pi-fw pi-sign-in",
    command: () => {
      navigate(ROUTES.LOGIN_ROUTE);
    },
  };

  const registerItem = {
    label: "Создать аккаунт",
    icon: "pi pi-fw pi-user-plus",
    command: () => {
      navigate(ROUTES.REGISTRATION_ROUTE);
    },
  };

  const logoutItem = {
    label: "Сменить аккаунт",
    icon: "pi pi-fw pi-sign-out",
    command: async () => {
      user.setUser({});
      user.setRoleId(ROLES.UNAUTHORIZED);
      await logout();
      navigate(ROUTES.LOGIN_ROUTE);
    },
  };

  return (
    <div>
      <Menubar
        className="navbar"
        model={
          user.getRoleId() === ROLES.USER
            ? [
                personalCabinetItem,
                statisticsItem,
                dictionariesItem,
                lessonLearnItem,
                logoutItem,
              ]
            : user.getRoleId() === ROLES.ADMIN
            ? [adminDictionariesItem, adminLessonsItem, logoutItem]
            : [registerItem, loginItem]
        }
      />
    </div>
  );
});

export default NavBar;
