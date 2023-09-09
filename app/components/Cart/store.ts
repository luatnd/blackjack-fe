// for "sharing" "reactive" "state" with other components
// for "non-sharing" "reactive" "state" => use React state instead
// we don't need to put non-reactive data into store
import {makeAutoObservable} from "mobx"
import {CartItem, ProductId} from "./model";
import {isClientDevMode} from "@/utils/env";
import {logOutTaskManager} from "@/(EmptyLayout)/auth/service";

class CartStore {
  private items: Record<ProductId, CartItem> = {};

  constructor() {
    makeAutoObservable(this)
    this.restoreUserCart()
    this.registerCleanUpOnLogout()
  }

  hasProduct(productId: ProductId): boolean {
    return productId in this.items
  }

  increaseProduct(productId: ProductId) {
    if (productId in this.items) {
      const item = this.items[productId]
      item.qtty += 1
      console.log('{UserCart} add more productId: ', productId);
    } else {
      this.items[productId] = {
        pid: productId,
        qtty: 1
      }
      console.log('{UserCart} add productId: ', productId);
    }
    this.backupUserCart()
  }

  decreaseProduct(productId: ProductId) {
    if (productId in this.items) {
      const item = this.items[productId]
      item.qtty -= 1
      console.log('{UserCart} decrease productId: ', productId);

      // rm product from cart if qtty is 0
      if (item.qtty <= 0) {
        delete this.items[productId]
        console.log('{UserCart} removed productId: ', productId);
      }

      this.backupUserCart()
    }
  }

  // mark as async to avoid i/o
  async restoreUserCart() {
    if (typeof localStorage === 'undefined') return
    let d = localStorage.getItem('UserCart');
    try {
      this.items = JSON.parse(d ?? "")
    } catch (e) {
      this.items = {}
    }
  }

  backupUserCart() {
    if (typeof localStorage === 'undefined') return
    // TODO: encrypt data
    localStorage.setItem('UserCart', JSON.stringify(this.items));
  }

  clear() {
    this.items = {}
    localStorage.setItem('UserCart', '{}');
  }

  // register task to clean up on logout
  registerCleanUpOnLogout() {
    logOutTaskManager.register('cleanUserCart', () => this.clear())
  }
}

export const cartStore = new CartStore();


// debug
if (isClientDevMode) {
  //@ts-ignore
  window.tmp__cartStore = cartStore
}
