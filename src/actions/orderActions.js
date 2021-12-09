import axios from "axios";

import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    DETAIL_ORDER_LIST_REQUEST,
    DETAIL_ORDER_LIST_SUCCESS,
    DETAIL_ORDER_LIST_FAIL,
    CLEAR_ERRORS
} from "../constants/orderConstants";
import {
    UNDO_STOCK_PRODUCT_REQUEST,
    UNDO_STOCK_PRODUCT_SUCCESS,
    UNDO_STOCK_PRODUCT_FAIL
} from "../constants/productConstants";

export const createOrder = (order, cartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type: CREATE_ORDER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getState().auth.userLogin.accessToken}`
            }
        };
        const { data } = await axios.post("/api/orders/add", order, config);
        for (let i = 0; i < cartItems.length; i++) {
            let orderDetails = {
                order_id: data.data.id,
                detail_qty: cartItems[i].qty,
                detail_price: cartItems[i].price,
                product_id: cartItems[i].product_id
            };
            console.log(orderDetails);
            await axios.post("/api/detailorder/add", orderDetails, config);
        }
        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        });
        console.log(order.id_user);
        localStorage.removeItem(order.id_user);
    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response
        });
    }
};

// Get curretly logged in user orders
export const myOrders = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: MY_ORDERS_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${getState().auth.userLogin.accessToken}`
            }
        };

        const { data } = await axios.get(`/api/orders/user/${id}`, config);

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response.data.message
        });
    }
};

// Get order details
export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${getState().auth.userLogin.accessToken}`
            }
        };

        const { data } = await axios.get(`/api/orders/${id}`, config);

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response.data.message
        });
    }
};

// Get all orders - ADMIN
export const allOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });

        const { data } = await axios.get(`/api/admin/orders`);

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: error.response.data.message
        });
    }
};

// update order by admin
export const updateOrderByAdmin = (id, status) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const { data } = await axios.put(`/api/admin/order/${id}`, status, config);

        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.response.data.message
        });
    }
};

// cancel order by user
export const cancelOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${getState().auth.userLogin.accessToken}`
            }
        };
        const { data } = await axios.put(`/api/orders/cancel/${id}`,'', config);
        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.response.data.message
        });
    }
};

// receive order by user
export const receiveOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${getState().auth.userLogin.accessToken}`
            }
        };
        const { data } = await axios.put(`/api/orders/received/${id}`,'', config);
        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.response.data.message
        });
    }
};
// update order by user
export const undoStockProduct = (productId, stock) => async (dispatch) => {
    try {
        dispatch({ type: UNDO_STOCK_PRODUCT_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const { data } = await axios.get(`/api/product/${productId}`);
        const sold = data.product.sold - stock;
        stock = data.product.stock + stock;
        await axios.put(`/api/product/stock/${productId}`, { stock, sold }, config);

        dispatch({
            type: UNDO_STOCK_PRODUCT_SUCCESS,
            payload: "success"
        });
    } catch (error) {
        dispatch({
            type: UNDO_STOCK_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
};
// Delete order
export const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ORDER_REQUEST });

        const { data } = await axios.delete(`/api/admin/order/${id}`);

        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error.response.data.message
        });
    }
};

export const listDetailOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: DETAIL_ORDER_LIST_REQUEST
        });
        const config = {
            headers: {
                Authorization: `Bearer ${getState().auth.userLogin.accessToken}`
            }
        };

        const { data } = await axios.get(`/api/detailorder/order/${id}`, config);

        dispatch({ type: DETAIL_ORDER_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DETAIL_ORDER_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};
