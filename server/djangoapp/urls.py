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

    # Path for getting dealerships
    path(route='get_dealers', view=views.get_dealerships, name='get_dealers'),
        path(route='get_dealers/<str:state>', view=views.get_dealerships, name='get_dealers_by_state'),

    # Path for getting dealer details
    path(route='dealer/<int:dealer_id>', view=views.get_dealer_details, name='dealer_details'),

    # Path for getting reviews of a specific dealer by ID
    path(route='reviews/dealer/<int:dealer_id>', view=views.get_dealer_reviews, name='dealer_reviews_by_id'),

    path(route='get_cars', view=views.get_cars, name ='getcars'),

    path(route='get_inventory/<int:dealer_id>', view=views.get_inventory, name='get_inventory'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)