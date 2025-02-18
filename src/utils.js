let idCounter = 0;
export const generateId = () => {
  idCounter += 1;
  return idCounter;
};
