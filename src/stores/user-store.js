import { makeAutoObservable } from "mobx";

export default class UserStore {
  constructor() {
    this._userRoleId = 0;
    this._user = {};
    makeAutoObservable(this);
  }

  setRoleId(roleId) {
    this._userRoleId = roleId;
  }

  setUser(user) {
    this._user = user;
  }

  getRoleId() {
    return this._userRoleId;
  }

  getUser() {
    return this._user;
  }
}
