import React from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart } from '../../actions/cartActions'
import NumberFormat from 'react-number-format'

const Product = ({ product, col, history }) => {
    const dispatch = useDispatch()
    const { userLogin } = useSelector(state => state.auth)
    const alert = useAlert()
    const uid = userLogin ? userLogin.id : null
    // let size = product.category === 'Clothing' ? 'S' : product.category === 'Shoes' ? '38' : 'Oversize'
    const addToCart = () => {
        if (uid) {
            if(product.product_qty > 0) {
                dispatch(addItemToCart(product.id, 1, uid))
                alert.success('Item Added to Cart')
            }
           else{
            alert.error('This product is out of stock')
           }
        }
        else {
            history.push('/login')
        }
    }

    return (
        <div className={`col-${col} product-item`}>
            <div className="product-img">
                <a href={`/product/${product.id}`}>
                    <img src={product && product.imageDTOS[0].imageLink} alt={product.product_name} />
                </a>
                <div className="product-action">
                    <i className='bx bxs-cart-add' onClick={addToCart}></i>
                    <Link to={`/product/${product.id}`}><i className='bx bx-show'></i></Link>
                </div>
            </div>
            <Link to={`/product/${product.id}`}><h4>{product.product_name}</h4></Link>

            {/* <div className="ratings">
                <div className="rating-outer">
                    <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                </div>
                <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
            </div> */}
            <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                <p>
                    <NumberFormat value={product.product_price} displayType={'text'} thousandSeparator={true} prefix={'đ '} />
                </p>
                <span>Sold: {product.product_sold}</span>
            </div>

        </div>
    )
}

export default Product
