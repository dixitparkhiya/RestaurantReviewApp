from django.http import HttpResponse
from django.shortcuts import render
# from django.apps import apps
#from DreamLand.restaurant.models import restaurant

def about(request):
    return HttpResponse('This is About Page')


# def home(request):
#     #qs = restaurant.objects.all()
#     url = 'home/index.html'
#     context = {}
#     return render(request,url,context)