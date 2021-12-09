import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import Banner from "../../assets/banner.jpg";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { register, clearErrors } from "../../actions/userActions";
import axios from "axios";

const Register = ({ history }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("user");

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading, success } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            history.push("/");
        }

        if (error) {
            alert.error("Registration failed. Please check the information again!");
            dispatch(clearErrors());
        }
        if(success){
            alert.success("Register successfully");
            dispatch(clearErrors());
            history.push("/login");
        }
    }, [dispatch, alert, isAuthenticated, error, history, success]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(register(username, email, password, phone, address, role));
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={"Register"} />
                    <section className="account">
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <img src={Banner} alt="" />
                                </div>
                                <div className="col-6">
                                    <div className="account-form">
                                        <div className="form-header">
                                            <span>
                                                <Link to="/login">Login</Link>
                                            </span>
                                            <div className="register">
                                                <span>Register</span>
                                            </div>
                                        </div>
                                        <form onSubmit={submitHandler}>
                                            <input
                                                type="text"
                                                id="name_field"
                                                className="form-control"
                                                name="name"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Name"
                                            />
                                            <input
                                                type="email"
                                                id="email_field"
                                                className="form-control"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="example@domain.com"
                                            />
                                            <input
                                                type="password"
                                                id="password_field"
                                                className="form-control"
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password"
                                            />
                                            <input
                                                type="number"
                                                id="name_field"
                                                className="form-control"
                                                name="name"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Phone Number"
                                            />
                                            <input
                                                type="text"
                                                id="name_field"
                                                className="form-control"
                                                name="name"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="Address"
                                            />

                                            <button
                                                id="register_button"
                                                type="submit"
                                                className="btn btn-login"
                                                disabled={loading ? true : false}
                                            >
                                                REGISTER
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

export default Register;
