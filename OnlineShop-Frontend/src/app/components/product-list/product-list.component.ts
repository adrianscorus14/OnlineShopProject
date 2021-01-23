import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  products:Product[]=[];
  currentCategoryId:number=1;
  previousCategoryId: number=1;
  searchMode:boolean=false;
//new properties for pagination
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElements:number=0;


  previousKeyword:string=""
  



  constructor(private productService:ProductService,private route:ActivatedRoute,private cartService:CartService) { 
    
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(()=>{

      this.listProducts();
    });
    
  }


  listProducts(){

    this.searchMode=this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();

    }else{

      this.handleListProducts();
    }
  }

  handleListProducts(){
     //check if id parameter is available
     const hasCategoryId:boolean=this.route.snapshot.paramMap.has('id');

     if(hasCategoryId){
       //get the id parameter and convert it into a number
       this.currentCategoryId=+this.route.snapshot.paramMap.get('id')!;
     }else{
 
       //if no category id is available set default category id to 1
 
       this.currentCategoryId=1;
     }

     //check if we have different category than previous
     //if we have different category id than previous reset page number to 1
     if(this.previousCategoryId!=this.currentCategoryId){
       this.thePageNumber=1;
     }

     this.previousCategoryId=this.currentCategoryId;

     console.log("currentCategoryId="+this.currentCategoryId+",thePageNumber=" +this.thePageNumber);

 
     //get the products for the given category id 
     this.productService.getProductListPaginate(this.thePageNumber-1,this.thePageSize,this.currentCategoryId).subscribe(this.processResult());

  }

  processResult(){
    return data =>{
      this.products=data._embedded.products;
      this.thePageNumber=data.page.number+1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;
    };
    
  }

  updatePageSize(pageSize:number){
    this.thePageSize=pageSize;
    this.thePageNumber=1;
    this.listProducts();
  }

  handleSearchProducts(){

    const theKeyword:string=this.route.snapshot.paramMap.get('keyword')!;
    if(this.previousKeyword!=theKeyword){
      this.thePageNumber=1
    }
    this.previousKeyword=theKeyword;
    console.log("theKeyword="+theKeyword+",thePageNumber=" +this.thePageNumber);

    //search for products by given keyword and pagination
    this.productService.searchProductsPaginate(this.thePageNumber-1, this.thePageSize,theKeyword).subscribe(this.processResult());
  }


  addToCart(theProduct:Product){
    console.log(`Adding to cart ${theProduct.name},${theProduct.unitPrice}`);

    const theCartItem=new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
    
    
    
  }

}
