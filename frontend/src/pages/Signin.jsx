import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/ButtomWarning";

export function Signin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 seconds timeout
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setError(`Signin failed: ${error.response.data.message}`);
      } else if (error.request) {
        // Request was made but no response received
        setError("Signin failed: No response from server");
      } else {
        // Something else caused the error
        setError(`Signin failed: ${error.message}`);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your information to login"} />
          <InputBox
            onChange={handleInputChange}
            value={formData.username}
            name="username"
            placeholder="abc@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={handleInputChange}
            value={formData.password}
            name="password"
            type="password"
            placeholder="123456"
            label={"Password"}
          />
          {error && <div className="text-red-500">{error}</div>}
          <div className="pt-4">
            <Button onClick={handleSignin} label={"Sign in"} />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
}