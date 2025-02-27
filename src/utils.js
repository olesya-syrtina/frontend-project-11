let idCounter = 0;

export default function generateId() {
  idCounter += 1;
  return idCounter;
}
