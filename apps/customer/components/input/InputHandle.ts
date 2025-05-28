

export const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.replace(/\D/g, ''); // chỉ giữ số
};

export const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.replace(/\s/g, ''); // xóa khoảng trắng
};

export const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // chỉ giữ số
};

export const handleUsernameInput =(e : React.ChangeEvent<HTMLInputElement>)=>{
  e.target.value = e.target.value.replace(/\d/g,'');
}