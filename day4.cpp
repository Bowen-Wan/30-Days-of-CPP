
/*Input:
    Number
    Operator
    Number
*/

#include <iostream>


double getNumber1(){
  std::cout <<"First number: ";
  double num1{};
  std::cin >> num1;
  return num1;
};


char getOperator() {
  char op{};
  std::cout << "Operator: ";
  std::cin >> op;
  return op;
};

double getNumber2(){
    std::cout<<"Second number: ";
    double num2{};
    std::cin>> num2 ;
    return num2;
};


void calculate(double num1, char op, double num2){
    if (op == '+') {
        std::cout <<num1<<" + "<<num2<<" = "<< num1 + num2 << '\n';
    } else if (op == '-') {
        std::cout <<num1<<" - "<<num2<<" = "<< num1 - num2 << '\n';
    } else if (op == '*') {
        std::cout <<num1<<" * "<<num2<<" = "<< num1 * num2 << '\n';
    } else if (op == '/') {
        std::cout <<num1<<" / "<<num2<<" = "<< num1 / num2 << '\n';
    } else {
        std::cout << "Invalid operator\n";
    }
};

int main(){
    double num1 = getNumber1();
    char op = getOperator();
    double num2 = getNumber2();
    calculate(num1, op, num2);
    return 0;
}
