export const validateLogin = ({ email, password }) => {
  let errors = {};
  let hasError = false;

  if (!email) {
    errors.email = "Vui lòng nhập tên đăng nhập!";
    hasError = true;
  } else if (!email.match(/^\S+@\S+\.\S+$/)) {
    errors.email = "Email không hợp lệ.";
    hasError = true;
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu!";
    hasError = true;
  } else if (password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    hasError = true;
  }

  return { errors, hasError };
};
