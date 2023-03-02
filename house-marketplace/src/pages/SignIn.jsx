import { useState } from "react";
// React library that allows you to add notifications to the app
import {toast} from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
// Authentication from firebase to allow users to sign in
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignIn() {
  // Piece of state that sets up to show (or not show) the text when the password
  // is entered
  const [showPassowrd, setShowPassword] = useState(false);
  // Another state variable that contains an object with two fields (email and password)
  // so when they can be called as values in the JSX
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // Destructered email and password to make it easier to access the values
  const { email, password } = formData;

  // Variable to use useNavigate which can programmatically navigate to different routes
  const navigate = useNavigate();

  // Event handler function that takes an object (event) as an argument that contains
  // what the user is typing
  const onChange = (event) => {
    // Updates the formData state. it takes a callback function as an argument that
    // will be called with the previous state of formData.
    setFormData((prevState) => ({
      // Uses the spread operator to copy all fields and create a new object which  
      // is a previous state of formData. This is done this way because you should
      // not modify formData's previous state directly, but instead create a new
      // object with the updated values
      ...prevState,
      // This will enable you to dymanically set the value of one of the fields from
      // formData objects based off the 'id' attribute so if the a user is typing
      // in the email or password input, it will set either to the appropriate value
      [event.target.id]: event.target.value, 
    }));
  };

  // Event handler async function that handles the form submission
  const onSubmit = async (event) => {
    event.preventDefault();

    // Using try/catch in order to handle errors that may occur upon form submission
    try {
      // Initilizing a new authentification instance from getAuth in firebase
      const auth = getAuth();

      // Attempts to the sign the user in takinbg in auth, email and password as
      // arguments returning userCredentials conatining the information about the 
      // user that is loigging in.
      const userCredential = await signInWithEmailAndPassword 
      (
        auth,
        email,
        password,
      );

      // If the userCredential is valid, navigates to the home route or throws an error
      if(userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Username or Password is Invalid!');
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
              type="email" 
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange} 
            />

            <div className="passwordInputDiv">
              <input 
              // A ternary expression that determines whether the 'type' should be shown
              // as text or the dotted password
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
                // Toggles the value of showPassword to true or false in order to 
                // view the text or password in the input field
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>
            {/* Sends you to the forgot-password page when clicked */}
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password?
            </Link>

            <div className="signInBar">
              <p className="signInText">
                Sign In
              </p>
              <button className="signInButton">
                <ArrowRightIcon 
                  fill="#ffffff"
                  width="34px"
                  height="34px"
                />
              </button>
            </div>
          </form>

          {/* TO-DO: Google OAuth */}

          {/* Navigates to the sign-up page */}
          <Link to="/sign-up" className="registerLink">
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  );
 
}
  
export default SignIn;
  