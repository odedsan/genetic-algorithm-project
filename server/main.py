
import sys, os
import random
import time

class responeData: 
	def __init__(self, nextFitValue, firstFitValue):
		self.nextFitValue = nextFitValue
		self.firstFitValue = firstFitValue

def blockPrint():
    sys.stdout = open(os.devnull, 'w')

def enablePrint():
    sys.stdout = sys.__stdout__

def nextfit(weight, c):
    res = 0
    rem = c
    for _ in range(len(weight)):
        if rem >= weight[_]:
            rem = rem - weight[_]
        else:
            res += 1
            rem = c - weight[_]
    return res
 

def firstFit(weight, n, c):
    res = 0
    bin_rem = [0]*n    
    for i in range(n):
        j = 0
        while( j < res):
            if (bin_rem[j] >= weight[i]):
                bin_rem[j] = bin_rem[j] - weight[i]
                break
            j+=1
        if (j == res):
            bin_rem[res] = c - weight[i]
            res= res+1
    return res
     

def bestFit(weight, n, c):
	res = 0;
	bin_rem = [0]*n;

	for i in range(n):
		j = 0;

		min = c + 1;
		bi = 0;

		for j in range(res):
			if (bin_rem[j] >= weight[i] and bin_rem[j] -
									weight[i] < min):
				bi = j;
				min = bin_rem[j] - weight[i];

		if (min == c + 1):
			bin_rem[res] = c - weight[i];
			res += 1;
		else: 
			bin_rem[bi] -= weight[i];
	return res;

def firstFitDecreasing(weight, n, c):
	res = 0
	bin_rem = [0]*n
	for i in range(n):
		j = 0
		while( j < res):
			if (bin_rem[j] >= weight[i]):
				bin_rem[j] = bin_rem[j] - weight[i]
				break
			j+=1			
		if (j == res):
			bin_rem[res] = c - weight[i]
			res= res+1
	return res
	
def firstFitDec(weight, n, c):

	weight.sort(reverse = True)

	return firstFit(weight, n, c)


def main():
	binSize = int(sys.argv[1])
	numOfWeights = int(sys.argv[2])
	weights = [0] * numOfWeights
	for i in range(numOfWeights):
		weights[i] = random.randint(1,binSize)
	n = len(weights)
	nextFitValue = 0
	nextFitRunningTime = 0.0
	firstFitValue = 0
	firstFitRunningTime = 0.0
	bestFitValue = 0
	bestFitRunningTime = 0.0
	firstFitDecValue = 0
	firstFitDecRunningTime = 0.0
	GAValue = 0
	GARunningTime = 0.0
	st = time.process_time()
	nextFitValue = nextfit(weights, binSize)
	et = time.process_time()
	nextFitRunningTime = et - st
	st = time.process_time()
	firstFitValue = firstFit(weights, n, binSize)
	et = time.process_time()
	firstFitRunningTime = et - st
	st = time.process_time()
	bestFitValue = bestFit(weights, n, binSize)
	et = time.process_time()
	bestFitRunningTime = et - st
	st = time.process_time()
	firstFitDecValue = firstFitDec(weights, n, binSize)
	et = time.process_time()
	firstFitDecRunningTime = et - st
	blockPrint()
	from GASolver_main import AlgoEvaluatoe
	st = time.process_time()
	GAValue = AlgoEvaluatoe.getAlgo(weights, binSize, sys.argv[3])
	et = time.process_time()
	GARunningTime = et - st 
	enablePrint()
	output = dict({'nextFitValue': nextFitValue, 'nextFitRunningTime':  1 + nextFitRunningTime, 'firstFitValue': firstFitValue, 'firstFitRunningTime': 1 + firstFitRunningTime,
	 'bestFitValue': bestFitValue, 'bestFitRunningTime': 1 + bestFitRunningTime, 'firstFitDecValue': firstFitDecValue, 'firstFitDecRunningTime': 1 + firstFitDecRunningTime,
	  'GAValue': GAValue, 'GARunningTime': GARunningTime, 'weights': weights})

	print(output)
if __name__ == "__main__":
    main()
