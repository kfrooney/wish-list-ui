import { GoogleAuthProvider, User, getAuth, signInWithRedirect } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
export type LoginProps = { user?: User | null }
function signIn() {
    signInWithRedirect(getAuth(), new GoogleAuthProvider());
}

function Login(props: LoginProps) {
    const navigate = useNavigate();

    useEffect(() => {
        if (props.user) {
            navigate(`/app`);
        }
    });

    return <div><button onClick={signIn}>Google</button></div>
}
export default Login;