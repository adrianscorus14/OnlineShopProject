import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {



  checkOutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];

  billingAddressStates: State[] = [];



  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService,
    private cartService: CartService, private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();







    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        email: new FormControl!('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        phoneNumber: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl!('', [Validators.required]),
        country: new FormControl!('', [Validators.required]),
        zipCode: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace])

      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl!('', [Validators.required]),
        country: new FormControl!('', [Validators.required]),
        zipCode: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace])

      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl!('', [Validators.required]),
        nameOnCard: new FormControl!('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl!('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl!('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populate credit card month and years
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth:" + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months" + JSON.stringify(data));
        this.creditCardMonths = data;

      }
    );

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years:" + JSON.stringify(data));
        this.creditCardYears = data;

      }
    );


    //populate countries 
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries:" + JSON.stringify(data));
        this.countries = data;
      }
    );


  }

  reviewCartDetails() {
    //subscribe to cartService subjects(totalQuantity and totalPrice)

    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    );
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    );
  }

  get firstName() { return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkOutFormGroup.get('customer.lastName'); }
  get email() { return this.checkOutFormGroup.get('customer.email'); }
  get phoneNumber() { return this.checkOutFormGroup.get('customer.phoneNumber'); }

  get shippingAddressStreet() { return this.checkOutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkOutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkOutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkOutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipcode() { return this.checkOutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkOutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkOutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkOutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkOutFormGroup.get('billingAddress.country'); }
  get billingAddressZipcode() { return this.checkOutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkOutFormGroup.get('creditCard.cardType'); }
  get creditNameOnCard() { return this.checkOutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkOutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkOutFormGroup.get('creditCard.securityCode'); }



  onSubmit() {
    console.log("handle the submit button");

    if (this.checkOutFormGroup!.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems for cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();
    //populate purchase-customer
    purchase.customer = this.checkOutFormGroup.controls['customer'].value;


    //populate purchse-shipping and billing address
    purchase.shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    purchase.shippingAddress.country = shippingCountry.name;
    purchase.shippingAddress.state = shippingState.name;

    purchase.billingAddress = this.checkOutFormGroup.controls['billingAddress'].value;
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    purchase.billingAddress.country = billingCountry.name;
    purchase.billingAddress.state = billingState.name;

    //populate purchase order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call REST API via CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\nOrder tracking number:${response.orderTrackingNumber}`);
          //reset the cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error:${err.message}`);
        }
      }
    );

  }
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form data
    this.checkOutFormGroup.reset();

    //navigate back to the products main page
    this.router.navigateByUrl('/products');
  }

  copyShippingToBilling(event) {
    if (event.target.checked) {
      this.checkOutFormGroup.controls.billingAddress.setValue(this.checkOutFormGroup.controls.shippingAddress.value);
    } else {
      this.checkOutFormGroup.controls.billingAddress.reset();
    }

  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup!.value.expirationYear);

    let startMonth: number;
    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;

    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months" + JSON.stringify(data));
        this.creditCardMonths = data;

      }
    );

  }
  getStates(formGroupName: string) {
    const formGroup = this.checkOutFormGroup.get(formGroupName)!;
    const countryShortName = formGroup.value.country.shortName;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country shortname:${countryShortName}`);
    console.log(`${formGroupName} country name:${countryName}`);

    this.shopFormService.getStates(countryShortName).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // formGroup.get('state')!.setValue(data)[0];
      }
    );


  }

}
