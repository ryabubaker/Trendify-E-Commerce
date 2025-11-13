import { Component, EventEmitter, Output, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-card.component.html',
  styleUrls: ['./cart-card.component.css'],
})
export class CartCardComponent {
  private readonly cartService = inject(CartService);

  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly image = input.required<string>();
  readonly count = input.required<number>();
  readonly price = input.required<number>();

  lineTotal = computed(() => this.price() * this.count());

  loadingTrash = false;
  loadingPlus = false;
  loadingMinus = false;

  @Output() itemRemoved = new EventEmitter<string>();
  @Output() countUpdated = new EventEmitter<{ id: string; count: number }>();

  removeItem(): void {
    const id = this.id();
    if (!id) return;

    this.loadingTrash = true;
    this.cartService.removeSpicificCartItem(id).subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.loadingTrash = false;
        this.itemRemoved.emit(id);
      },
      error: () => (this.loadingTrash = false),
    });
  }

  updateCount(delta: 1 | -1): void {
    const id = this.id();
    const next = this.count() + delta;
    if (!id || next < 1) return;

    delta === 1 ? (this.loadingPlus = true) : (this.loadingMinus = true);

    this.cartService.updataCartProductQuntity(id, next).subscribe({
      next: () => {
        delta === 1 ? (this.loadingPlus = false) : (this.loadingMinus = false);
        this.countUpdated.emit({ id, count: next });
      },
      error: () => {
        delta === 1 ? (this.loadingPlus = false) : (this.loadingMinus = false);
      },
    });
  }
}
