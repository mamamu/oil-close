Nightlife Coordinator
=========================

Project #2 for free code camp full stack.
User Stories:
* User Story: As an unauthenticated user, I can view all bars in my area.  ✔️
* User Story: As an authenticated user, I can add myself to a bar to indicate I am going there tonight. ✔️
* User Story: As an authenticated user, I can remove myself from a bar if I no longer want to go there. ✔️
* User Story: As an unauthenticated user, when I login I should not have to search again. ✔️


Using:  Express, Passport, Yelp api, React(react-dom, axios for requests)
------------

Todos,
- pen and paper chart it ✔️
- base app template creation (may put this off for reasons and just use structure defined in p&p above to do this one) ✔️
- inital api stuff--get a working api search ✔️
 
 react components  ✔️ for:
  - geolocation 👍
  - search 👍 (still need to ensure location/geolocation is persistant)
  - listdisplay (api) 👍
  - toggle (db) 👍 (have base component for toggle still need to wire up to db once it's in)
  - headcount (db) need to write component and db function, think this one needs to be updated on a timeout function.  make sure nothing left in toggle since doing this sep. now 👍   
  - headcount done with timer, not 100 percent happy--look into server push maybe better.
  
 api access middleware
  - clean up the api data, only need id, name, maybe link out to Yelp here, or maybe nothing else

 passport/user
  - google wired, ✔️
  - need to add twitter✔️
  - anyone else?
  - user page interaction 
    - same page login component complete ✔️
    - need to figure out how to access user in react. ✔️ (just needed to know if logged in-passed to component through props)

 db
 - design (what user info do I need, anything to keep track of other than appts.) complete ✔️
  - initial setup complete ✔️
  - need to write functions for adding/deleting appts. ✔️ 
  - could do a little more in the way of validation with appt queries.
  - load initial state on PlanVisit component to reflect db. (need query and route) ✔️
  - refine Appt (headcount and planvisit) query(s) to reflect 'today'.  Need to decide on appropriate logic here--strict cutoff time or X number of hours prior to Now. ✔️
 

- best way to display results (results are the combined set of api and db info)probably looking at toggle for you going, put headcount in separate component ✔️

- work on display issues on smallest screen-bootstrap fix for this?

- cleanup and refactor





