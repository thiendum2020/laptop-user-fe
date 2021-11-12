import React, { Fragment, useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Loader from '../layouts/Loader'
import MetaData from '../layouts/MetaData'
import ListReviews from './review/ListReviews'
import NumberFormat from 'react-number-format'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails, clearErrors, newReview } from '../../actions/productActions'
import { getCategoryDetailsById } from '../../actions/categoryActions'
import { getBrandDetailsById } from '../../actions/brandActions'
import { addItemToCart } from '../../actions/cartActions'
import { NEW_REVIEW_RESET } from '../../constants/productConstants'

const ProductDetails = ({ match, history }) => {
    // const size1 = [
    //     'S',
    //     'M',
    //     'L',
    //     'XL'
    // ]
    // const size2 = [
    //     '38',
    //     '39',
    //     '40',
    //     '41',
    //     '42'
    // ]
    const [qty, setQty] = useState(1)
    // const [size, setSize] = useState('Oversize')
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const dispatch = useDispatch()
    const alert = useAlert()
    const { loading, error, product } = useSelector(state => state.productDetails)
    const { error: reviewError, success } = useSelector(state => state.newReview)
    const { brand } = useSelector(state => state.brandDetails)
    const { category } = useSelector(state => state.categoryDetails)
    const { userLogin } = useSelector(state => state.auth)
    const uid = userLogin ? userLogin.id : null
    console.log(uid);
    useEffect(() => {
        dispatch(getProductDetails(match.params.id))
        dispatch(getBrandDetailsById(product.brand_id))
        dispatch(getCategoryDetailsById(product.category_id))

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors())
        }

        if (success) {
            alert.success('Reivew posted successfully')
            dispatch({ type: NEW_REVIEW_RESET })
        }

    }, [dispatch, alert, error, reviewError, success, match.params.id, product.brand_id, product.category_id])

    const increaseQty = () => {
        const count = document.querySelector('.product-quantity')

        if (count.valueAsNumber >= product.product_qty) return;

        const qty = count.valueAsNumber + 1;
        setQty(qty)
    }

    const decreaseQty = () => {

        const count = document.querySelector('.product-quantity')

        if (count.valueAsNumber <= 1) return;

        const qty = count.valueAsNumber - 1;
        setQty(qty)

    }
    const addToCart = () => {

        if (uid) {
            dispatch(addItemToCart(match.params.id, qty, uid))
            alert.success('Item Added to Cart')
        }
        else {
            history.push('/login')
        }
    }

    function setUserRatings() {
        const stars = document.querySelectorAll('.star');

        stars.forEach((star, index) => {
            star.starValue = index + 1;

            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        })

        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('orange');

                        setRating(this.starValue)
                    } else {
                        star.classList.remove('orange')
                    }
                }

                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('yellow');
                    } else {
                        star.classList.remove('yellow')
                    }
                }

                if (e.type === 'mouseout') {
                    star.classList.remove('yellow')
                }
            })
        }
    }

    const reviewHandler = () => {
        const formData = new FormData();

        formData.set('rating', rating)
        formData.set('comment', comment)
        formData.set('productId', match.params.id)
        dispatch(newReview(formData))
    }

    return (
        <>
            <MetaData title={product ? product.product_name : 'Loading'} />
            {/* shop */}
            {
                loading ?
                    (
                        <div style={{ padding: '200px 0' }}>
                            <Loader />
                        </div>
                    )
                    : 
                    (
                        <Fragment>
                            <section className="product">
                                <div className="container">
                                    <div className="product-title">
                                        <h2><Link to='/shop'>Shop</Link></h2>
                                        <p>Product Details</p>
                                    </div>
                                    <div className="product-details">
                                        <div className="row">
                                            <div className="col-5">
                                                <Carousel pause='hover'>
                                                    {product.imageDTOS && product.imageDTOS.map(image => (
                                                        <Carousel.Item key={image.id}>
                                                            <img className="d-block w-100" src={image.imageLink} alt={product.product_name} />
                                                        </Carousel.Item>
                                                    ))}
                                                </Carousel>
                                            </div>
                                            <div className="col-7">
                                                <h2>{product.product_name}</h2>
                                                <div className="product-details-info">
                                                    <span>Brand: </span>
                                                    <Link to={`/collections/brand/${product && product.brand_id}`}>{brand.brand_name}</Link>
                                                </div>
                                                <div className="product-details-info">
                                                    <span>Category: </span>
                                                    <Link to={`/collections/category/${product && product.category_id}`}>{category.category_name}</Link>
                                                </div>
                                                <div className="product-details-info">
                                                    <div className="ratings">
                                                        <div className="rating-outer">
                                                            <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                                                        </div>
                                                        <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                                                        {
                                                            userLogin ? <span id="review_btn" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings}>Submit reviews</span>
                                                                : <span id="none-review">Login to post reviews</span>
                                                        }
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <div className="product-details-info">
                                                    <span>Status: </span>
                                                    <p className={product.product_qty > 0 ? 'greenColor' : 'redColor'} >{product.product_qty > 0 ? 'In stock' : 'Sold out'}</p>
                                                </div>
                                                <div className="product-details-info">
                                                    <span>Sold: </span>
                                                    <p>{product.product_sold}</p>
                                                </div>
                                                <div className="product-details-info">
                                                    <h3>
                                                        <NumberFormat value={product.product_price} displayType={'text'} thousandSeparator={true} prefix={'đ '} />
                                                    </h3>
                                                </div>
                                                {
                                                    product.product_qty > 0 ? (
                                                        <>
                                                            <div className="product-quantity-wrapper">
                                                                <span className="product-quantity-btn" onClick={decreaseQty}>
                                                                    <i className="bx bx-minus"></i>
                                                                </span>
                                                                <input type="number" className="product-quantity" value={qty} readOnly />
                                                                <span className="product-quantity-btn" onClick={increaseQty}>
                                                                    <i className="bx bx-plus"></i>
                                                                </span>
                                                                {/* {
                                                                    category && category.name === 'Accessories' ? <span style={{ marginLeft: '30px' }}>Size: Oversize</span> : (
                                                                        <select className="form-control" id="category_field" value={size} onChange={(e) => setSize(e.target.value)} style={{ marginLeft: '30px', width: '12%' }}>
                                                                            {
                                                                                category && category.name === 'Clothing' ? (

                                                                                    size1.map(s => (
                                                                                        <option key={s} value={s} >{s}</option>
                                                                                    ))

                                                                                ) : (
                                                                                    category && category.name === 'Shoes' ? (
                                                                                        size2.map(s => (
                                                                                            <option key={s} value={s} >{s}</option>
                                                                                        ))
                                                                                    ) : (
                                                                                        <span style={{ marginLeft: '30px' }}>Size: Oversize</span>
                                                                                    )
                                                                                )

                                                                            }
                                                                        </select>
                                                                    )
                                                                } */}

                                                            </div>
                                                            <button type="button" className="btn-cart" disabled={product.product_qty === 0} onClick={addToCart}>Add to cart</button>
                                                        </>
                                                    ) : null
                                                }


                                                <div className="row">
                                                    <div className="rating w-50">

                                                        <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                                            <div className="modal-dialog" role="document">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body">

                                                                        <ul className="stars" >
                                                                            <li className="star"><i className="fa fa-star"></i></li>
                                                                            <li className="star"><i className="fa fa-star"></i></li>
                                                                            <li className="star"><i className="fa fa-star"></i></li>
                                                                            <li className="star"><i className="fa fa-star"></i></li>
                                                                            <li className="star"><i className="fa fa-star"></i></li>
                                                                        </ul>

                                                                        <textarea
                                                                            name="review"
                                                                            id="review" className="form-control mt-3"
                                                                            value={comment}
                                                                            onChange={(e) => setComment(e.target.value)}
                                                                        >

                                                                        </textarea>

                                                                        <button className="btn my-3 float-right review-btn px-4 text-black" onClick={reviewHandler} data-dismiss="modal" aria-label="Close">Submit</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h4>Descriptions:</h4>
                                    <p className="product-description">{product.product_description}</p>

                                    <div className="product-list-reviews">
                                        <div class="reviews w-50">
                                            <h4>Other's Reviews:</h4>
                                            <hr />
                                            {
                                                product.reviews && product.reviews.length > 0 ? (
                                                    <ListReviews reviews={product.reviews} />
                                                ) : (
                                                    <h5>No reviews</h5>
                                                )
                                            }

                                        </div>

                                    </div>
                                </div>
                            </section>

                        </Fragment >
                    )
            }
        </>
    )
}

export default ProductDetails
