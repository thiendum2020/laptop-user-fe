import React, { Fragment, useEffect } from "react";
import Search from "./Search";
import { Route, Link, withRouter } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";
import { CART_RESET } from "../../constants/cartConstants";
import { getBrands } from "../../actions/brandActions";
import { getCategories } from "../../actions/categoryActions";

const Header = ({ location }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { userLogin } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const { brands } = useSelector((state) => state.brands);
    const { categories } = useSelector((state) => state.categories);

    const logoutHandler = () => {
        dispatch(logout());
        dispatch({ type: CART_RESET });
        alert.success("Logged out successfully.");
    };

    useEffect(() => {
        dispatch(getBrands());
        dispatch(getCategories());
    }, [dispatch, alert]);

    return (
        // location.pathname.split('/')[1] === 'admin' ? (
        //     <>
        //         <header id="admin-header" className="bg-white shadow">
        //             <div className="row">
        //                 <div className="col-12 col-md-2">
        //                     <Link to='/admin/dashboard' className="sidebar-brand d-flex align-items-center justify-content-center">
        //                         <div className="sidebar-brand-icon rotate-n-15">
        //                             <i className="fas fa-laugh-wink" />
        //                         </div>
        //                         <div className="sidebar-brand-text mx-3">
        //                             <span>Toryo</span>
        //                             <sup>admin</sup>
        //                         </div>
        //                     </Link>
        //                 </div>
        //                 <div className="col-12 col-md-10">
        //                     <nav className="navbar navbar-expand">

        //                         {/* Topbar Navbar */}
        //                         <ul className="navbar-nav ml-auto">

        //                             {/* Nav Item - User Information */}
        //                             <li className="nav-item dropdown no-arrow">
        //                                 <span className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        //                                     <span className="mr-2 d-none d-lg-inline text-gray-600 small">{userLogin && userLogin.username}</span>
        //                                     <img className="img-profile rounded-circle" src={userLogin.avatar && userLogin.avatar.url}
        //                                         alt={userLogin && userLogin.username} />
        //                                 </span>
        //                                 {/* Dropdown - User Information */}
        //                                 <div className="dropdown-menu shadow animated--grow-in" aria-labelledby="userDropdown">
        //                                     <Link className="dropdown-item" to='/'>
        //                                         <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
        //                                         Store
        //                                     </Link>
        //                                     <a className="dropdown-item" href="#">
        //                                         <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
        //                                         Settings
        //                                     </a>
        //                                     <a className="dropdown-item" href="#">
        //                                         <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400" />
        //                                         Activity Log
        //                                     </a>
        //                                     <div className="dropdown-divider" />
        //                                     <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
        //                                         <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
        //                                         Logout
        //                                     </a>
        //                                 </div>
        //                             </li>
        //                         </ul>
        //                     </nav>
        //                 </div>
        //             </div>

        //         </header>

        //     </>
        // ) :
        <Fragment>
            <header>
                {/* mobile menu */}
                <div className="mobile-menu bg-gray">
                    <Link to="/" className="mb-logo">
                        LaptopTT
                    </Link>
                    <span className="mb-menu-toggle" id="mb-menu-toggle">
                        <i className="bx bx-menu" />
                    </span>
                </div>
                {/* end mobile menu */}
                {/* main header */}
                <div className="header-wrapper" id="header-wrapper">
                    <span className="mb-menu-toggle mb-menu-close" id="mb-menu-close">
                        <i className="bx bx-x" />
                    </span>
                    {/* top header */}
                    <div className="bg-gray">
                        <div className="top-header container">
                            <ul className="divided">
                                <li>
                                    <span>0986078827</span>
                                </li>
                                <li>
                                    <span>laptop@toryo.com</span>
                                </li>
                            </ul>
                            <ul className="divided free-ship">
                                <li>
                                    <strong>FREE DELIVERY: </strong>Get standard delivery on every order with LaptopTT
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* end top header */}
                    {/* mid header */}
                    <div className="bg-white">
                        <div className="mid-header container">
                            <Link to="/" className="logo">
                                LaptopTT
                            </Link>

                            <Route render={({ history }) => <Search history={history} />} />

                            <ul className="user-menu">
                                <li className="dropdown">
                                    {userLogin ? (
                                        <>
                                            <Link to="/profile">
                                                <figure className="avatar">
                                                    <img
                                                        src="https://media-cdn.laodong.vn/storage/newsportal/2021/9/2/949228/Ronaldo-Mu1-02.jpg"
                                                        alt=""
                                                        className="rounded-circle"
                                                    />
                                                </figure>
                                                <span>{userLogin && userLogin.username}</span>
                                            </Link>
                                            <ul className="dropdown-content">
                                                {/* {userLogin && userLogin.role === 'admin' && (
                                                        <li><Link to="/admin/dashboard">Dashboard</Link></li>
                                                    )} */}
                                                <li>
                                                    <Link to="/profile">Profile</Link>
                                                </li>
                                                <li>
                                                    <Link to="/profile/orders">Order</Link>
                                                </li>
                                                <li>
                                                    <Link to="/" onClick={logoutHandler}>
                                                        Logout
                                                    </Link>
                                                </li>
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="#">
                                                <i className="bx bx-user-circle" />
                                            </Link>
                                            <ul className="dropdown-content">
                                                <li>
                                                    <Link to="/login">Login</Link>
                                                </li>
                                                <li>
                                                    <Link to="/register">Register</Link>
                                                </li>
                                            </ul>
                                        </>
                                    )}
                                </li>
                                <li className="header-cart">
                                    <Link to="/cart">
                                        <i className="bx bx-cart" />
                                        {cartItems ? <span>{cartItems.length}</span> : <span>0</span>}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* end mid header */}
                    {/* bottom header */}
                    <div className="bg-gray">
                        <div className="bottom-header container">
                            <ul className="main-menu">
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                {/* mega menu */}
                                <li className="mega-dropdown">
                                    <Link to="/shop">
                                        Shop
                                        <i className="bx bxs-chevron-down" />
                                    </Link>
                                    <div className="mega-content">
                                        <div className="row">
                                            <div className="col-5">
                                                <div className="box">
                                                    <h3>Categories</h3>
                                                    <ul>
                                                        {
                                                            (categories &&
                                                                categories.sort(function (a, b) {
                                                                    return a.category_name.localeCompare(b.category_name);
                                                                }),
                                                            categories &&
                                                                categories.map((category) => (
                                                                    <li>
                                                                        <Link to={`/collections/category/${category.id}`}>
                                                                            {category.category_name}
                                                                        </Link>
                                                                    </li>
                                                                )))
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-5">
                                                <div className="box">
                                                    <h3>Brands</h3>
                                                    <ul>
                                                        {
                                                            (brands &&
                                                                brands.sort(function (a, b) {
                                                                    return a.brand_name.localeCompare(b.brand_name);
                                                                }),
                                                            brands &&
                                                                brands.map((brand) => (
                                                                    <li>
                                                                        <Link to={`/collections/brand/${brand.id}`}>
                                                                            {brand.brand_name}
                                                                        </Link>
                                                                    </li>
                                                                )))
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {/* end mega menu */}
                                <li>
                                    <Link to="/gallery">Gallery</Link>
                                </li>
                                <li>
                                    <Link to="/contact">Contact</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* end bottom header */}
                </div>
                {/* end main header */}
            </header>
        </Fragment>
    );
};

export default withRouter(Header);
