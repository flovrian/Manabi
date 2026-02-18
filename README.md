# Manabi
A multilingual Study App Concept 

![User Space](https://i.ibb.co/pVJZn1Z/manabi-space-opt.png)

## Background

Some day I've noticed how deranged and unproductive the general bubble of social media really is.
I recalled that some countries e.g. China limit users to educational content while the rest of the world is fed with the worst slop imaginable.

While I quickly realized that another 'social media platform', even if it was focused on studying, would just end up becoming the same mess all over again, I also realized that a platform purely for studying might bring some actual benefits.
Such environment would not only motivate students to study but also bring students
together.

You could argue that various applications such as Discord already achieve this but
I strongly disagree; these platforms are built to collect user data and to create
distractions, that's how their business works.

The idea of Manabi was to offer a place where you could connect with friends and other students, create notes, use the Pomodoro function, add events and to chat with each other.
Then again, you probably just realized that it wouldn't be much different from any other platform and this is exactly the reason why it just remained as a concept. (Well, besides my uncreativeness for website design.)

## Internals

Besides the authentication, it's very bare bones and currently isn't more than just a visual concept.
It works with multiple sessions that are being cached inside Redis but also the database, that way you're not forced to query the database on each authentication request; given that the session is already cached.
For user IDs it's using a snowflake, just like Twitter and Discord do.

Like mentioned, it supports the Japanese but also English language by using INTL.

![Login Page](https://i.ibb.co/NgwtYZXX/manabi-login-opt.png)

## Visuals

The visuals are inspired from Nintendo's 3DS, Switch and Wii; it offers beautiful UI elements while keeping its simplicity.
Whenever you switch to a different website path (currently only the friends path) it will overlay a short loading screen, also inspired by the 3DS.
Besides that it has small animations and loading animations while querying the API.

## Installation

I won't offer detailed instructions on how to get it up and running but the basics are:
- Run `npm install` and `npm update` in the root directory, the /client directory and /server directory. 
- Configure your .env file or system envs to match the ones provided in the code
- Run a Docker container with the newest Redis image and make sure it allows connections
- Run a PostgreSQL database and configure the credentials 
- Run the front && backend, then access the `/register` page and create an account, then login. 

Although, I'm unsure if you have to disable CORS in your browser in order to send backend requests.

## Credits
[Mii Profile Picture](https://mii-unsecure.ariankordi.net/?locale.lang=en-GB)
[GenEi Kiwami Gothic Font](https://www.freejapanesefont.com/genei-kiwami-gothic-font-download/)
[Mogiha Pen Font](https://www.freejapanesefont.com/mogiha-pen-font-free-download/)
[Zen Maru Gothic Font](https://fonts.google.com/specimen/Zen+Maru+Gothic)
[Modified Dock Icons / Bell Icon](https://www.flaticon.com/)

Google, Apple, and Discord logos are trademarks of their respective owners: Google, Apple Inc., and Discord Inc..




