a=float(input("Enter the first number:"))
b=float(input("Enter the second number:"))

print("1 for Add")
print("2 For Sub")
print("3 For Mul")
print("4 For Div")

Math=input("Enter your choice:")

if Math=='1':
    print("Ans",a+b)
elif Math=='2':
    print("Ans",a-b) 
elif Math=='3':
    print("Ans",a*b)
elif Math=='4':
    if b!=0:
        print("Ans",a/b)
    else:
        print("Div by 0 is not possible")
else:
    print("Invalid Querry")                       