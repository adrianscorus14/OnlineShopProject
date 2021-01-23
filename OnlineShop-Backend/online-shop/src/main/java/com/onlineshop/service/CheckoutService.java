package com.onlineshop.service;

import com.onlineshop.dto.Purchase;
import com.onlineshop.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
