export const getInputHandler = (type: string) => {
  switch (type) {
    case "phone":
      return (value: string) => value.replace(/[^0-9]/g, "");
    case "name":
      return (value: string) => value.replace(/\d/g, "");
    default:
      return (value: string) => value;
  }
};