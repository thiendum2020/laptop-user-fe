import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import Banner from "../../assets/banner.jpg";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors } from "../../actions/userActions";

const Login = ({ history, location }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading, success } = useSelector(state => state.auth);

    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {
        if (isAuthenticated) {
            alert.success("Login successfully!");
            history.push(redirect);
        }

        if (error) {
            alert.error("Login failed. Please check the information again!");
            dispatch(clearErrors());
        }
       
    }, [dispatch, alert, redirect, isAuthenticated, error, history]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(username, password));
    };

    return (
        <Fragment>
            {loading ? (
                <>
                    <div style={{ paddingTop: "210px" }}></div>
                    <Loader />
                    <div style={{ paddingBottom: "210px" }}></div>
                </>
            ) : (
                <Fragment>
                    <MetaData title={"Login"} />
                    <section className="account">
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <img src={Banner} alt="" />
                                </div>
                                <div className="col-6">
                                    <div className="account-form">
                                        <div className="form-header">
                                            <div className="login">
                                                <span>Login</span>
                                            </div>
                                            <span>
                                                <Link to="/register">Register</Link>
                                            </span>
                                        </div>
                                        <form onSubmit={submitHandler}>
                                            <input
                                                type="email"
                                                id="email_field"
                                                className="form-control"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Email"
                                            />
                                            <input
                                                type="password"
                                                id="password_field"
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password"
                                            />
                                            <Link to="/password/forgot">Forgot Password?</Link>
                                            <button id="login_button" type="submit" className="btn btn-login">
                                                Login
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Login;
