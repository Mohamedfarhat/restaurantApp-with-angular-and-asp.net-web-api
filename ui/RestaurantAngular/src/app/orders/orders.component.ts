import { Router } from '@angular/router';
import { OrderService } from 'src/app/shared/order.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderList;
  constructor(private serv: OrderService,
    private router: Router,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.serv.getOrderList().then(res => this.orderList = res);

  }
  openForEdit(orderID: number) {
    this.router.navigate(['/order/edit/' + orderID])
  }

  onOrderDelete(id: number) {
    if (confirm('Are u sure to delete this record?')) {
      this.serv.deleteOrder(id).then(res => {
        this.refreshList();
        this.toaster.warning("Deleted Successfully.", "Restaurant App.")
      });
    }
  }
}
