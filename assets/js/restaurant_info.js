let restaurant;
var newMap;

var dbPro = idb.open('ReviewDb', 1, function (upgradeDb) {
    var keyvalStore = upgradeDb.createObjectStore('keyval', {
        keyPath: 'id'
    });
});


window.addEventListener('load',function(){
    if('serviceWorker' in navigator)
    {
    navigator.serviceWorker.register('/sw.js').then(function(){
        console.log("service worker registered ! ");
    }).catch(function(err){
        console.log("Registration failed ! "+err);
    });
    }
});

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [lat, lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiZGFya2FzdGVyMTAwIiwiYSI6ImNqbGM1MzAyMTNncjIzcHF5Yjcyb3JkMWQifQ.pEvs92IxGdiDDnL__y8w-Q',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.name;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
      
    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  let revall =[];
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews / &emsp; <span class="createRevi">Create Review <a href=""><i class="far fa-plus-square"></i></a><span>';
  container.appendChild(title);
    fetch(`http://localhost:1337/reviews/?restaurant_id=${self.restaurant.id}`).then(
  function(json){
      return json.json();
  }
  ).then(function(ok){
     const ul = document.getElementById('reviews-list');
     ok.forEach(review => {
     ul.appendChild(createReviewHTML(review));
     });
  container.appendChild(ul);
  });
    
  const revi = document.createElement('div');
    revi.setAttribute('id','createReview');
  revi.innerHTML=`<form action="http://localhost:1337/reviews/" method="post" id="review_form"><input type="hidden" name="restaurant_id" placeholder="Id" value=${self.restaurant.id} id="resId">
        <input type="text" name="name" placeholder="  Your name" required id="resName">
        <input type="number" name="rating" placeholder=" rating" min="0" max="5" required id="resRat"><br><br>
        <textarea name="comments"  rows="3" cols="30" id="resCom">
        </textarea><br><br>
        <input type="submit" value="SUBMIT" onclick="reviewStr()" id='submit'><br></form>`;
  container.append(revi);
/*
  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }*/
  
}
function reviewStr(){
     document.getElementById('submit').preventDefault();
      id = document.getElementById('resId').value;
      name = document.getElementById('resName').value;
      rating = document.getElementById('resRat').value;
      comment = document.getElementById('resCom').value;
      console.log(id,name,rating,comment);
      
      dbPro.then(function(db){
                            var keyvalStr = db.transaction('keyval','readwrite');
                                keyvalStr.objectStore('keyval').put({
                                    id : id,
                                    name :name,
                                    rating :rating,
                                    comment :comment,
                                });
                                return keyvalStr.complete;
                            });
      }

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
    var d = new Date( review.createdAt);
  date.innerHTML = d.toString();
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
