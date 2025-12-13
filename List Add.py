a=["apple","mango",35,"kumbhi",67,"jjbk"]

print(len(a))

#add element

a.insert(3,"act")       #insert at user place
print(a)

a.append("dk")          #insert at last
print(a)
#OR
a.insert(len(a),"2ndapp") 
print(a)  


x=[1,2,3]                 #add a list to another list
x.append((3,4,5))
print(x)

lista=[1,2,3]             #add 2 list
listb=[4,5,6]
lista.extend(listb)
print(lista)
