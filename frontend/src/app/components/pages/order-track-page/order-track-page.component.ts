import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd } from '@angular/router';
import { catchError, of } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-track-page',
  templateUrl: './order-track-page.component.html',
  styleUrls: ['./order-track-page.component.css']
})
export class OrderTrackPageComponent implements OnInit {

  order!:Order;
  toastrService!:ToastrService;
  router!:Router;
  constructor(activatedRoute: ActivatedRoute,
              orderService:OrderService, toastrService:ToastrService, router:Router) {
     const params = activatedRoute.snapshot.params;
     if(!params.orderId) return;
     this.toastrService = toastrService;
     this.router = router;
    //  orderService.trackOrderById(params.orderId).subscribe(order => {
    //    this.order = order;
    //  })
    orderService.trackOrderById(params.orderId).pipe(catchError((error) => {
      this.toastrService.error(error.error);
      console.log(error);
      this.router.navigateByUrl('/')
      return of(null);
    })).subscribe(order => {
     if(order) {this.order = order;}
    })

  }

  ngOnInit(): void {
  }

}