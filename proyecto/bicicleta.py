class Bicicleta:
    def __init__(self, color, marca):
        self.color = color
        self.marca = marca

    def __str__(self):
        return f"Bicicleta de color {self.color}, marca {self.marca}"
    
    def getColor(self):
        return self.color

bici = Bicicleta("rojo")
print(bici)