from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views  # Import views from the current app

app_name = 'djangoapp'

urlpatterns = [
    # Path for registration
    path(route='register', view=views.registration, name='register'),

    # Path for login
    path(route='login', view=views.login_user, name='login'),

    # Path for logout
    path(route='logout', view=views.logout_request, name='logout'),

    # Path for dealer reviews view
    path(route='dealer_reviews', view=views.get_dealer_reviews, name='dealer_reviews'),

    # Path for adding a review
    path(route='add_review', view=views.add_review, name='add_review'),

    # Path for getting the list of cars
    #path(route='get_cars', view=views.get_cars, name ='getcars'),

    # Path for getting dealerships
    path(route='get_dealers', view=views.get_dealerships, name='get_dealers'),

    # Path for getting dealer details
    path(route='dealer_details', view=views.get_dealer_details, name='dealer_details'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

