type StateDependencies<T> = Array<{
  dependencies: Array<keyof T>,
  setState: () => void,
}>;

export {
  // eslint-disable-next-line import/prefer-default-export
  StateDependencies,
};
