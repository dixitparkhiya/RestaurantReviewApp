from django.db import models
from django.utils.text import slugify
from django.conf import settings
from django.contrib.auth.models import User
# User = settings.AUTH_USER_MODEL


# Create your models here.
class restaurant(models.Model):
    name = models.CharField(max_length=50,unique=True)
    slug = models.SlugField(null=True,blank=True)
    neighborhood = models.CharField(max_length=50)
    img = models.ImageField(max_length=100)
    address = models.TextField(max_length=200)
    lat = models.FloatField(unique=True)
    lng = models.FloatField(unique=True)
    cuisine_type = models.CharField(max_length=20)
    contact = models.CharField(max_length=12,unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(restaurant, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Timetable(models.Model):
    name = models.OneToOneField(restaurant,on_delete=models.CASCADE)
    sunday = models.CharField(max_length=50,default='12:00 pm - 4:00 pm, 5:30 pm - 11:00 pm')
    monday = models.CharField(max_length=50,default='5:30 pm - 11:00 pm')
    tuesday = models.CharField(max_length=50,default='5:30 pm - 11:00 pm')
    wednesday = models.CharField(max_length=50,default='5:30 pm - 11:00 pm')
    thursday = models.CharField(max_length=50,default='5:30 pm - 11:00 pm')
    friday = models.CharField(max_length=50,default='5:30 pm - 11:00 pm')
    saturday = models.CharField(max_length=50,default='12:00 pm - 4:00 pm, 5:30 pm - 12:00 am')

    def __str__(self):
        return self.name.slug


class Comments(models.Model):
    name = models.ForeignKey(restaurant,on_delete=models.CASCADE,default=None)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    description = models.TextField(max_length=200)
    rating = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user) + ' on ' + self.name.name
