import React, { Fragment, useState, useEffect } from 'react'
import MetaData from './Layout/Metadata'
import axios from 'axios'
import Pagination from 'react-js-pagination'
import Product from './Product/Product'
import Loader from './Layout/Loader'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useParams } from "react-router-dom"

const categories = [
    'Electronics',
    'Cameras',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    "Books",
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
]
const Home = () => {
    let { keyword } = useParams()
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [error, setError] = useState()
    const [productsCount, setProductsCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [resPerPage, setResPerPage] = useState(0)
    const [filteredProductsCount, setFilteredProductsCount] = useState(0)
    const [price, setPrice] = useState([1, 1000]);
    const [category, setCategory] = useState('');

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }


    const getProducts = async (page = 1, keyword = '', price, category='') => {
        let link = ''

        link = `http://localhost:8001/api/v1/products/?page=${page}&keyword=${keyword}&price[lte]=${price[1]}&price[gte]=${price[0]}`
        
        if (category) {
            link = `${process.env.REACT_APP_API}/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}`
        }

        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        setProducts(res.data.products)
        setResPerPage(res.data.resPerPage)
        setProductsCount(res.data.productsCount)
        setFilteredProductsCount(res.data.filteredProductsCount)
        setLoading(false)
    }
    useEffect(() => {
        getProducts(currentPage, keyword, price, category)
    }, [currentPage, keyword, price, category]);

    let count = productsCount
    if (keyword) {
        count = filteredProductsCount
    }
    return (
        <>
            {loading ? <Loader /> : (<Fragment>
                <MetaData title={'Buy Best Products Online'} />
                <div className="container container-fluid">

                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{
                                                    1: `$1`,
                                                    1000: `$1000`
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]}
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />
                                            <hr className="my-5" />
                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Categories
                                                </h4>
                                                <ul className="pl-0">
                                                    {categories.map(category => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none'
                                                            }}
                                                            key={category}
                                                            onClick={() => setCategory(category)}
                                                        >
                                                            {category}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {products.map(product => (
                                                <Product key={product._id} product={product} col={4} />
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                products.map(product => (
                                    <Product key={product._id} product={product} col={3} />
                                ))
                            )}
                        </div>
                    </section>
                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>)}
                </div>
            </Fragment>
            )}
        </>
    )
}

export default Home