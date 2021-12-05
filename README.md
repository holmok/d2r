# d3r
## An extensible service for redirecting urls and url shortening

This is currently undergoing dev and is VERY simple as of now.

## Done

* Operates as a very simple redirect service with regexp evaluations to targets and a fallback.  
* It supports setting the status (defaults to 301) and query string forwarding.

## TODO:

* Add a state store plugin implementation to replace yaml file (initial support for postgres and sqlite)
* Add end point for URL shortening (post a url and info SEE: DetourInfo interface) and get a code
* Add simple auth middleware using JWT
* Add add admin endpoint for managing
* Support partial url part forwarding (ex:  `http://oldhost.com/original/this/is/a/path` ==> `http://newhost.com/new/[match]/new-path` ==> `http://newhost.com/new/this/is/a/new-path`)

## Usage

1. Clone the repo (fork it or just clone from this one).
2. run `yarn`
3. develop with `yarn dev` (gives you friendly logging and nodemon)
4. build with `yarn build` (builds to dist folder)
5. production run with `yarn start` (after you have built it)