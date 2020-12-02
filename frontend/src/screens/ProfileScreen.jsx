import React, { useState, useEffect } from 'react'
import { Button, Form, Col, Row, Table } from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails } from '../actions/userAction'
import {updateUserProfile} from '../actions/userAction'
import {listMyOrder} from '../actions/orderActions'

const ProfileScreen = ({ location, history }) => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState(null)

	const dispatch = useDispatch()
	const userDetails = useSelector((state) => state.userDetails)
	const { loading, user, error } = userDetails

	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin
	
	const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
	const { success } = userUpdateProfile

	const orderListMy = useSelector((state) => state.orderListMy)
	const { loading: loadingOrder, orders, error:errorOrder } = orderListMy

    
	useEffect(() => {
		if (!userInfo) {
			history.push('/login')
		} else {
			if (!user?.name) { 
				dispatch(getUserDetails('profile'))
				dispatch(listMyOrder())
			} else {
				setName(user?.name);
				setEmail(user?.email);
			}
		}
	}, [dispatch, history, userInfo, user])

	const submitHandler = (e) => {
		e.preventDefault();
		if (!password === confirmPassword) {
			setMessage('Password do not match')
		} else {
			dispatch(updateUserProfile({id: user._id, name, email, password}))
		}
	};
	return (
		<Row>
			<Col md={3}>
				<h1>User profile</h1>
				{error && <Message variant='danger'>{error}</Message>}
				{success && <Message variant='success'>Profile updated</Message>}
				{message && <Message variant='danger'>{message}</Message>}
				{loading && <Loader />}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='name'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter Name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='email'>
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type='email'
							placeholder='Email Address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='confirmPassword'>
						<Form.Label>Confirm password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm Password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Button type='submit' variant='primary'>
						UPDATE
					</Button>
				</Form>
			</Col>
			<Col md={9}><h2>My Orders</h2>
	{loadingOrder ? <Loader /> : errorOrder ? <Message variant='danger'>{errorOrder}</Message> : (
		<Table striped bordered hover responsive className='table-sm'>
			<thead >
				<tr>
					<th width="180" >ID</th>
					<th>DATE</th>
					<th>TOTAL</th>
					<th>PAID</th>
					<th>DELIVERED</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{orders.map(order => (
					<tr key={order._id}>
						<td>{order._id}</td>
						<td>{order.createdAt.substring(0, 10)}</td>
						<td>$ {order.totalPrice}</td>
						<td>{order.isPaid ? order.paidAt.substring(0, 10) : (
							<i className='fas fa-times' style={{color: "red"}}></i>
						)}</td>
						<td>{order.isDelivered ? order.deliveredAt : (
							<i className='fas fa-times' style={{color: "red"}}></i>
						)}</td>
						<td>
							<LinkContainer to={`order/${order._id}`}>
								<Button variant='light' className='btn-sm'>Details</Button>
							</LinkContainer>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	)}
	</Col>
		</Row>
	);
};

export default ProfileScreen;
