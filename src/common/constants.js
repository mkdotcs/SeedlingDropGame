/* eslint-disable max-len */
import appConfig from '../config/appConfig';

const globalCommands = {
  drop: [],
};

const modCommands = {
  'trail, tr': ['0', '1', '2', '3', '4', '5', '6', '7'],
  'laser, ls': ['bounce', 'destroy'],
  'target, tg': ['show', 'auto', 'hide', 'move', 'float'],
  'leaderboard, lb': ['show', 'auto', 'hide'],
  getOptions(searchKey) {
    if (searchKey in this) {
      return this[searchKey];
    }
    const result = Object.entries(this).find(([key]) => new RegExp(`\\W${searchKey},`).test(`,${key},`));
    return result ? result[1] : undefined;
  },
};

const laserCollisions = {
  bounce: 0,
  destroy: 1,
};

const showStatus = {
  show: 0,
  auto: 1,
  hide: 2,
};

const keyboardShortcuts = {
  D: { description: 'Random drop' },
  L: { description: 'Fire laser beam' },
  C: { description: 'Clear leaderboard' },
  R: { description: 'Remove all seedlings' },
  A: {
    description: 'Drop trail',
    options: ['None', 'Random', 'Image', 'Multi', 'Red', 'Blue', 'Green', 'Yellow'],
    currentValue: appConfig.drop.trail ?? 1,
    get current() { return this.options[this.currentValue]; },
    set current(value) { this.currentValue = value; },
  },
  S: {
    description: 'Laser collision',
    options: ['Bounce', 'Destroy'],
    currentValue: appConfig.laserCollision ?? 0,
    get current() { return this.options[this.currentValue]; },
    set current(value) { this.currentValue = value; },
  },
  T: {
    description: 'Target',
    options: ['Show', 'Auto', 'Hide'],
    currentValue: appConfig.target.status ?? showStatus.show,
    get current() { return this.options[this.currentValue]; },
    set current(value) { this.currentValue = value; },
  },
  M: {
    description: 'Move target',
    options: ['NO', 'YES'],
    currentValue: +(appConfig.target.move ?? false),
    get current() { return this.options[this.currentValue]; },
    set current(value) { this.currentValue = value; },
  },
  F: {
    description: 'Float target',
    options: ['NO', 'YES'],
    currentValue: +(appConfig.target.float ?? true),
    get current() { return this.options[this.currentValue]; },
    set current(value) { this.currentValue = value; },
  },
  B: {
    description: 'Leaderboard',
    options: ['Show', 'Auto', 'Hide'],
    currentValue: appConfig.leaderBoard.status ?? showStatus.show,
    get current() { return this.options[this.currentValue]; },
    set current(value) { this.currentValue = value; },
  },
};

export {
  globalCommands,
  modCommands,
  laserCollisions,
  showStatus,
  keyboardShortcuts,
};
