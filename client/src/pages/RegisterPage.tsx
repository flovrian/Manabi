import "../styles/auth_page.css";
import {useIntl} from "react-intl";
import {useState, FormEvent, ChangeEvent} from "react";

import {config} from "../../config";

import appleOAuth from '/images/authentication/appleLogo.png'
import googleOAuth from '/images/authentication/discordLogo.png'
import discordOAuth from '/images/authentication/googleLogo.png'

import greenSphereShape from '/images/shapes/green/sphere_0.png'
import blueTriangleShape from '/images/shapes/blue/triangle_0.png'
import redTriangle from '/images/shapes/red/triangle_3.png'
import orangeTriangle from '/images/shapes/orange/triangle_3.png'
import {useNavigate} from "react-router-dom";

type RegisterFormNotice = string | null;
interface RegisterFormNotices {
    server: RegisterFormNotice; username: RegisterFormNotice; email: RegisterFormNotice; password: RegisterFormNotice; }

export default function RegisterPage() {

    const intl = useIntl();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({username: '', email: '',  password: ''});
    const [formNotices, setFormNotices] = useState<RegisterFormNotices>({username: null, email: null,  password: null, server: null});

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        fetch(`${config.apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            }).then(async (response) => {
                if (response.status !== 200) {
                    const noticeData = await response.json();
                    setFormNotices(noticeData.errors)
                }else{
                    navigate('/login')
                }
            })
    }

    function handleFormChange(e: ChangeEvent<HTMLInputElement>, type: string) {
        setFormData({...formData,  [type]: e.target.value, });
        setFormNotices(prev => ({...prev, [type]: null}));
    }

    return (
        <div className="auth-page">
            <div className="manabi-mobile-shape-wrapper">
                <img
                    className="manabi-shape-one rotate-130"
                    src={greenSphereShape}
                    alt={'Blue Triangle'}
                />
                <img
                    className="manabi-shape-two rotate-50"
                    src={blueTriangleShape}
                    alt={'Blue Triangle'}
                />
            </div>

            <div className="manabi-desktop-shape-wrapper">
                <img
                    className="manabi-d-shape-one rotate-130"
                    src={greenSphereShape}
                    alt={'Green Sphere'}
                />
                <img
                    className="manabi-d-shape-two rotate-10"
                    src={blueTriangleShape}
                    alt={'Blue Triangle'}
                />
                <img
                    className="manabi-d-shape-three rotate-160"
                    src={redTriangle}
                    alt={'Red Triangle'}
                />
                <img
                    className="manabi-d-shape-four rotate-40"
                    src={orangeTriangle}
                    alt={'Orange Triangle'}
                />
            </div>

            <div className="manabi-auth-form-wrapper">
                <div className={"manabi-auth-form-base"}>
                    <div className={"manabi-auth-form-inner-wrapper"}>
                        <div className={"manabi-auth-form-title"}>
                            {intl.formatMessage({id: 'authentication.register.title'})}
                        </div>
                        <div className={"manabi-auth-form-description"}>
                            {intl.formatMessage({id: 'authentication.register.description'})}
                        </div>
                        <form onSubmit={handleSubmit} >

                            <div className={"manabi-auth-form-field-wrapper"}>
                                <input
                                    name="username"
                                    type="text"
                                    id="username"
                                    className={`manabi-auth-form-field  ${formNotices.username ? 'manabi-auth-form-field-error' : ''}`}
                                    required={true}
                                    placeholder={intl.formatMessage({id: 'authentication.form.username.placeholder'})}
                                    onChange={(e) => handleFormChange(e, 'username')}
                                />
                                {formNotices.username && (
                                    <span className="manabi-auth-form-error-text">
                                        {intl.formatMessage({ id: formNotices.username })}
                                    </span >
                                )}
                            </div>

                            <div className={"manabi-auth-form-field-wrapper"}>
                                    <input
                                        name="email"
                                        type="email"
                                        id="email"
                                        className={`manabi-auth-form-field ${formNotices.email ? 'manabi-auth-form-field-error' : ''}`}
                                        required={true}
                                        placeholder={intl.formatMessage({id: 'authentication.form.email.placeholder'})}
                                        onChange={(e) => handleFormChange(e, 'email')}
                                    />
                                    {formNotices.email && (
                                        <span className="manabi-auth-form-error-text">
                                        {intl.formatMessage({ id: formNotices.email })}
                                    </span >
                                    )}
                            </div>

                            <div className={"manabi-auth-form-field-wrapper"}>
                                <input
                                    name="password"
                                    type="password"
                                    id="password"
                                    className={`manabi-auth-form-field ${formNotices.password ? 'manabi-auth-form-field-error' : ''}`}
                                    required={true}
                                    placeholder={intl.formatMessage({id: 'authentication.form.password.placeholder'})}
                                    onChange={(e) => handleFormChange(e, 'password')}
                                />
                                {formNotices.password && (
                                    <span className="manabi-auth-form-error-text">
                                    {intl.formatMessage({ id: formNotices.password })}
                                </span >
                                )}
                            </div>

                            <div className={"manabi-auth-form-field-wrapper"}>
                                <button type="submit" className={"manabi-auth-button"}>
                                    {intl.formatMessage({id: 'authentication.register.button'})}
                                </button>
                                {formNotices.server && (
                                    <span className="manabi-auth-form-error-text">
                                    {intl.formatMessage({ id: formNotices.server })}
                                </span>
                                )}
                            </div>
                        </form>

                        <div className={"manabi-auth-o-auth-buttons"}>
                            <button type="submit" className={"manabi-auth-o-auth-button"}>
                                <img alt={'Apple Login'} src={appleOAuth}/>
                            </button>
                            <button type="submit" className={"manabi-auth-o-auth-button"}>
                                <img alt={'Google Login'} src={googleOAuth}/>
                            </button>
                            <button type="submit" className={"manabi-auth-o-auth-button"}>
                                <img alt={'Discord Login'} src={discordOAuth}/>
                            </button>
                        </div>

                        <a
                            onClick={() => {navigate('/login')}}
                            className={"manabi-already-registered"}>{
                            intl.formatMessage({id: 'authentication.register.already_registered'})
                        }
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}