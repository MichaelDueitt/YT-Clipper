import matplotlib.pyplot as plt
import sys

# Extract video length from command line arguments
videoLength = int(sys.argv[1:][0])

def getDataFromFile(name):
    with open(name, "r") as file:
        for line in file:
            return line

def preProcessData(data):
    tripletsArray = data.split("C ")
    dataPointsArray = []

    for triplets in tripletsArray:
        if triplets != "":
            pointsArray = triplets.split(" ")[:3]

            for points in pointsArray:
                p = points.split(",")
                dataPointsArray.append([float(p[0]), float(p[1])])

    return dataPointsArray

def plotCurve(points, videoLength, outputImage="plot.png"):
    x = [((p[0] - 1) * (videoLength) / (1000 - 1)) for p in points]
    y = [-p[1] for p in points]
    plt.plot(x, y, color='grey', linewidth=2, label='Line')
    plt.fill_between(x, y, color='grey', alpha=0.2, label='Fill')
    
    # Save the plot as an image file
    plt.savefig(outputImage)
    plt.close()

# Read data from the file
data = getDataFromFile("test.txt")
dataPointsArray = preProcessData(data)

# Plot the curve and save it as an image
plotCurve(dataPointsArray, videoLength)

# Print the path to the saved image file (optional)
print("Image saved as plot.png")
