import { useState } from "react";
import {toast} from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import OAuth from "../components/OAuth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {db} from '../firebase.config';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

// All comments for the code be be found in the SignIn page. Only code unique to 
// this component will be commented on

function SignUp() {
  const [showPassowrd, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // The same with the exception of the added name field
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value, 
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const auth = getAuth();

      // Contains information on the newlt created user account
      const userCredential = await createUserWithEmailAndPassword
      (
        auth,
        email,
        password
      );

      // Extracts the information in the user object
      const user = userCredential.user;

      // Updates the user's dispaly name to the value entered in the Name input field
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // Creates a copy of formData using the spread operator which allows manipulation
      // of the data without affecting the original information in formData
      const formDataCopy = {...formData};
      // Removes password from formDataCopy so we don't store any passwords in the db
      delete formDataCopy.password;
      // Adds a timestamp field when the new user is submitted
      formDataCopy.timestamp = serverTimestamp();

      // Saves the 'users' form data to the firebase DB using the setDoc function.
      // The doc function specifies the unique id (uid) value and passes the formDataCopy
      // object as the document data
      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      // Navigate to home after submission
      navigate('/');
      // Any missing information will throw an error
    } catch (error) {
      toast.error('Error in registration: check your entries and try again.');
    }
  }; 

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">
            Welcome Back!
          </p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
          <input 
              type="text" 
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onChange} 
            />
            <input 
              type="email" 
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange} 
            />

            <div className="passwordInputDiv">
              <input 
                type={showPassowrd ? 'text' : 'password'}
                className="passwordInput"
                placeholder="Password"
                id="password"
                value={password}
                onChange={onChange}
              />
              <img 
                src={visibilityIcon}
                alt="show password"
                className="showPassword"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password?
            </Link>

            <div className="signUpBar">
              <p className="signUpText">
                Sign Up
              </p>
              <button className="signUpButton">
                <ArrowRightIcon 
                  fill="#ffffff"
                  width="34px"
                  height="34px"
                />
              </button>
            </div>
          </form>

          <OAuth />

          <Link to="/sign-in" className="registerLink">
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  );
 
}
  
export default SignUp;
  