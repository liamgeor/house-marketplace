import PropTypes from 'prop-types'
import { getAuth, updateProfile} from 'firebase/auth'
import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
function Profile(props) {

    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false);

    const [formData, setFormData] =useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })

    const {name, email} = formData;

    const navigate = useNavigate()
    

    const onLogout = () =>{
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async() =>{
        try {
            if(auth.currentUser.displayName !== name){
                //udpdate display in fb
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
            }

            //update in firestore

            const userRef = doc(db, 'users', auth.currentUser.uid)

            await updateDoc(userRef, {
                name
            })

        } catch (error) {
            toast.error('Could not update profile details')
        }
    }

    const onChange = (e) => {
        setFormData((prevState) =>({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type='button' onClick={onLogout} className="logOut">
                    Logout
                </button>
            </header>

            <main className="profileDetailsHeader">
                <p className="profileDetailsText">
                    Personal Details
                </p>
                <p className="changePersonalDetails" onClick={() =>{
                    changeDetails && onSubmit()
                    setChangeDetails((prevState) => !prevState)
                }}>
                    {changeDetails ? 'done' : 'change'}
                </p>
            </main>

            <div className="profileCard">
                <form action="">
                    <input 
                        type="text" 
                        id="name" 
                        className={!changeDetails ? 'profileName' : 'profileNameActive'} 
                        disabled={!changeDetails}
                        value={name}
                        onChange={onChange}
                    />
                    <input 
                        type="text" 
                        id="email" 
                        className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} 
                        disabled={!changeDetails}
                        value={email}
                        onChange={onChange}
                    />
                </form>
            </div>


        </div>
    )
}

Profile.propTypes = {

}

export default Profile

