#include <iostream>
#include <vector>
using namespace std;

int main(int argc, const char* argv[])
{
  std::vector<std::string> args(argv, argv + argc);

  for (const auto &arg : args)
  {
    std::cout << arg << std::endl;
  }

  return 0;
}
