import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../layouts/MetaData'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';
import { useDispatch, useSelector } from 'react-redux'
import { getProductCollections } from '../../actions/productActions'
import Product from './Product'
import Loader from '../layouts/Loader'
import { useAlert } from 'react-alert'
import Pagination from "react-js-pagination"
import { getCategoryDetailsById } from '../../actions/categoryActions'
import { getBrandDetailsById } from '../../actions/brandActions'

const Collections = ({ match, history }) => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const [currentPage, setCurrentPage] = useState(1)
    const [noOfElement, setNoOfElement] = useState(8)
    const { brand } = useSelector(state => state.brandDetails)
    const { category } = useSelector(state => state.categoryDetails)
    const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products)
    const collections = match.params.collections
    const collection = match.params.collection

    useEffect(() => {
        if (error) {
            return alert.error(error)
        }
        dispatch(getProductCollections(currentPage, collections, collection))

        if(collections === 'category'){

            dispatch(getCategoryDetailsById(collection))
        }
        if(collections === 'brand'){

            dispatch(getBrandDetailsById(collection))
        }
    }, [dispatch, alert, error, currentPage, collections, collection])

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    let count = productsCount
    const loadMore = () => {
        setNoOfElement(noOfElement + noOfElement);
    };

    if (filteredProductsCount <= productsCount && currentPage === 1) {
        count = filteredProductsCount
    }
    const isCheckEndOfPage = noOfElement >= productsCount ? true : false;
    const slice = products.slice(0, noOfElement);

    return (
        <Fragment>
            <MetaData title={'Shop'} />
            {/* shop */}
            <section className="shop">
                <div className="container">
                    <div className="shop-title">
                        <h2>Collections</h2>
                        <p>{collections === 'brand' ? brand.brand_name : category.category_name} Collections</p>
                        <span>Total: {filteredProductsCount ? filteredProductsCount : 0} products</span>
                    </div>
                    {
                        loading ? <Loader /> : (
                            <>
                                <div className="row">
                                    {/* <Fragment>
                                        <div className="col-3">
                                            <div className="banner">
                                                {
                                                    collection && collection === 'Adidas' ? (
                                                        <>
                                                            <img src="/images/banner-adidas1.jpg" className="img-banner" alt="" />
                                                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis odit, amet quod sed sequi aperiam blanditiis tempore id quae, impedit suscipit facilis quo, molestias velit recusandae voluptatum qui magnam porro.
                                                                Reiciendis culpa eveniet, maxime fuga repellat distinctio neque est accusantium iure a, ducimus odit qui eligendi nostrum quisquam voluptatum vitae unde sequi hic commodi ratione cum eius pariatur explicabo! Obcaecati.</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {
                                                                collection && collection === 'Nike' ? (
                                                                    <>
                                                                        <img src="/images/banner-nike2.jpg" className="img-banner" alt="" />
                                                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis odit, amet quod sed sequi aperiam blanditiis tempore id quae, impedit suscipit facilis quo, molestias velit recusandae voluptatum qui magnam porro.
                                                                            Reiciendis culpa eveniet, maxime fuga repellat distinctio neque est accusantium iure a, ducimus odit qui eligendi nostrum quisquam voluptatum vitae unde sequi hic commodi ratione cum eius pariatur explicabo! Obcaecati.</p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {
                                                                            collection && collection === 'Puma' ? (
                                                                                <>
                                                                                    <img src="/images/banner-puma2.jpg" className="img-banner" alt="" />
                                                                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis odit, amet quod sed sequi aperiam blanditiis tempore id quae, impedit suscipit facilis quo, molestias velit recusandae voluptatum qui magnam porro.
                                                                                        Reiciendis culpa eveniet, maxime fuga repellat distinctio neque est accusantium iure a, ducimus odit qui eligendi nostrum quisquam voluptatum vitae unde sequi hic commodi ratione cum eius pariatur explicabo! Obcaecati.</p>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <img src="/images/banner1.jpg" className="img-banner" alt="" />
                                                                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis odit, amet quod sed sequi aperiam blanditiis tempore id quae, impedit suscipit facilis quo, molestias velit recusandae voluptatum qui magnam porro.
                                                                                        Reiciendis culpa eveniet, maxime fuga repellat distinctio neque est accusantium iure a, ducimus odit qui eligendi nostrum quisquam voluptatum vitae unde sequi hic commodi ratione cum eius pariatur explicabo! Obcaecati.</p>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </>

                                                                )
                                                            }
                                                        </>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </Fragment> */}

                                    <Fragment>
                                        <div className="col-12">
                                            <div className="row">
                                                {
                                                    filteredProductsCount === 0 ? (
                                                        <div className="col-12">
                                                            <h3 className="empty">Products is empty</h3>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {
                                                                slice && slice.map(product => (
                                                                    <Product product={product} col={3} history={history} />
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }

                                            </div>
                                            {/* {
                                                resPerPage <= count && (

                                                    <div className="product-pagination">
                                                        <Pagination
                                                            activePage={currentPage}
                                                            itemsCountPerPage={resPerPage}
                                                            totalItemsCount={filteredProductsCount}
                                                            onChange={setCurrentPageNo}
                                                            nextPageText={'Next'}
                                                            prevPageText={'Prev'}
                                                            firstPageText={'First'}
                                                            lastPageText={'Last'}
                                                            itemClass="page-item"
                                                            linkClass="page-link"
                                                        />
                                                    </div>
                                                )
                                            } */}
                                        </div>
                                        <button
                                        className="btn btn-block btn-outline-dark"
                                        onClick={() => loadMore()}
                                        hidden={isCheckEndOfPage}
                                    >
                                        Load More
                                    </button>
                                    </Fragment>
                                </div>

                            </>
                        )
                    }
                </div>
            </section>
        </Fragment >
    )
}

export default Collections
