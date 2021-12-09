import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layouts/MetaData'
import Loader from '../layouts/Loader'
import MenuProfile from '../user/MenuProfile'
import NumberFormat from 'react-number-format'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, listDetailOrder, cancelOrder, receiveOrder, clearErrors } from '../../actions/orderActions'
import { UPDATE_ORDER_RESET, ORDER_DETAILS_RESET, DETAIL_ORDER_LIST_RESET } from '../../constants/orderConstants'
import swal from 'sweetalert'

const OrderDetails = ({ match }) => {

    const alert = useAlert()
    const dispatch = useDispatch()
    const { userLogin } = useSelector(state => state.auth)
    const { listDetail, loading: loadingDetail, error: errorDetail }  = useSelector(state => state.listDetail)
    const { loading, error, order} = useSelector(state => state.orderDetails)
    // const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus, paidAt, deliveredAt, receivedAt, createdAt } = order
    // const { error: errorUpdateOrder, isUpdated } = useSelector(state => state.order)

    useEffect(() => {
        if(order){
            dispatch({ type: ORDER_DETAILS_RESET })
        }
        dispatch(getOrderDetails(match.params.id))
        if(listDetail) {
            dispatch({ type: DETAIL_ORDER_LIST_RESET })
            dispatch(listDetailOrder(match.params.id))
        }
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        // if (isUpdated) {
        //     alert.success('Order updated successfully');
        //     dispatch({ type: UPDATE_ORDER_RESET })
        // }
    }, [dispatch, alert, error, match.params.id])

    // const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}`
    // const isCancel = orderStatus && orderStatus === 'Processing' ? true : false
    // const isReceive = orderStatus && orderStatus === 'Delivering' ? true : false
    // const time = createdAt && String(createdAt).substring(0, 10)
    const cancelMyOrder = () => {

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    dispatch(cancelOrder(match.params.id))
                    swal("Poof! Your order has been canceled!", {
                        icon: "success",
                    })
                } else {
                    swal("Haha Nope!")
                }
            })
    }

    const receivedOrder = () => {
        let status = {
            orderStatus: 'Received'
        }
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    dispatch(receiveOrder(match.params.id))
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    })
                } else {
                    swal("Your imaginary file is safe!")
                }
            })
    }

    return (
        <Fragment>
            <MetaData title={'Order Details'} />
            <div className="container">
                <div class="row">
                    <div className="col-2">
                        <MenuProfile />
                    </div>
                    <div className="col-10">
                        {
                            loading ? (
                                <>
                                    <div style={{ paddingTop: '100px' }}></div>
                                    <Loader />
                                    <div style={{ paddingTop: '100px' }}></div>
                                </>
                            ) : (

                                <Fragment>
                                    <div className="my-orders">
                                        <div className="row">
                                            <div className="col-8">
                                                <h4 className="mb-4">Order #{order && order.data.id}</h4>

                                                <p><b>Name: </b> {userLogin && userLogin.username}</p>
                                                <p><b>Phone: </b> {order && order.data.phone_number}</p>
                                                <p><b>Address: </b>{order && order.data.address}</p>
                                                <p><b>Amount:</b> <NumberFormat value={order && order.data.total_price} displayType={'text'} thousandSeparator={true} prefix={''} /> đ</p>
                                                <p><b>Time:</b> {order && order.data.ngaydat}</p>

                                                <h5 className="my-4">Order Items:</h5>

                                                <hr />
                                                <div className="cart-item my-1">
                                                    { loadingDetail ? <Loader /> : listDetail && listDetail.map(item => (
                                                        <div key={item.detail_id} className="row my-5">
                                                            <div className="col-4 col-lg-2">
                                                                <img src={item.image[0].imageLink} alt={item.product_id} height="50" width="50" />
                                                            </div>

                                                            <div className="col-5 col-lg-5">
                                                                <Link to={`/product/${item.product_id}`}>
                                                                    <p>{item.name}</p>
                                                                </Link>
                                                            </div>


                                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                                <p><NumberFormat value={item.detailPrice} displayType={'text'} thousandSeparator={true} prefix={'đ '} /></p>
                                                            </div>

                                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                                <p>{item.detailQty} Piece(s)</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div id="order_summary">
                                                    {/* <p>Payment Method:
                                                        <span className="order-summary-values">{paymentInfo && paymentInfo.name}</span>
                                                    </p>
                                                    <p>Delivered at:
                                                        <span className={deliveredAt ? "greenColor order-summary-values" : "redColor order-summary-values"}>{deliveredAt ? `${String(deliveredAt).substring(0, 10)}` : "Not Delivery"}</span>
                                                    </p>
                                                    <p>Paid at:
                                                        <span className={paidAt ? "greenColor order-summary-values" : "redColor order-summary-values"}><span>{paidAt ? `${String(paidAt).substring(0, 10)}` : "Not Paid"}</span></span>
                                                    </p>
                                                    <p>Received at:
                                                        <span className={receivedAt ? "greenColor order-summary-values" : "redColor order-summary-values"}>{receivedAt ? `${String(receivedAt).substring(0, 10)}` : "Not Received"}</span>
                                                    </p> */}
                                                    <p>Order Status:
                                                        <span
                                                            className={
                                                                order.data.status && String(order.data.status).includes('Đang giao') ? "blueColor order-summary-values"
                                                                    : order.data.status && String(order.data.status).includes('Đã nhận') ? "greenColor order-summary-values"
                                                                        : order.data.status && String(order.data.status).includes('Đã hủy') ? "redColor order-summary-values"
                                                                            : "yellowColor order-summary-values"
                                                            }>
                                                            {order.data.status}
                                                        </span>
                                                    </p>
                                                    <hr />
                                                    <button className="btn btn-block btn-order-cancel" onClick={cancelMyOrder} hidden={order.data.status && String(order.data.status).includes('Chờ xác nhận') ? false : true}>Cancel Order</button>
                                                    <button className="btn btn-block btn-order-receive" onClick={receivedOrder} hidden={order.data.status && String(order.data.status).includes('Đang giao') ? false : true}>Received Order</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            )
                        }
                    </div>
                </div>
            </div>
        </Fragment >
    )
}

export default OrderDetails
