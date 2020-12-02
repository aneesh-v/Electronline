import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {listOrders} from '../actions/orderActions'

const OrderListScreen = ({history}) => {
    const dispatch = useDispatch()
    const orderList = useSelector(state => state.orderList)
    const {orders, loading, error} = orderList
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    useEffect(()=>{
        if(userInfo && userInfo.isAdmin){
            dispatch(listOrders())
        }else {
            history.push('/login')
        }
    },[history,dispatch,userInfo])

        return(
            <>
                <h1>Orders</h1>
                {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                    <Table responsive striped hover bordered className='table-sm'>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>USER</td>
                                <td>DATE</td>
                                <td>TOTAL</td>
                                <td>PAID</td>
                                <td>DELEVERED</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order)=>(
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user}</td>
                                    <td>{order.createdAt}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.isPaid ? (order.paidAt.substring(0, 10)) : (
                                        <i className='fas fa-times' style={{color: 'red'}}></i>
                                    )}</td>
                                    <td>{order.isDelivered ? (order.deliveredAt.substring(0, 10)) : (
                                        <i className='fas fa-times' style={{color: 'red'}}></i>
                                    )}</td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button vairiant='light' className='btn-sm'>
                                                DETAILS
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}   
            </>
        )
            
}

export default OrderListScreen
