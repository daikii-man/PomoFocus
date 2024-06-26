import { Button, Input } from "@headlessui/react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RegisterSucessfullyModal from "../../components/RegisterSuccessfullyModal/RegisterSuccessfullyModal";
import { ActionsContextProvider } from "../../context/ActionsContext/ActionsContextProvider";

export default function RegisterPage() {
  const { setOpenSuccesRegisterModal } = useContext(ActionsContextProvider)
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    email: false,
    password: false,
    username: false,
  });

  function onChange(e) {
    e.preventDefault();
    const { id, value } = e.target;
    // regex tests
    const emailregex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passregex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    const usernameregex = /^[a-zA-Z0-9]{3,16}$/;
    if (id === "email") {
      setFormError({
        ...formError,
        email: !emailregex.test(value),
      });
    }
    if (id === "password") {
      setFormError({
        ...formError,
        password: !passregex.test(value),
      });
    }
    if (id === "username") {
      setFormError({
        ...formError,
        username: !usernameregex.test(value),
      });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (!(formError.email && formError.password && formError.username)) {
      let values = {};
      for (const ev of e.target) {
        if (ev.id != "" && ev.value != "") {
          values = {
            ...values,
            [ev.id]: ev.value,
          };
        }
      }

      await axios.post("http://localhost:5000/auth/register", {
        "username": values.username,
        "email": values.email,
        "password": values.password
      }).then((responsive) => {
        setOpenSuccesRegisterModal(true);
        console.log(responsive.data.message);
      }).catch((error) => {
        console.log(error);
      })
    }
    setLoading(false);
  }

  return (
    <div className="SignupPage flex items-center justify-center h-screen w-full">
      <RegisterSucessfullyModal />
      <div className="wrapped w-[345px]">
        <Link to="/">
          <img
            src="https://pomofocus.io/images/brandlogo-white.png"
            alt="Pomofocus logo"
            className="max-w-[280px] mx-auto"
          />
        </Link>
        <h6 className="mt-5 mb-7 text-center font-semibold">Create account</h6>
        <div className="rounded-xl flex flex-col px-4 py-6 bg-white w-full">
          <a
            className={`flex items-center justify-center gap-3 text-center rounded-md cursor-pointer shadow-sm opacity-90 text-sm p-3 min-w-[70px] bg-white text-gray-500 leading-tight w-full border border-gray-200 font-semibold`}
          >
            <img
              src="https://pomofocus.io/icons/g-logo.png"
              alt=""
              className=""
              width={20}
            />{" "}
            Sign up with Google
          </a>
          <form method="POST" onSubmit={onSubmit}>
            <div className="line flex gap-2 items-center my-3">
              <hr className="border border-slate-300 w-full"></hr>
              <span className="text-slate-500">or</span>
              <hr className="border border-slate-300 w-full"></hr>
            </div>
            <div className="formItem">
              <label
                htmlFor="username"
                className="mt-4 mb-2 uppercase text-[#c4c4c4] text-xs font-semibold"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                required
                placeholder="I am a spiderman"
                className={`px-3 py-2 outline-none rounded-lg bg-[#efefef] text-black w-full`}
                onChange={onChange}
              />
              {formError.username && (
                <i className="text-red-500">Please enter a username</i>
              )}
            </div>
            <div className="formItem">
              <label
                htmlFor="email"
                className="mt-4 mb-2 uppercase text-[#c4c4c4] text-xs font-semibold"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                placeholder="example@email.com"
                className={`px-3 py-2 outline-none rounded-lg bg-[#efefef] text-black w-full`}
                onChange={onChange}
              />
              {formError.email && (
                <i className="text-red-500">Please enter a valid email</i>
              )}
            </div>
            <div className="formItem">
              <label
                htmlFor="password"
                className="mt-4 mb-2 uppercase text-[#c4c4c4] text-xs font-semibold"
              >
                password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="*****"
                required
                className={`px-3 py-2 outline-none rounded-lg bg-[#efefef] text-black w-full`}
                onChange={onChange}
              />
              {formError.password && (
                <i className="text-red-500">Please enter a stronger password</i>
              )}
            </div>
            <Button
              type="submit"
              className={`flex items-center justify-center text-center rounded-md cursor-pointer shadow-sm opacity-90 text-sm p-3 min-w-[70px] bg-gray-900 border-2 border-gray-900 w-full mt-7`}
            >
              {loading ? 'Sending datas...' : 'Sign up with Email'}
            </Button>
          </form>
        </div>
        <div className="text-center mt-5">
          <p>Already have an account?</p>
          <Button className={`font-semibold underline`}>
            <Link to={`/login`}>Log In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
