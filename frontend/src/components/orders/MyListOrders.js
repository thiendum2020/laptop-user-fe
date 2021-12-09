import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTableV5 } from 'mdbreact'
import NumberFormat from 'react-number-format'
import MetaData from '../layouts/MetaData'
import Loader from '../layouts/Loader'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { myOrders, clearErrors } from '../../actions/orderActions'
import MenuProfile from '../user/MenuProfile'

const MyListOrders = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const { userLogin } = useSelector(state => state.auth)
    const { loading, error, orders } = useSelector(state => state.myOrders)

    useEffect(() => {
        dispatch(myOrders(userLogin.id))

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error, userLogin.id])

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Created At',
                    field: 'createdAt',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                },
            ],
            rows: []
        }
        orders && orders.sort(function (a, b) {
            return b.id-a.id;
        })
        orders && orders.forEach(order => {
            data.rows.push({
                id: order.id,
                createdAt: String(order.ngaydat),
                amount: <NumberFormat value={order.total_price} displayType={'text'} thousandSeparator={true} prefix={'đ '} />,
                status: order.status && String(order.status).includes('Đang giao')
                    ? <p style={{ color: 'blue' }}>{order.status}</p>
                    : order.status && String(order.status).includes('Đã hủy')
                        ? <p style={{ color: 'red' }}>{order.status}</p>
                        : order.status && String(order.status).includes('Đã nhận')
                            ? <p style={{ color: 'green' }}>{order.status}</p>
                            : <p style={{ color: 'orange' }}>{order.status}</p>,
                actions:
                    <Link to={`/profile/order/${order.id}`} className="btn-order-details">
                        <i className="fa fa-eye"></i>
                    </Link>
            })
        })

        return data
    }

    return (
        <Fragment>

            <MetaData title={'My Orders'} />
            <div className="container">

                <div class="row">
                    <div className="col-2">
                        <MenuProfile />
                    </div>
                    <div className="col-10">
                        <div className="my-orders">
                            <h3>My Orders</h3>

                            {
                                loading ? (
                                    <>
                                        <div style={{ padding: '50px 0 100px 0' }}></div>
                                        <Loader />
                                    </>
                                )
                                    : (
                                        orders && orders.length === 0 ? (
                                            <>
                                                <h4 style={{ margin: '60px 0 300px' }}>Orders is empty</h4>
                                            </>
                                        ) : (
                                            <MDBDataTableV5
                                                data={setOrders()}
                                                className="px-3"
                                                entriesOptions={[10, 20, 50]}
                                                entries={10}
                                                hover
                                                searchTop
                                                searchBottom={false}
                                                barReverse
                                            />
                                        )
                                    )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default MyListOrders
