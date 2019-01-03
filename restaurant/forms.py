from django import forms
from . import models


class createComment(forms.ModelForm):
    class Meta:
        model = models.Comments
        fields = [
            'description',
            'rating'
        ]

    # def save(self, commit=True,*args,**kwargs):
    #     obj = super(createComment,self).save(commit=False,*args,*kwargs)
    #     obj.user = "dixit"
    #     obj.name = "DreamLand"
    #     if commit:
    #         obj.save()
    #     return obj
