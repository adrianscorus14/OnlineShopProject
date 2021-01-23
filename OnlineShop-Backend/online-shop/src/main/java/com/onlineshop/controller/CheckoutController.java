package com.onlineshop.controller;

import com.onlineshop.dto.Purchase;
import com.onlineshop.dto.PurchaseResponse;
import com.onlineshop.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    @Autowired
    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService=checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        PurchaseResponse purchaseResponse=checkoutService.placeOrder(purchase);
        return purchaseResponse;
    }
}
