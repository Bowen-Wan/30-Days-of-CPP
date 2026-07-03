
/*
Input:
    1. Price
    2. Quantity
    3. Tax percentage
Output:
    1. Subtotal
    2. Tax amount
    3. Total price
*/

#include <iostream>

int main(){

  std::cout<<"Price: ";
  float price{};
  std::cin>> price;

  std::cout<<"Quantity: ";
  float quantity{};
  std::cin>> quantity;
  
  std::cout<<"Tax Percentage: ";
  float percent{};
  std::cin>> percent;


  float subtotal{price*quantity};
  float tax{price*percent/100};
  float total_price{subtotal+tax};
    
  std::cout<<"The subtotal is: "<<subtotal<<'\n';
  std::cout<<"The tax amount is: "<<tax<<'\n';
  std::cout<<"The total price is: "<<total_price;
  
  return 0;
}

