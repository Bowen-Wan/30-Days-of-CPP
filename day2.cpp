
//Square Calculator
// Asks for Width and Length
// Calculates Area and Perimeter

#include <iostream>

int width{};
int length{};

int main(){
    
    std::cout<<"Welcome to the Rectangle Calculator!\n";

    std::cout<<"Length: ";
    std::cin>> length;
    
    std::cout<<"Width: ";
    std::cin>> width;

    int area{width*length};
    int perimeter{2*(width+length)};
    
    std::cout<<"The area of the rectangle is: "<<area << '\n';
    std::cout<<"The perimeter of the rectangle is: "<<perimeter << '\n';
    return 0;
    
}
