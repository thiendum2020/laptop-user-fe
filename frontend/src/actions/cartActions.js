import axios from 'axios'
import { ADD_TO_CART, REMOVE_ITEM_CART, UPDATE_TO_CART, SAVE_SHIPPING_INFO } from '../constants/cartConstants'

export const addItemToCart = (id, qty, uid) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/product/${id}`)
    console.log(data.data);
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product_id: data.data.id,
            name: data.data.product_name,
            price: data.data.product_price,
            image: data.data.imageDTOS[0].imageLink,
            quantity: data.data.product_qty,
            qty
        }
    })

    localStorage.setItem(uid, JSON.stringify(getState().cart.cartItems))
}

export const updateItemToCart = (id, qty, uid) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/product/${id}`)

    dispatch({
        type: UPDATE_TO_CART,
        payload: {
            product_id: data.data.id,
            name: data.data.product_name,
            price: data.data.product_price,
            image: data.data.imageDTOS[0].imageLink,
            quantity: data.data.product_qty,
            qty
        }
    })

    localStorage.setItem(uid, JSON.stringify(getState().cart.cartItems))
}

export const removeItemFromCart = (id, uid) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_ITEM_CART,
        payload: {
            id
        }
    })
    localStorage.setItem(uid, JSON.stringify(getState().cart.cartItems))

}

export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })

    localStorage.setItem('shippingInfo', JSON.stringify(data))

}