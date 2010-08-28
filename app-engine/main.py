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
    params["W"] = self.request.get_range("W",default=3)
    params["U"] = self.request.get_range("U",default=3)
    params["S"] = self.request.get_range("S",default=3)
    params["T"] = self.request.get_range("T",default=3)
    params["A"] = self.request.get_range("A",default=10)
    params["R"] = self.request.get_range("R",default=0)
    params["D"] = self.request.get_range("D",default=0)
    params["hitRR"] = self.request.get("hitRR") == "Y" and "checked" or ""
    params["wndRR"] = self.request.get("wndRR") == "Y" and "checked" or ""
    params["poisn"] = self.request.get("poisn") == "Y" and "checked" or ""
    self.response.out.write(template.render(path, params))

def main():
  application = webapp.WSGIApplication([('/', MainHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
