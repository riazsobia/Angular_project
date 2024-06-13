import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl = 'http://localhost:3000/products';

  list$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    this.getAll()
  }

  getAll(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe(
      product => this.list$.next(product)
    );
  }

  get(id: number): Observable<Product> {
    id = typeof id === 'string' ? parseInt(id, 10) : id;
    const product: Product | undefined = this.list$.value.find(item => item.id === id);
    if (product) {
      return of(product);
    }
    return of(new Product());
  }

  // get(id: number | string): Observable<Product> {
  //   id = parseInt(('' + id), 10);
  //   return this.http.get<Product>(`${this.apiUrl}/${id}`);
  // }


  update(product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${product.id}`, product)
  }

  remove(product: Product): void {
    this.http.delete<Product>(`${this.apiUrl}/${product.id}`).subscribe(
      () => this.getAll()
    );
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
  }

  // getFeatured(randomized?: boolean): Product[] {
  //   const featured = this.list$.filter( item => item.featured );
  //   return randomized ? this.randomize(featured) : featured;
  // }

  // randomize(sourceArray: any[]): any[] {
  //   return sourceArray.sort( () => Math.random() - 0.5);
  // }

}


