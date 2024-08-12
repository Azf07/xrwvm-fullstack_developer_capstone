import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null); // Change to null for initial state
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(null); // Change to null for initial state

  let params = useParams();
  let id = params.id;

  let dealer_url = `/djangoapp/dealer/${id}`;
  let reviews_url = `/djangoapp/reviews/dealer/${id}`;
  let post_review_url = `/postreview/${id}`;

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const retobj = await res.json();
      
      if (retobj.status === 200 && retobj.dealer) {
        setDealer(retobj.dealer);
      } else {
        console.error("Dealer not found or API returned an error");
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  };

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url);
      const retobj = await res.json();
      
      if (retobj.status === 200 && retobj.reviews) {
        if (retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      } else {
        console.error("Reviews not found or API returned an error");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const senti_icon = (sentiment) => {
    return sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    if (sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review_url}><img src={review_icon} style={{width:'10%', marginLeft:'10px', marginTop:'10px'}} alt='Post Review'/></a>);
    }
  }, [id]); // Adding `id` as a dependency to re-fetch if it changes

  if (!dealer) return <div>Loading Dealer Information...</div>;

  return (
    <div style={{margin:"20px"}}>
      <Header />
      <div style={{marginTop:"10px"}}>
        <h1 style={{color:"grey"}}>{dealer.full_name}{postReview}</h1>
        <h4 style={{color:"grey"}}>{dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state} </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <div>Loading Reviews....</div>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map(review => (
            <div className='review_panel' key={review.id}>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment'/>
              <div className='review'>{review.review}</div>
              <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
