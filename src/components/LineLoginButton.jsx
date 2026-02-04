const LineLoginButton = () => {

    const LINE_CLIENT_ID = import.meta.env.VITE_LINE_CLIENT_ID;
    const LINE_REDIRECT_URI = import.meta.env.VITE_LINE_REDIRECT_URI;
    const STATE = import.meta.env.VITE_LINE_OAUTH_STATE; 
    const SCOPE = "profile openid email"; 

    console.log("Line Login Config:", {
        LINE_CLIENT_ID,
        LINE_REDIRECT_URI,
        STATE,
        SCOPE
    });

    const handleLineLogin = () => {
        const lineUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${LINE_REDIRECT_URI}&state=${STATE}&scope=${SCOPE}`;
        window.location.href = lineUrl;
    };

    return (
        <button
            type="button"
            onClick={handleLineLogin}
            className="w-full border border-slate-200 bg-white hover:bg-slate-50 py-3 rounded-full flex items-center justify-center gap-3 transition duration-200 group"
        >
            <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 48 48" className="w-full h-full"><path fill="#06C755" d="M24 4C14.4 4 6 11.2 6 20c0 4.9 2.6 9.3 6.7 12.1 0.7 0.3 1.5 1 1 2.3l-1.3 4.2c-0.3 1.1-1.3 2.7 1.2 1.4 6.7-3.8 7.3-4.1 8-4.1 0.8 0 1.6 0.1 2.4 0.1 9.6 0 18-7.2 18-16S33.6 4 24 4z" /><path fill="#fff" d="M34.8 23h-6.1c-0.6 0-1-0.4-1-1s0.4-1 1-1h5.1v-3h-5.1c-0.6 0-1-0.4-1-1s0.4-1 1-1h6.1c0.6 0 1-0.4 1-1s-0.4-1-1-1h-6.1c-1.7 0-3 1.3-3 3v5c0 1.7 1.3 3 3 3h6.1c0.6 0 1-0.4 1-1S35.3 23 34.8 23zM21.5 15c-0.4-0.4-1-0.5-1.5-0.2 -0.2 0.1-0.4 0.3-0.5 0.5v8.5c0 0.6 0.4 1 1 1 0.2 0 0.5-0.1 0.7-0.3l4.6-6.6V24c0 0.6 0.4 1 1 1s1-0.4 1-1v-9c0-0.4-0.2-0.7-0.6-0.9 -0.4-0.2-0.8-0.1-1.1 0.2L21.5 21V15zM13.2 15c-0.6 0-1 0.4-1 1v8c0 0.6 0.4 1 1 1s1-0.4 1-1v-8C14.2 15.4 13.7 15 13.2 15z" /></svg>
            </div>
            
            <span className="text-slate-700 font-medium text-sm group-hover:text-slate-900">
                ลงชื่อเข้าใช้ด้วย Line
            </span>
        </button>
    );
};

export default LineLoginButton;
