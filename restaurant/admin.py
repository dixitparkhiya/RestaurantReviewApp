from django.contrib import admin
from .models import restaurant,Timetable
from .models import Comments

admin.site.register(restaurant)
admin.site.register(Timetable)
admin.site.register(Comments)
