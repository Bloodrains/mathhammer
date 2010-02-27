#!/usr/bin/python
import math
class DiceModel:
    def __init__(self,reroll=False):
        self.reroll = reroll
    def probability(self,value):
        #default probability for a "Greater than or equal" roll
        p = float(7-value)/6
        if self.reroll:
            p = 1 - (1 - p ) **2
        return p
    def roll(self,num_dice,value):
        result = [0]*(num_dice+1)
        probability = self.probability(value)
        nbang = math.factorial(num_dice)
        if num_dice == 0:
            result = [1]
        for count in range(num_dice,-1,-1):
            result[count] = (probability**count * 
                            (1-probability)**(num_dice-count) * 
                            nbang / math.factorial(num_dice-count) / 
                            math.factorial(count))

        return result
    def test(self,num_dice,value):
        t = self.roll(num_dice,value)
        print t,sum(t)

