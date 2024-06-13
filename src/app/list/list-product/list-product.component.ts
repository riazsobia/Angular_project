import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {

  // szükséges változók a filterhez
  filterKey = 'id';
  phrase = '';
  // szükséges változók a filterhez
  indexPage = 1;
  pagiLength = 5;
  ArrayLength = 0;
  ascend = true;
  sortKey = '';


  cols: { title: string, key: string }[] = [
    { key: 'id', title: 'Id' },
    { key: 'catID', title: 'CatId' },
    { key: 'name', title: 'Name' },
    { key: 'type', title: 'Type' },
    { key: 'description', title: 'Description' },
    { key: 'price', title: 'Price' },
    { key: 'featured', title: 'Featured' },
    { key: 'active', title: 'Active' },
  ];

  lastDragKey = "";

  productProperties: string[] = Object.keys(new Product());

  productList: BehaviorSubject<Product[]> = this.productService.list$;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  onHeaderDragStart(event: DragEvent): void {
    this.lastDragKey = (event.target as HTMLTableHeaderCellElement).id;
  }

  onHeaderDrop(event: DragEvent): void {
    event.preventDefault();
    const targetID: string = (event.target as HTMLTableHeaderCellElement).id;
    const from = this.cols.findIndex(col => col.key === this.lastDragKey);
    const to = this.cols.findIndex(col => col.key === targetID);
    const temp = Object.assign({}, this.cols[from]);
    this.cols.splice(from, 1);
    this.cols.splice(to, 0, temp);
  }

  ngOnInit(): void {
    this.productService.getAll();
    this.productList.subscribe(data => { this.ArrayLength = data.length })
  }

  onLength(length: number) {
    this.pagiLength = length;
  }
  onIndex(length: number) {
    this.indexPage = length;
  }

  onChangeSort(data: string): void {
    this.sortKey = data;
    this.ascend = !this.ascend;
  }

  onDelete(product: Product): void {
    this.productService.remove(product);
    this.showWarning();
    this.router.navigate(['products']);
  }

  showWarning(): void {
    this.toastr.warning('You have successfully deleted the product!', 'Deleted', { timeOut: 4000 });
  }



}
