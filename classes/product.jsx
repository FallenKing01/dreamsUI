 export class Product {
    constructor(id, name, price, qty, tableId,menuProductId) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.qty = qty;
      this.tableId = tableId;
      this.menuProductId = menuProductId;
    }
  
    // Method to get the total price for this product
    getTotalPrice() {
      return this.price * this.qty;
    }
    
    getQty(){
      return this.qty;
    }
    getPrice(){
      return this.price;
    }
  }
  
  