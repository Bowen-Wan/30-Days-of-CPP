//Temperature Converter
//1. Welcome user
//2. Ask for Celsuis
//3. Convert to Fahrenheit
//4. Display result


#include <iostream>


int main(){

std::cout<<"Welcome to the Temperature Converter!\n";

int Celsuis;
std::cout<<"Please enter the temperature in Celsuis: ";
std::cin >> Celsuis;

int Farenheit = (Celsuis * 9/5) + 32;
std::cout<<"The temperature in Farenheit is: "<<Farenheit;
return 0;

}


