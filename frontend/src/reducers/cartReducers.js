import { ADD_TO_CART, REMOVE_ITEM_CART, UPDATE_TO_CART, SAVE_SHIPPING_INFO, CART_RESET, CART_IMPORT } from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
    switch (action.type) {

        case ADD_TO_CART:
            const item = action.payload
            console.log(item);
            const isItemExist = state.cartItems ? state.cartItems.find(i => i.product_id === item.product_id) : null
            console.log(isItemExist);
            if (isItemExist) {
                state.cartItems.map(i => {
                    if (i.product_id === isItemExist.product_id) {

                        i.qty = i.qty + item.qty

                    }
                })

                return {
                    ...state,
                    cartItems: state.cartItems
                }
            } else {
                console.log(state.cartItems);
                if (state.cartItems) {
                    return {
                        ...state,
                        cartItems: [...state.cartItems, item]
                    }
                } else {
                    return {
                        ...state,
                        cartItems: [item]
                    }
                }
            }

        case REMOVE_ITEM_CART:
            let isItemRemove = state.cartItems.find(i => i.product_id === action.payload.id)
            return {
                ...state,
                cartItems: state.cartItems.filter(i => i !== isItemRemove)
            }

        case UPDATE_TO_CART:
            const updateItem = action.payload;
            const isUpdateItemExist = state.cartItems.find(i => i.product_id === updateItem.product_id)
            if (isUpdateItemExist) {

                return {
                    ...state,
                    cartItems: state.cartItems.map(i => i.product_id === isUpdateItemExist.product_id ? updateItem : i)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, updateItem]
                }
            }

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }
        case CART_IMPORT:
            return {
                ...state,
                cartItems: action.payload,
            }
        case CART_RESET:
            return {
                cartItems: [],
                shippingInfo: {}
            }
        default:
            return state
    }
}