import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from "@angular/forms";
import {ProductService} from '../../product/product.service';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {Customer} from '../../customer/customer';
import * as _ from 'underscore';
import {Product} from '../../product/product';
import {Area} from "../../area/area";
import {Subscription} from "rxjs";
import {Quotation} from '../quotation';
import {QuotationService} from '../quotation.service';

@Component({
  selector: 'app-quotation-create',
  templateUrl: './quotation-create.component.html',
  styleUrls: ['./quotation-create.component.css']
})
export class QuotationCreateComponent implements OnInit {

  public productList: any[] = [];
  showSuccess: boolean = false;
  showError: boolean = false;
  public quotationCreateForm: FormGroup;
  public customerList: Customer[] = [];
  public resCustomer: Customer;
  private subscription: Subscription;
  public quotation: Quotation;
  public allProductCounter = 1;
  public allProducts: any[] = [];
  public isSaved: boolean = false;
  public resultQuotation;


  constructor(private quotationService: QuotationService, private fb: FormBuilder, private customerService: CustomerService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.buildForm();
    this.getProductList();
    this.getAllCustomers();
  }

  buildForm() {
    let date = Date.now();
    this.quotationCreateForm = this.fb.group({
      customer_id: [''],
      username: [''],
      email: [''],
      fullname: [''],
      location: [''],
      area: [''],
      city: [''],
      mobile_primary: [''],
      mobile_secondary: [''],
      //amount_due: [''],
      total: [''],
      discount: [0],
      date: [date],
     // status: ['Due'],
      productList: []
    });
  }

  getAllCustomers() {
    this.customerService.getAllCustomers('all')
      .subscribe(
        (res) => {
          this.customerList = res;
        },
        (err) => {

        }
      );
  }

  getCustomer(event: any) {
    this.resCustomer = _.find(this.customerList, function (item) {
      return item['_id'] == event.target.value;
    });

    this.quotationCreateForm.patchValue({
      username: this.resCustomer.username,
      email: this.resCustomer.email,
      fullname: this.resCustomer.fullname,
      location: this.resCustomer.location,
      city: this.resCustomer.city,
      mobile_primary: this.resCustomer.mobile_primary,
      mobile_secondary: this.resCustomer.mobile_secondary,
    });

    this.resCustomer.productData = [];
    if (this.resCustomer.area) {
      this.areaService.getAreaById(this.resCustomer.area)
        .subscribe(
          (res: Area) => {
            this.resCustomer.areaData = res;
            this.quotationCreateForm.patchValue({
              area: this.resCustomer.areaData.name
            });
          },
          (err) => {

          }
        )
    }
  }

  getProductList() {
    this.productList = [];
    this.productService.getAllProduct()
      .subscribe(
        (res) => {
          _.each(res, (item) => {
            if (item['status']) {
              this.productList.push(item);
            }
          });
        },
        (err) => {
          console.log("ERROR from productList");
        },
        () => {
          this.allProducts.push(this.productList[0]);
          this.quotationCreateForm.patchValue({
            total: this.productList[0].rate
          })
        }
      )
  }


  removeProduct(index) {
    this.allProductCounter--;
    this.allProducts.splice(index, 1);
  }

  addProduct() {
    this.allProductCounter++;
    let newProduct = this.productList[0];
    this.allProducts.push(newProduct);
    this.updateTotal();
  }

  onProductChange(event: any, index) {
    let result = _.find(this.productList, function (item) {
      return item['_id'] == event.target.value;
    })
    this.allProducts[index] = result;
    this.updateTotal();
  }

  createRange(number) {
    let items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  updateTotal() {
    let total = 0;
    _.each(this.allProducts, (product) => {
      total += product['rate'];
    });
    this.quotationCreateForm.patchValue({
      total: total
    })
  }

  submitQuotationCreateForm() {
    let product_list = _.pluck(this.allProducts, '_id');
    this.quotationCreateForm.patchValue({
      productList: product_list,
      customer_id: this.resCustomer['_id']
    });

    this.quotationService.createNewQuotation(this.quotationCreateForm.value)
      .subscribe(
        (res) => {
          this.resultQuotation = res;
          this.isSaved = true;
        }
      )
  }
}
