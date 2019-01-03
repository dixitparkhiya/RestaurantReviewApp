from django.shortcuts import render,redirect
from .models import restaurant
from django.contrib.auth.decorators import login_required
from .forms import createComment
# from .models import timetable
# Create your views here.


def index(request):
    qs = restaurant.objects.all()
    url = 'home/index.html'
    context = {"res": qs}
    return render(request, url, context)


# @login_required(login_url='/accounts/login/')
def homepage(request,slug):
    qs = restaurant.objects.get(slug=slug)
    if request.method == 'POST':
        form = createComment(request.POST)
        if form.is_valid():
            ins = form.save(commit=False)
            ins.user = request.user
            ins.name = qs
            ins.save()
            redirect('restaurant:home')
    else:
        form = createComment()
    url = 'restaurant/restaurant.html'
    context = {"res": qs,'form':form}
    return render(request,url,context)


