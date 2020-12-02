import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProductDetails, updateProduct } from '../actions/productActions';
import FormContainer from '../components/FormContainer';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductEditScreen = ({ match, history }) => {
	const productId = match.params.id;
	const [name, setName] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState('');
	const [price, setPrice] = useState(0);
	const [countInStock, setCountInStock] = useState(0);
	const [uploading, setUploading] = useState(false);

	const dispatch = useDispatch();
	const productDetails = useSelector((state) => state.productDetails);
	const { loading, product, error } = productDetails;
	const updatedProduct = useSelector((state) => state.productUpdate);
	const {
		loading: loadingUpdate,
		product: productUpdate,
		success: successUpdate,
		error: errorUpdate,
	} = updatedProduct;

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			history.push('/admin/productlist');
		} else {
			if (!product.name || product._id !== productId) {
				dispatch(listProductDetails(productId));
			} else {
				setName(product.name);
				setBrand(product.brand);
				setCategory(product.category);
				setDescription(product.description);
				setImage(product.image);
				setPrice(product.price);
				setCountInStock(product.countInStock);
			}
		}
	}, [dispatch, productId, history, product, successUpdate]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			updateProduct({
				_id: productId,
				name,
				brand,
				category,
				description,
				image,
				price,
				countInStock,
			})
		);
	};

	const uploadFileHandler = async (e) =>{
		const file = e.target.files[0]
		const formData = new FormData()
		formData.append('image', file)
		setUploading(true)
		try {
			const config = {
				headers: {
					'Content-Type' : 'multipart/form-data'
				}
			}
			const {data} = await axios.post('/api/upload', formData, config)
			setImage(data)
			setUploading(false)
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<>
			<Link to='/admin/productList' className='btn btn-light my-3'>
				Go Back
			</Link>
			<FormContainer>
				<h2>Edit Product</h2>
                {loadingUpdate && <Loader/>}
                {errorUpdate && <Message vairant='danger'>{errorUpdate}</Message>}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Enter Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group controlId='brand'>
							<Form.Label>Enter Brand</Form.Label>
							<Form.Control
								type='text'
								placeholder='Brand name'
								value={brand}
								onChange={(e) => setBrand(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group controlId='category'>
							<Form.Label>Enter Category</Form.Label>
							<Form.Control
								type='text'
								placeholder='Category name'
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group controlId='image'>
							<Form.Label>Enter Image URL / Choose from Browser</Form.Label>
							<Form.Control
								type='text'
								placeholder='Image URL'
								value={image}
								onChange={(e) => setImage(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.File 
							id='image-file'
							label='Choose Image'
							custom
							onChange={uploadFileHandler}
						>
						</Form.File>
						{uploading && <Loader/>}
						<Form.Group controlId='price'>
							<Form.Label>Enter Prouct Price</Form.Label>
							<Form.Control
								type='number'
								placeholder='Product price here'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group controlId='countInStock'>
							<Form.Label>Enter the Total Stock</Form.Label>
							<Form.Control
								type='number'
								placeholder='Total Stock here'
								value={countInStock}
								onChange={(e) => setCountInStock(e.target.value)}
							></Form.Control>
						</Form.Group>
                        <Form.Group controlId='description'>
							<Form.Label>Enter Description</Form.Label>
							<Form.Control
                                as= 'textarea'
                                row= {5}
								type='text'
								placeholder='Describe the product'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Button type='submit' variant='primary'>
							Update Product
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
};

export default ProductEditScreen;
