import { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { successToast, errorToast } from "../../toast/toast";
import { api } from "../../services/api";
import { postLogin, iUserLogin } from "../../services/postLogin";
import { postRegister, iRegisterData } from "../../services/postRegister";
import { iAPIData } from "./../../services/getProfile";
import { useContext } from "react";
import { truncate } from "fs";
export const UserContext = createContext<iUserContext>({} as iUserContext);

interface iUserContext {
  user: iAPIData;
  handleLogin: (data: iUserLogin) => void;
  handleRegister: (data: iRegisterData) => void;
  emaiDefault: string;
  setEmailDefault: (state: string) => void;
  isOpenModalLogin: boolean;
  isOpenModalRegister: boolean;
  setIsOpenModalLogin: (value: boolean) => void;
  setIsOpenModalRegister: (value: boolean) => void;
}

interface iUserProvider {
  children: ReactNode;
}

export function UserProvider({ children }: iUserProvider): JSX.Element {
  const [user, setUser] = useState<iAPIData>({} as iAPIData);
  const [emaiDefault, setEmailDefault] = useState<string>("");
  const [isOpenModalLogin, setIsOpenModalLogin] = useState<boolean>(false);
  const [isOpenModalRegister, setIsOpenModalRegister] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (data: iRegisterData) => {
    delete data.confirmPassword;

    try {
      await postRegister(data);

      successToast("Usuário cadastrado!");
      setIsOpenModalRegister(false);
      setIsOpenModalLogin(true);
    } catch (error) {
      errorToast("Ocorreu um erro!");
    }
  };

  const handleLogin = (data: iUserLogin) => {
    postLogin(data)
      .then((response) => {
        successToast("Login realizado!");
        setUser(response.data.user);
        localStorage.setItem("@PortGeek:token", response.data.accessToken);
        localStorage.setItem("@PortGeek:id", response.data.user.id);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        navigate("/dashboard", { replace: true });
        setIsOpenModalLogin(false);
      })
      .catch(() => errorToast("Usuário não encontrado!"));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        handleLogin,
        handleRegister,

        setEmailDefault,
        emaiDefault,
        isOpenModalLogin,
        isOpenModalRegister,
        setIsOpenModalLogin,
        setIsOpenModalRegister,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}