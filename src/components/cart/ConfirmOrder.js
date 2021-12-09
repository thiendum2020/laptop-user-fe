import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import MetaData from "../layouts/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import NumberFormat from "react-number-format";
import { useSelector, useDispatch } from "react-redux";
import PaypalButton from "./PayPalButton";
import { CART_RESET } from "../../constants/cartConstants";
import { useAlert } from "react-alert";
import swal from "sweetalert";
import { createOrder, clearErrors } from "../../actions/orderActions";

const ConfirmOrder = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { userLogin } = useSelector((state) => state.auth);
    const uid = userLogin ? userLogin.id : null;

    // Calculate Order Prices
    const total_price = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    // const shippingPrice = itemsPrice > 500000 ? 0 : 50000
    // const taxPrice = Number((0.1 * itemsPrice))
    // const totalPrice = (itemsPrice + shippingPrice + taxPrice)
    const order = {
        id_user: uid,
        address: shippingInfo.address,
        phone_number: shippingInfo.phone
    };

    // const processToPayment = () => {
    //     const data = {
    //         total_price
    //     };
    //     sessionStorage.setItem("orderInfo", JSON.stringify(data));
    //     history.push("/order/payment");
    // };

    order.total_price = total_price;
    // order.shippingPrice = orderInfo.shippingPrice
    // order.taxPrice = orderInfo.taxPrice
    // order.totalPrice = orderInfo.totalPrice
    const shipCOD = async (e) => {
        e.preventDefault();

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then((willDelete) => {
            if (willDelete) {
                try {
                    // order.paymentInfo = {
                    //     name: 'Ship COD',
                    //     status: 'no'
                    // }
                    dispatch(createOrder(order, cartItems));
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success"
                    });
                    dispatch({ type: CART_RESET });
                    history.push("/");
                } catch (error) {
                    alert.error(error.response.data.message);
                }
            } else {
                history.push("/cart");
            }
        });
    };
    const tranSuccess = async(payment) => {
        console.log(payment);
        dispatch(createOrder(order, cartItems));
        dispatch({ type: CART_RESET });
        history.push("/");
        
    }
    return (
        <Fragment>
            <MetaData title={"Confirm Order"} />

            <div className="container">
                <CheckoutSteps shipping confirmOrder />
                <div className="order-confirm">
                    <div className="row">
                        <div className="col-8">
                            <h4 className="mb-3">Shipping Info</h4>
                            <p>
                                <b>Name:</b> {userLogin && userLogin.username}
                            </p>
                            <p>
                                <b>Phone:</b> {shippingInfo.phone}
                            </p>
                            <p className="mb-4">
                                <b>Address:</b> {`${shippingInfo.address}`}
                            </p>

                            <hr />
                            <h4 className="mt-4">Cart Items:</h4>

                            {cartItems.map((item) => (
                                <Fragment>
                                    <hr />
                                    <div className="cart-item" key={item.product_id}>
                                        <div className="row">
                                            <div className="col-4 col-lg-2">
                                                <img src={item.image} alt={item.name} height="80" width="80" />
                                            </div>

                                            <div className="col-6 col-lg-6">
                                                <Link to={`/product/${item.product_id}`}>{item.name}</Link>
                                            </div>

                                            <div className="col-2 col-lg-4 mt-4 mt-lg-0">
                                                <p>
                                                    {item.qty} x{" "}
                                                    <NumberFormat
                                                        value={item.price}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                        prefix={"đ "}
                                                    />{" "}
                                                    ={" "}
                                                    <b>
                                                        <NumberFormat
                                                            value={item.qty * item.price}
                                                            displayType={"text"}
                                                            thousandSeparator={true}
                                                            prefix={"đ "}
                                                        />
                                                    </b>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>
                            ))}
                        </div>

                        <div className="col-4">
                            <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                {/* <p>Subtotal:  <span className="order-summary-values"><NumberFormat value={itemsPrice} displayType={'text'} thousandSeparator={true} prefix={'đ '} /></span></p>
                                <p>Shipping: <span className="order-summary-values"><NumberFormat value={shippingPrice} displayType={'text'} thousandSeparator={true} prefix={'đ '} /></span></p>
                                <p>Tax:  <span className="order-summary-values"><NumberFormat value={taxPrice} displayType={'text'} thousandSeparator={true} prefix={'đ '} /></span></p> */}

                                <hr />

                                <h5>
                                    Total:{" "}
                                    <span className="order-summary-values">
                                        <NumberFormat
                                            value={total_price}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"đ "}
                                        />
                                    </span>
                                </h5>

                                <hr />
                                <button id="ship_cod" className="btn btn-block btn-order-summary" onClick={shipCOD}>
                                    Payment on delivery
                                </button>
                                <hr/>
                                {/* <button id="paypal" className="btn btn-block btn-order-summary" onClick={processToPayment}>Pay by PayPal</button> */}
                                <PaypalButton total={100} tranSuccess={tranSuccess} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ConfirmOrder;
