import { ToastrService } from 'ngx-toastr';
import { CustomerService } from './../../shared/customer.service';
import { Customer } from './../../shared/customer.model';
import { OrderService } from './../../shared/order.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(public service: OrderService,
    private dialog: MatDialog,
    public customerService: CustomerService,
    private toaster: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute) { }

  customerList: Customer[];
  isValid: boolean = true;


  ngOnInit(): void {
    let orderID =  this.currentRoute.snapshot.paramMap.get('id');
    if (orderID == null) {
      this.restForm();
    }
    else {
      this.service.getOrderByID(parseInt(orderID)).then(res=>{
        this.service.formData = res.order;
        this.service.orderItems = res.orderDetails;
      });
    }
    this.customerService.getCustomerList().then(res => this.customerList = res as Customer[]);

  }

  restForm(form?: NgForm) {
    if (form = null)
      form.resetForm();
    this.service.formData = {
      OrderID: null,
      OrderNo: Math.floor((100000 + Math.random() * 900000)).toString(),
      CustomerID: 0,
      PMethod: '',
      GTotal: 0,
      DeletedOrderItemIDs:''
    };
    this.service.orderItems = [];
  }

  addOrEditOrderItem(orderItemIndex, OrderID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, OrderID };
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    });
  }
  onDeleteOrderItem(orderItemID: number, i: number) {
    if(orderItemID!=null){
      this.service.formData.DeletedOrderItemIDs +=orderItemID + ",";
    }
    this.service.orderItems.splice(i, 1);
    this.updateGrandTotal();
  }

  updateGrandTotal() {
    this.service.formData.GTotal = this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);
    this.service.formData.GTotal = parseFloat((this.service.formData.GTotal).toFixed(2));

  }

  validateForm() {
    this.isValid = true;
    if (this.service.formData.CustomerID == 0) {
      this.isValid = false;
    } else if (this.service.orderItems.length == 0) {
      this.isValid = false;
    }
    return this.isValid;
  }

  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      this.service.saveOrUpdateOrder().subscribe(res => {
        this.restForm();
        this.toaster.success('Submitted Successfully', 'Restaurant App');
        this.router.navigate(['/orders/']);
      });
    }
  }

}
