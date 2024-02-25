"use client";
import buttonStyles from "@/assets/css/buttons.module.css";
import formStyles from "@/assets/css/form-elements.module.css";
import { useState } from "react";
import CircularProgress from "@/components/CircularProgress";
import { doc, query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '@/config';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';

const Login = () => {
  const initialState = {
    id: "",
  };
  const [credentials, setCredentials] = useState(initialState);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const studentId = credentials.id.trim();
      const studentsRef = query(collection(db, 'students'), where('studentId', '==', studentId));
      const querySnapshot = await getDocs(studentsRef);

      if (!querySnapshot.empty) {
        router.push(`/${studentId}`);
      } else {
        enqueueSnackbar("Student ID does not exist", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Error checking student ID:", error`, { variant: "error" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className="w-100" onSubmit={handleLogin}>
      <div className="mb-2 mt-5">
        <input
          required
          className={`${formStyles.inputFieldWhite}`}
          id="Id"
          aria-label="Id"
          type="text"
          placeholder="Enter your Id"
          value={credentials.id}
          onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
        />
      </div>
      <button disabled={processing ? true : false} type="submit" className={`${buttonStyles.buttonDarkPink} mt-3`}>
        {!processing ? "Login" : <CircularProgress width={22} height={22} />}
      </button>
    </form>
  )
}
export default Login; 