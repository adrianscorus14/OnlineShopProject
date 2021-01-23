import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})

export class CartService {


  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  storage: Storage = localStorage;

  constructor() {
    //read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;
      //compute totals based on data recieved
      this.computeCartTotals();
    }
  }

  addToCart(item: CartItem) {
    //check if we already have the item in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {

      //find the item in the cart based on item id 

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id == item.id)!;
    }
    //check if we found it 
    alreadyExistsInCart = (existingCartItem != undefined);

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(item);
    }

    //compute the cart total price and quantity
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentItem of this.cartItems) {
      totalPriceValue += currentItem.quantity * currentItem.unitPrice;
      totalQuantityValue += currentItem.quantity;
    }
    //publish the new values to subscribers

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);



    //log actual data for debugging purpose
    this.logCartData(totalPriceValue, totalQuantityValue);

    //persist the cart data
    this.persistCartItems();
  }
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("contents of the cart");
    for (let item of this.cartItems) {
      const subTotalPrice = item.quantity * item.unitPrice;
      console.log(`name:${item.name},quantity=${item.quantity},unitPrice=${item.unitPrice},subtotalprice${subTotalPrice}`);

    }
    console.log(`totalPrice:${totalPriceValue.toFixed(2)},totalQuantity:${totalQuantityValue}`);
    console.log("----------------------");

  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity == 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    //get the index of the item in the array
    const itemIndex = this.cartItems.findIndex(item => item.id == theCartItem.id);

    //once found, remove the item at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }


}

