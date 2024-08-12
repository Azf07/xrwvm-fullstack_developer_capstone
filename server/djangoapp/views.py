# Uncomment the required imports before adding the code

from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from datetime import datetime
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate

# Get an instance of a logger
logger = logging.getLogger(__name__)

# Create your views here.

# Create a `login_user` view to handle sign-in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provided credentials can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to log in current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

# Create a `logout_request` view to handle sign-out request
@csrf_exempt
def logout_request(request):
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)

# Create a `registration` view to handle sign-up request
@csrf_exempt
def registration(request):
    context = {}

    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    username_exist = False
    email_exist = False
    try:
        # Check if user already exists
        User.objects.get(username=username)
        username_exist = True
    except:
        # If not, simply log this is a new user
        logger.debug("{} is new user".format(username))

    # If it is a new user
    if not username_exist:
        # Create user in auth_user table
        user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name,password=password, email=email)
        # Login the user and redirect to list page
        login(request, user)
        data = {"userName":username,"status":"Authenticated"}
        return JsonResponse(data)
    else :
        data = {"userName":username,"error":"Already Registered"}
        return JsonResponse(data)

# Create a `get_dealerships` view to render the index page with a list of dealerships
@csrf_exempt
def get_dealerships(request, state="All"):
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})

# Create a `get_dealer_reviews` view to render the reviews of a dealer
@csrf_exempt
def get_dealer_reviews(request, dealer_id):
    reviews = list(CarModel.objects.filter(dealer_id=dealer_id).values('name', 'type', 'year'))
    return JsonResponse({"Reviews": reviews})

# Create a `get_dealer_details` view to render the dealer details
@csrf_exempt
def get_dealer_details(request, dealer_id):
    dealer = get_object_or_404(CarModel, dealer_id=dealer_id)
    dealer_details = {
        "Dealer ID": dealer.dealer_id,
        "Car Make": dealer.car_make.name,
        "Car Model": dealer.name,
        "Type": dealer.type,
        "Year": dealer.year
    }
    return JsonResponse(dealer_details)

# Create an `add_review` view to submit a review
@csrf_exempt
def add_review(request):
    data = json.loads(request.body)
    dealer_id = data.get('dealer_id')
    car_make = get_object_or_404(CarMake, id=data.get('car_make_id'))
    car_model = CarModel.objects.create(
        name=data.get('car_model'),
        dealer_id=dealer_id,
        car_make=car_make,
        type=data.get('type'),
        year=data.get('year'),
    )
    car_model.save()
    return JsonResponse({"status": "Review added successfully"})
