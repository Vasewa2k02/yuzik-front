import { makeAutoObservable } from "mobx";

export default class UserSettingsStore {
  constructor() {
    makeAutoObservable(this);
  }

  setUserSettings(userSettings) {
    this._countRepeatWordForLearned = userSettings.countRepeatWordForLearned;
    this._countRepeatWordsSimultaneously =
      userSettings.countRepeatWordsSimultaneously;
    this._learningModeWords = userSettings.learningModeWords;
    this._learningModeTasks = userSettings.learningModeTasks;
  }

  getCountRepeatWordForLearned() {
    return this._countRepeatWordForLearned;
  }

  getCountRepeatWordsSimultaneously() {
    return this._countRepeatWordsSimultaneously;
  }

  getLearningModeWords() {
    return this._learningModeWords;
  }

  getLearningModeTasks() {
    return this._learningModeTasks;
  }
}
