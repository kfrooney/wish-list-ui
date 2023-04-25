import { GoogleAuthProvider, User, getAuth, signInWithRedirect } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useFirebaseAuth } from './FirebaseUserContext';
export type LoginProps = { user?: User | null }
function signIn() {
    signInWithRedirect(getAuth(), new GoogleAuthProvider());
}

function Login() {
    const user = useFirebaseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(`/app`);
        }
    });

    return <div><button onClick={signIn}>Google</button></div>
}
export default Login;