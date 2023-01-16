from eckity.algorithms.simple_evolution import SimpleEvolution
from eckity.breeders.simple_breeder import SimpleBreeder
from eckity.genetic_operators.crossovers.vector_k_point_crossover import VectorKPointsCrossover
from eckity.genetic_operators.selections.tournament_selection import TournamentSelection
from eckity.statistics.best_average_worst_statistics import BestAverageWorstStatistics
from eckity.subpopulation import Subpopulation
from eckity.creators.ga_creators.int_vector_creator import GAIntVectorCreator
from eckity.genetic_operators.mutations.vector_random_mutation import IntVectorOnePointMutation
from eckity.evaluators.simple_individual_evaluator import SimpleIndividualEvaluator
import numpy as np

class BinPackingEvaluator(SimpleIndividualEvaluator):
   
    def __init__(self, items=None, max_weight = None):
        super().__init__()

        self.items = items
        self.max_weight = max_weight

    def _evaluate_individual(self, individual):
        unique_set =set(individual.vector)
        value  = len(unique_set)
        weights = [0] *(len(self.items))

        for i in range(len(individual.vector)):
                weights[individual.vector[i]-1] += self.items[i]
        for j in range(len(weights)):
            if weights[j] > self.max_weight:
                return np.inf
        return value


class AlgoEvaluatoe():

    def getAlgo(items,max_weight,numOfGen):

        algo = SimpleEvolution(
                Subpopulation(creators = GAIntVectorCreator(length=len(items), bounds=(1,len(items))),
                            population_size=200,
                            # user-defined fitness evaluation method
                            evaluator=BinPackingEvaluator(items,max_weight),
                            # maximization problem (fitness is sum of values), so higher fitness is better
                            higher_is_better=False,
                            # genetic operators sequence to be applied in each generation
                            operators_sequence=[
                                VectorKPointsCrossover(probability=0.5, k=2),
                                IntVectorOnePointMutation(probability=0.05)
                            ],
                            selection_methods=[
                                # (selection method, selection probability) tuple
                                (TournamentSelection(tournament_size=4, higher_is_better=False), 1)
                            ]),
                breeder=SimpleBreeder(),
                max_workers=1,
                max_generation=int(numOfGen),
                statistics=BestAverageWorstStatistics()
            )

        algo.evolve()
        uniq_set = set(algo.execute())
        output = len(uniq_set)
        return output
        


    