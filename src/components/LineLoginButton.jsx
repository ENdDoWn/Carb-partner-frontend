import lineIcon from '../assets/images/line-icon.png';

const LineLoginButton = () => {

    const LINE_CLIENT_ID = import.meta.env.VITE_LINE_CLIENT_ID;
    const LINE_REDIRECT_URI = import.meta.env.VITE_LINE_REDIRECT_URI;
    const STATE = import.meta.env.VITE_LINE_OAUTH_STATE; 
    const SCOPE = "profile openid email"; 

    const handleLineLogin = () => {
        const lineUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${LINE_REDIRECT_URI}&state=${STATE}&scope=${SCOPE}`;
        window.location.href = lineUrl;
    };

    return (
        <button
            type="button"
            onClick={handleLineLogin}
            className="w-[360px] mx-auto h-[40px] border border-slate-200 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center gap-2 transition duration-200 group"
        >
            <div className="w-7 h-7 flex items-center justify-center">
                <img src={lineIcon} alt="Line" className="w-full h-full object-contain" />
            </div>
            
            <span className="text-slate-700 font-medium text-sm group-hover:text-slate-900">
                ลงชื่อเข้าใช้ด้วย Line
            </span>
        </button>
    );
};

export default LineLoginButton;
