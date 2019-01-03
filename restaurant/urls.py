from django.urls import path,re_path,include
from . import views

app_name = 'restaurant'

urlpatterns = [
    re_path(r'^$', views.index, name="home"),
    re_path(r'^restaurant/(?P<slug>[-\w]+)/$',views.homepage,name='details'),
]

#for title =  (?P<name>[\w|\W]+)
#for id =  (?P<id>\d+)