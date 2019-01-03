# Generated by Django 2.0.6 on 2019-01-03 04:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(max_length=200)),
                ('rating', models.IntegerField()),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='restaurant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('slug', models.SlugField(blank=True, null=True)),
                ('neighborhood', models.CharField(max_length=50)),
                ('img', models.ImageField(upload_to='')),
                ('address', models.TextField(max_length=200)),
                ('lat', models.FloatField(unique=True)),
                ('lng', models.FloatField(unique=True)),
                ('cuisine_type', models.CharField(max_length=20)),
                ('contact', models.CharField(max_length=12, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Timetable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sunday', models.CharField(default='12:00 pm - 4:00 pm, 5:30 pm - 11:00 pm', max_length=50)),
                ('monday', models.CharField(default='5:30 pm - 11:00 pm', max_length=50)),
                ('tuesday', models.CharField(default='5:30 pm - 11:00 pm', max_length=50)),
                ('wednesday', models.CharField(default='5:30 pm - 11:00 pm', max_length=50)),
                ('thursday', models.CharField(default='5:30 pm - 11:00 pm', max_length=50)),
                ('friday', models.CharField(default='5:30 pm - 11:00 pm', max_length=50)),
                ('saturday', models.CharField(default='12:00 pm - 4:00 pm, 5:30 pm - 12:00 am', max_length=50)),
                ('name', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='restaurant.restaurant')),
            ],
        ),
        migrations.AddField(
            model_name='comments',
            name='name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='restaurant.restaurant'),
        ),
        migrations.AddField(
            model_name='comments',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
