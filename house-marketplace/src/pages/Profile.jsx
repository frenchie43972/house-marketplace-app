import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {updateDoc, doc} from 'firebase/firestore';
import {db} from '../firebase.config';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Profile() {
  const auth = getAuth();
  // Piece of state that determines whether the user is changing their profile details or not 
  const [changeDetails, setChangeDetails] = useState(false);
  // Stores the user profile information (email and password)
  const [formData, setformData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  // Here formData is destructured to make it easier to use its values
  const {name, email} = formData;

  const navigate = useNavigate();

  // When the user logs out it will take you back to the main page
  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  // Event handler that is called when the user submits their updated profile info
  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name) {
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // userRef variable can read or write data to the 'users' document in the FireStore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error('Coud not update profile details.');
    }
  };

  // Event handler that uses setformData taking a callback function that updates
  // the state based on the previous state. SignIn.jsx explains
  // this in more detail
  const onChange = (event) => {
    setformData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

    return (
      <>
        <div className="profile">
          <header className="profileHeader">
            <p className="pageHeader">My Profile</p>
            <button type="button" className="logOut" onClick={onLogout}>
              Logout
            </button>
          </header>

          <main>
            <div className="profileDetailsHeader">
              <p className="profileDetailsText">Personal Details</p>
              {/* When true, you cannot edit personal details and when clicked, it
              enables you to edit the information  */}
              <p className="changePersonalDetails" onClick={() => {
                changeDetails && onSubmit()
                setChangeDetails((prevState) => !prevState)
              }}>
                {changeDetails ? 'done' : 'change'}
              </p>
            </div>

            <div className="profileCard">
              <form>
                <input 
                  type="text"
                  id="name"
                  // Toggles the editable name field
                  className={!changeDetails ? 'profileName' : 'profileNameActive'}
                  disabled={!changeDetails}
                  value={name}
                  onChange={onChange}
                />
                <input 
                  type="text"
                  id="email"
                  // Toggles the editable email field
                  className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                  disabled={!changeDetails}
                  value={email}
                  onChange={onChange}
                />
              </form>
            </div>
          </main>
        </div>
      </>
    );
  }
  
  export default Profile;
  