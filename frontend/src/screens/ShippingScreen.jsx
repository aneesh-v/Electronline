import React, { useState} from 'react';
import { Button, Form} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userAction';
import FormContainer from '../components/FormContainer';
import {saveShippingAddress} from '../actions/cartActions'
import CheckoutSteps from './CheckoutSteps';


const ShippingScreen = ({history}) => {
	const cart = useSelector(state=> state.cart)
	const {shippingAddress} = cart

    const [address, setAddress] = useState(shippingAddress?.address)
    const [city, setCity] = useState(shippingAddress?.city)
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode)
    const [country, setCountry] = useState(shippingAddress?.country)
	const dispatch = useDispatch()

	const submitHandler = (e) =>{
		e.preventDefault()
		dispatch(saveShippingAddress({address, city, postalCode, country}))
		history.push('/payment')
	}
    return (
        <FormContainer>
			<CheckoutSteps step1 step2/>
            <h1>Shipping</h1>
            <Form.Group controlId='name'>
					<Form.Label>Address</Form.Label>
					<Form.Control
					name='address'
						type='text'
						placeholder='Enter Address'
						required
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					></Form.Control>
                    <Form.Label>City</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter City'
						required
						value={city}
						onChange={(e) => setCity(e.target.value)}
					></Form.Control>
                    <Form.Label>Postal Code</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter Postal Code'
						required
						value={postalCode}
						onChange={(e) => setPostalCode(e.target.value)}
					></Form.Control>
                    <Form.Label>Country</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter Country'
						required
						value={country}
						onChange={(e) => setCountry(e.target.value)}
					></Form.Control>
				</Form.Group>
					<Button onClick={submitHandler} variant='primary'>CONTINUE</Button>
        </FormContainer>
    )
}

export default ShippingScreen
