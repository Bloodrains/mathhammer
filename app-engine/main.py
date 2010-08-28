#!/usr/bin/env python
import wsgiref.handlers
import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

__author__ = "mabrowning@txbrownings.com (Mark Browning)"

class MainHandler(webapp.RequestHandler):

  def get(self):
    path = os.path.join(os.path.dirname(__file__), 'templates')
    path = os.path.join(path, 'index.html')
    params = {}
    achecks = {}
    dchecks = {}
    achecks["hitRR"]  = {"txt":"Reroll failed to-hit","class":"green"}
    achecks["hitRRs"] = {"txt":"Reroll successful to-hit","class":"red"}
    achecks["wndRR"]  = {"txt":"Reroll failed to-wound","class":"green"}
    achecks["wndRRs"] = {"txt":"Reroll successful to-wound","class":"red"}
    achecks["poisn"]  = {"txt":"Poison","class":"green"}
    dchecks["arsRRs"] = {"txt":"Reroll successful armor save","class":"green"}
    dchecks["arsRR"] = {"txt":"Reroll failed armor save","class":"red"}
    params["W"] = self.request.get_range("W",default=3)
    params["U"] = self.request.get_range("U",default=3)
    params["S"] = self.request.get_range("S",default=3)
    params["T"] = self.request.get_range("T",default=3)
    params["A"] = self.request.get_range("A",default=10)
    params["R"] = self.request.get_range("R",default=0)
    params["D"] = self.request.get_range("D",default=0)
    for check,value in dict(achecks,**dchecks).items():
        value["checked"] = self.request.get(check) == "Y" and "checked" or ""
        value["id"] = check
    def sk(x): return x[1]["class"]
    params["achecks"] = [value for key,value in sorted(achecks.iteritems(),key=sk)]
    params["dchecks"] = [value for key,value in sorted(dchecks.iteritems(),key=sk)]

    self.response.out.write(template.render(path, params))

def main():
  application = webapp.WSGIApplication([('/', MainHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
