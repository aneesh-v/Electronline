import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import Loader from '../components/Loader'
import Message from '../components/Message'

const HomeScreen = ({match}) => {

	const keyword = match.params.keyword
	const dispatch = useDispatch();
	const productList = useSelector((state) => state.productList);
	const { loading, products, error } = productList;

	useEffect(() => {
		dispatch(listProducts(keyword));
	}, [dispatch, keyword]);

	return (
		<>
			{loading ? (
				<Loader/>
			) : error ? (
				<Message variant='danger' children={error} />
			) : (
				<Row>
					{products.map((product) => (
						<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
							<Product product={product} />
						</Col>
					))}
				</Row>
			)}
		</>
	);
};

export default HomeScreen;
