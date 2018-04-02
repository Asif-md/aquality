import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DeliveryService} from '../delivery.service';
import {Delivery} from '../delivery';
import {Customer} from '../../customer/customer';
import {Product} from '../../product/product';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {ProductService} from '../../product/product.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-delivery-all',
  templateUrl: './delivery-all.component.html',
  styleUrls: ['./delivery-all.component.css']
})
export class DeliveryAllComponent implements OnInit {

  public deliveryList: Delivery[] = [];
  public partialDelivery: Delivery;
  totalDeliveryCount: number = 0;
  public paginator = 1;

  constructor(private customerService: CustomerService, private router: Router, private deliveryService: DeliveryService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.deliveryService.getAllDeliveryCount()
      .subscribe(
        (res) => {
          this.totalDeliveryCount = res.count;
        }
      );
    this.getAllDelivery();

  }

  getAllDelivery() {
    this.deliveryList = [];
    this.deliveryService.getAllDelivery(this.paginator)
      .subscribe(
        (res: Delivery[]) => {
          if (res.length == 0) {
            this.deliveryList = [];
          } else {
            _.each(res, (delivery: Delivery) => {
              let customer: Customer;
              this.customerService.getCustomerDetails(delivery.customer_id)
                .subscribe(
                  (res: Customer) => {
                    customer = res;
                    customer.productData = [];
                    if (delivery.productList.length > 0) {
                      _.each(delivery.productList, (element) => {
                        this.productService.getProductById(element)
                          .subscribe(
                            (res: Product) => {
                              customer['productData'].push(res);
                            }
                          )
                      });
                    }

                    this.areaService.getAreaById(customer.area)
                      .subscribe(
                        (res) => {
                          customer['areaData'] = res;
                        }
                      )
                      delivery.customerData = customer;
                    this.deliveryList.push(delivery);
                  }
                )
            });
          }
        },
        (err) => {
          console.log('ERROR in getAllDelivery');
        }
      )
  }

  toggleSearchStatus(event: any) {
    console.log(event);
  }

  filterChange(event: any) {

  }

  quickSearch(event: any) {

  }

  changeStatus(status: string, delivery: Delivery) {
    if (status == 'Paid') {
      this.setPaidDateCounter(delivery);
      delivery.status = 'Paid';
      delivery.paid_date = Date.now();
      delivery.amount_due = 0;
    } else if (status == 'Due') {
      delivery.status = 'Due';
      delivery.amount_due = delivery.total;
      delivery.amount_partially_paid = [];
    } else if (status == 'Partially Paid') {
      this.partialDelivery = delivery;
    }

    delivery['type'] = 'all';

    this.deliveryService.changeDeliveryStatus(delivery)
      .subscribe(
        (res) => {

        }
      )
  }

  //  for pagination
  onPaginate(event: any) {
    this.paginator = event;
    this.getAllDelivery();
  }


  setPaidDateCounter(delivery: Delivery) {
    this.deliveryService.setPaidDateCounter(delivery)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log("Error in setpaiddatecounter");
        }
      )
  }

}
