package com.onlineshop.dto;

import com.onlineshop.entity.Address;
import com.onlineshop.entity.Customer;
import com.onlineshop.entity.Order;
import com.onlineshop.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
