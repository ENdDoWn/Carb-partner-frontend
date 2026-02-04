import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const handleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post(`/google/login`, {
                id_token: credentialResponse.credential
            });

            localStorage.setItem('access_token', res.data.access_token);
            navigate('/subinfo');
        } catch (error) {
            console.error("Login Failed", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="w-full flex justify-center">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                    useOneTap
                    theme="outline"
                    size="large"
                    shape="pill"
                    text="signin_with"
                    logo_alignment="left"
                    width={360}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
