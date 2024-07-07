import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom"

import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/ButtomWarning";
export function Signup(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChange={e => {
          setUsername(e.target.value);
        }} placeholder="abc@gmail.com" label={"Email"} />
        <InputBox onChange={(e) => {
          setPassword(e.target.value)
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async () => {
            try{
              const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                username,
                password
              });
              localStorage.setItem("token", response.data.token)
              navigate("/dashboard")
            }catch (error) {
              if (error.response && error.response.status === 409) {
                alert("User already exists. Please use a different email.");
              } else {
                alert("An error occurred. Please try again.");
              }
            }
            
          }} label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}