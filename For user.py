num1=float(input("Enter first value:"))
num2=float(input("Enter second value:"))
print("section option")
print("1.add")
print("2.sub")
print("3.mult")
print("4.dive")

x=input ("enter choice(1/2/3/4):")


if x=='1':

    print("result:",num1+num2)

elif x=='2':

    print("result:",num1- num2 )

elif x=='3':

    print("result:",num1*num2)

elif x=='4':

  if num2!=0:
    print("result:",num1 / num2)
  else:
    print("0 re divide hue!!")
else:
    print("Tamaku gote jinsa bujha paduni badhe.")





