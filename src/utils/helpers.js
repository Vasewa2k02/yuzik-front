export const validateDto = (dto, regexes, setFunction) => {
  let isDtoValid = true;

  for (let prop in dto) {
    if (regexes[prop] === undefined || regexes[prop].test(dto[prop])) {
      setFunction((prev) => ({ ...prev, [prop]: true }));
    } else {
      setFunction((prev) => ({ ...prev, [prop]: false }));
      isDtoValid = false;
    }
  }

  return isDtoValid;
};
