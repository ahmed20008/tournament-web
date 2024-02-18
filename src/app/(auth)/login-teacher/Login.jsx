"use client";
import buttonStyles from "@/assets/css/buttons.module.css";
import formStyles from "@/assets/css/form-elements.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CircularProgress from "@/components/CircularProgress";
import eyeIcon from "@/assets/images/eye.svg";
import eyeSlashIcon from "@/assets/images/eye-slash.svg";

const Login = () => {
  const router = useRouter();

  const initialState = {
    email: "",
    password: "",
  };
  const [passwordState, setPasswordState] = useState(true);
  const [credentials, setCredentials] = useState(initialState);
  const [processing, setProcessing] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setProcessing(true);
  }

  return (
    <form className="w-100" onSubmit={handleLogin}>
      <div className="mb-2 mt-5">
        <input
          required
          className={`${formStyles.inputFieldWhite}`}
          id="email"
          aria-label="email"
          type="email"
          placeholder="Email or Id"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <div className={`${formStyles.passwordFieldWhite}`}>
          <input
            required
            type={passwordState ? "password" : "text"}
            id="login-password"
            aria-label="login-password"
            placeholder="Password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <Image onClick={() => setPasswordState(!passwordState)} width={22} height={22} src={!passwordState ? eyeIcon : eyeSlashIcon} alt={!passwordState ? "show password" : "hide password"} />
        </div>
      </div>
      <button disabled={processing ? true : false} type="submit" className={`${buttonStyles.buttonDarkPink} mt-3`}>
        {!processing ? "Login" : <CircularProgress width={22} height={22} />}
      </button>
    </form>
  )
}
export default Login; 