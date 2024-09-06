from django.urls import path

from . import views

app_name = "law_enforcement_experience"

urlpatterns = [

    path('dataset/<str:dataset_id>/law_enforcement_experience/<int:current_page>/<int:page_size>',
         views.LawEnforcementExperience.as_view())

]
