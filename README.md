Nightlife Coordinator
=========================

Project #2 for free code camp full stack.
User Stories:
* User Story: As an unauthenticated user, I can view all bars in my area.  
* User Story: As an authenticated user, I can add myself to a bar to indicate I am going there tonight. 
* User Story: As an authenticated user, I can remove myself from a bar if I no longer want to go there. 
* User Story: As an unauthenticated user, when I login I should not have to search again. 


Using:  Express, Mongo/Mongoose, Passport, Yelp api, React, Axios

Single page app with optional geolocation and Google/Twitter Oath2 login.  Displays local venues and count of people going that night.  Logged in users can add their own status. Venue headcount updated via server sent event, with a polling backup on a longer timer since one browser tested has a tendency to drop the stream without picking it back up.


